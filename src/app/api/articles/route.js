import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { buildPublishDistribution } from "@/lib/indexNow";
import { calculateSeoQuality, enrichArticleSeo } from "@/lib/seoQuality";
import { validateOurViewQuality } from "@/utils/editorialQuality";
import { validateArticle } from "@/utils/validationSchemas";

export async function GET() {
  try {
    const snapshot = await adminDb
      .collection("articles")
      .where("status", "==", "published")
      .get();
    const articles = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, data: articles }, { status: 200 });
  } catch (error) {
    console.error("GET articles error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch articles." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const configuredKey = process.env.NEWS_AUTOMATION_API_KEY;
    const suppliedKey = request.headers.get("X-Automation-Key");
    if (!configuredKey) {
      console.error("NEWS_AUTOMATION_API_KEY is not configured.");
      return NextResponse.json(
        { success: false, message: "Publishing API is not configured." },
        { status: 503 },
      );
    }
    if (suppliedKey !== configuredKey) {
      return NextResponse.json({ success: false, message: "Unauthorized automation request." }, { status: 401 });
    }

    const receivedBody = await request.json();
    const sourceUrls = Array.isArray(receivedBody.sourceUrls)
      ? [...new Set(receivedBody.sourceUrls.map((url) => String(url).trim()).filter(Boolean))]
      : [];
    const body = enrichArticleSeo({ ...receivedBody, sourceUrls });
    const errors = validateArticle(body);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, message: "Validation failed.", errors }, { status: 400 });
    }
    const status = body.status || "draft";
    const seoQuality = calculateSeoQuality(body);
    const safetyErrors = [];
    const ourViewError = validateOurViewQuality(body.ourView, body);

    if (ourViewError) safetyErrors.push(ourViewError);
    if (!["draft", "published"].includes(status)) {
      safetyErrors.push("Status must be draft or published.");
    }
    if (!body.sourceName?.trim()) safetyErrors.push("Source attribution is required.");
    if (!body.sourceNote?.trim()) safetyErrors.push("A source note is required.");
    if (!sourceUrls.length || sourceUrls.some((url) => !validHttpUrl(url))) {
      safetyErrors.push("At least one valid source URL is required.");
    }
    if (body.publicationSafety?.passed !== true) {
      safetyErrors.push("A passing backend publication safety report is required.");
    }
    const allowedSourceUsage = new Set([
      "facts_and_attribution",
      "official_public_source",
      "licensed",
      "creative_commons",
      "public_domain",
      "written_permission",
    ]);
    if (!allowedSourceUsage.has(body.sourceUsageBasis)) {
      safetyErrors.push("A valid source usage basis is required.");
    }
    if (status === "published" && body.image && body.imageRightsConfirmed !== true) {
      safetyErrors.push("Image ownership or licence must be confirmed.");
    }

    if (
      status === "published"
      && body.publicationSafety?.requiresHumanReview
      && body.copyrightReviewConfirmed !== true
    ) {
      safetyErrors.push("Human copyright review confirmation is required.");
    }
    if (safetyErrors.length) {
      return NextResponse.json(
        { success: false, message: "Publication safety validation failed.", errors: safetyErrors },
        { status: 400 },
      );
    }

    if (sourceUrls.length) {
      const sourceDuplicate = await adminDb
        .collection("articles")
        .where("sourceUrls", "array-contains-any", sourceUrls.slice(0, 10))
        .limit(1)
        .get();
      if (!sourceDuplicate.empty) {
        const existing = sourceDuplicate.docs[0];
        if (status === "published" && existing.get("status") === "draft") {
          const timestamp = FieldValue.serverTimestamp();
          await existing.ref.update({
            title: body.title.trim(),
            slug: body.slug.trim(),
            summary: body.summary.trim(),
            content: body.content.trim(),
            ourView: body.ourView || "",
            image: body.image || "",
            category: body.category.trim(),
            tags: Array.isArray(body.tags) ? body.tags : [],
            author: body.author || "Contextra Editorial",
            status: "published",
            sourceName: body.sourceName,
            sourceUrls,
            sourceNote: body.sourceNote,
            sourceUsageBasis: body.sourceUsageBasis,
            sourceRightsConfirmed: body.sourceRightsConfirmed === true,
            imageRightsConfirmed: body.imageRightsConfirmed === true,
            copyrightReviewConfirmed: body.copyrightReviewConfirmed === true,
            publicationSafety: body.publicationSafety,
            articleType: body.articleType || body.editorialMode || "explainer",
            editorialMode: body.editorialMode || body.articleType || "explainer",
            verification: body.verification || {},
            verificationConfidence: Number(body.verificationConfidence || 0),
            sourcePolicy: body.sourcePolicy || {},
            automationDecision: body.automationDecision || {},
            imagePrompt: body.imagePrompt || "",
            imageAltText: body.imageAltText || "",
            seoTitle: body.seoTitle,
            metaDescription: body.metaDescription,
            socialCaption: body.socialCaption,
            focusKeyword: body.focusKeyword,
            relatedKeywords: body.relatedKeywords,
            seoQuality,
            publishedAt: timestamp,
            updatedAt: timestamp,
          });
          const distribution = await buildPublishDistribution(body);
          return NextResponse.json(
            {
              success: true,
              message: "Existing draft published successfully.",
              data: {
                id: existing.id,
                slug: body.slug.trim(),
                status: "published",
                duplicate: true,
                seoQuality,
                distribution,
              },
            },
            { status: 200 },
          );
        }
        return existingArticleResponse(
          existing,
          "This source story already exists.",
        );
      }
    }

    const recentSnapshot = await adminDb.collection("articles").limit(200).get();
    const nearDuplicate = recentSnapshot.docs.find(
      (doc) => titleSimilarity(doc.get("title"), body.title) >= NEAR_DUPLICATE_TITLE_THRESHOLD,
    );
    if (nearDuplicate) {
      return NextResponse.json(
        {
          success: false,
          message: "A very similar article already exists.",
          duplicate: {
            id: nearDuplicate.id,
            title: nearDuplicate.get("title") || "",
            slug: nearDuplicate.get("slug") || "",
          },
        },
        { status: 409 },
      );
    }


    const duplicate = await adminDb.collection("articles").where("slug", "==", body.slug.trim()).limit(1).get();
    if (!duplicate.empty) {
      const existing = duplicate.docs[0];
      return existingArticleResponse(existing);
    }

    const timestamp = FieldValue.serverTimestamp();
    const payload = {
      title: body.title.trim(),
      slug: body.slug.trim(),
      summary: body.summary.trim(),
      content: body.content.trim(),
      ourView: body.ourView || "",
      image: body.image || "",
      category: body.category.trim(),
      tags: Array.isArray(body.tags) ? body.tags : [],
      author: body.author || "Contextra Editorial",
      authorId: body.authorId || "",
      status,
      featured: Boolean(body.featured),
      showOnHomepage: Boolean(body.showOnHomepage),
      homepageOrder: Number(body.homepageOrder ?? 999),
      pollId: body.pollId || "",
      imagePrompt: body.imagePrompt || "",
      imageAltText: body.imageAltText || "",
      seoTitle: body.seoTitle || "",
      metaDescription: body.metaDescription || "",
      sourceName: body.sourceName || "",
      sourceUrls,
      sourceNote: body.sourceNote || "",
      sourceUsageBasis: body.sourceUsageBasis || "facts_and_attribution",
      sourceRightsConfirmed: body.sourceRightsConfirmed === true,
      imageRightsConfirmed: body.imageRightsConfirmed === true,
      copyrightReviewConfirmed: body.copyrightReviewConfirmed === true,
      publicationSafety: body.publicationSafety,
      articleType: body.articleType || body.editorialMode || "explainer",
      editorialMode: body.editorialMode || body.articleType || "explainer",
      verification: body.verification || {},
      verificationConfidence: Number(body.verificationConfidence || 0),
      sourcePolicy: body.sourcePolicy || {},
      automationDecision: body.automationDecision || {},
      socialCaption: body.socialCaption || "",
      focusKeyword: body.focusKeyword || "",
      relatedKeywords: Array.isArray(body.relatedKeywords) ? body.relatedKeywords : [],
      seoQuality,
      trendingScore: Number(body.trendingScore || 0),
      views: Number(body.views || 0),
      publishedAt: status === "draft" ? null : timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const docRef = await adminDb.collection("articles").add(payload);
    const distribution = await buildPublishDistribution(payload, { notify: status === "published" });
    return NextResponse.json(
      {
        success: true,
        message: "Article created successfully.",
        data: {
          id: docRef.id,
          slug: payload.slug,
          status: payload.status,
          seoQuality,
          distribution,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST article error:", error);
    return NextResponse.json({ success: false, message: error.message || "Failed to create article." }, { status: 500 });
  }
}
const NEAR_DUPLICATE_TITLE_THRESHOLD = 0.72;

function normalizeTitle(value = "") {
  return value
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function titleSimilarity(left, right) {
  const leftTokens = new Set(normalizeTitle(left));
  const rightTokens = new Set(normalizeTitle(right));
  if (leftTokens.size < 4 || rightTokens.size < 4) return 0;
  const intersection = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  const union = new Set([...leftTokens, ...rightTokens]).size;
  return union ? intersection / union : 0;
}

async function existingArticleResponse(doc, message = "Article already exists.") {
  const article = {
    slug: doc.get("slug") || "",
    category: doc.get("category") || "",
    tags: doc.get("tags") || [],
  };
  const distribution = await buildPublishDistribution(article, { notify: false });
  return NextResponse.json({
    success: true,
    message,
    data: {
      id: doc.id,
      slug: article.slug,
      status: doc.get("status") || "published",
      duplicate: true,
      seoQuality: doc.get("seoQuality") || null,
      distribution,
    },
  }, { status: 200 });
}

function validHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
