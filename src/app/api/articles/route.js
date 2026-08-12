import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { validateArticle } from "@/utils/validationSchemas";

export async function GET() {
  try {
    const snapshot = await adminDb.collection("articles").orderBy("createdAt", "desc").get();
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

    const body = await request.json();
    const errors = validateArticle(body);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, message: "Validation failed.", errors }, { status: 400 });
    }

    const duplicate = await adminDb.collection("articles").where("slug", "==", body.slug.trim()).limit(1).get();
    if (!duplicate.empty) {
      const existing = duplicate.docs[0];
      return NextResponse.json(
        {
          success: true,
          message: "Article already exists.",
          data: {
            id: existing.id,
            slug: body.slug.trim(),
            status: existing.get("status") || body.status || "published",
          },
        },
        { status: 200 },
      );
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
      status: body.status || "published",
      featured: Boolean(body.featured),
      showOnHomepage: Boolean(body.showOnHomepage),
      homepageOrder: Number(body.homepageOrder ?? 999),
      pollId: body.pollId || "",
      imagePrompt: body.imagePrompt || "",
      imageAltText: body.imageAltText || "",
      seoTitle: body.seoTitle || "",
      metaDescription: body.metaDescription || "",
      sourceName: body.sourceName || "",
      sourceUrls: Array.isArray(body.sourceUrls) ? body.sourceUrls : [],
      sourceNote: body.sourceNote || "",
      socialCaption: body.socialCaption || "",
      focusKeyword: body.focusKeyword || "",
      relatedKeywords: Array.isArray(body.relatedKeywords) ? body.relatedKeywords : [],
      trendingScore: Number(body.trendingScore || 0),
      views: Number(body.views || 0),
      publishedAt: body.status === "draft" ? null : timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const docRef = await adminDb.collection("articles").add(payload);
    return NextResponse.json(
      {
        success: true,
        message: "Article created successfully.",
        data: {
          id: docRef.id,
          slug: payload.slug,
          status: payload.status,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST article error:", error);
    return NextResponse.json({ success: false, message: error.message || "Failed to create article." }, { status: 500 });
  }
}
