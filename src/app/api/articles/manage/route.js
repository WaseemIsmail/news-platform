import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { calculateSeoQuality, enrichArticleSeo } from "@/lib/seoQuality";
import { readingTime } from "@/utils/readingTime";
import { validateArticle } from "@/utils/validationSchemas";

const MAX_LIST_LIMIT = 500;
const MAX_DELETE_COUNT = 50;
const RELATED_COLLECTIONS = ["comments", "reactions", "bookmarks"];
const EDITABLE_FIELDS = new Set([
  "title",
  "summary",
  "content",
  "ourView",
  "category",
  "tags",
  "author",
  "image",
  "imageAltText",
  "seoTitle",
  "metaDescription",
  "focusKeyword",
  "relatedKeywords",
  "socialCaption",
  "featured",
  "showOnHomepage",
  "homepageOrder",
]);

function authorize(request) {
  const configuredKey = String(process.env.NEWS_AUTOMATION_API_KEY || "");
  const suppliedKey = String(request.headers.get("X-Automation-Key") || "");

  if (!configuredKey) {
    console.error("NEWS_AUTOMATION_API_KEY is not configured.");
    return NextResponse.json(
      { success: false, message: "Article management API is not configured." },
      { status: 503 },
    );
  }

  const configuredBuffer = Buffer.from(configuredKey);
  const suppliedBuffer = Buffer.from(suppliedKey);
  const matches = configuredBuffer.length === suppliedBuffer.length
    && timingSafeEqual(configuredBuffer, suppliedBuffer);

  if (!matches) {
    return NextResponse.json(
      { success: false, message: "Unauthorized automation request." },
      { status: 401 },
    );
  }

  return null;
}

function asIsoDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return typeof value === "string" ? value : null;
}

function mapArticle(doc) {
  const article = doc.data();
  return {
    id: doc.id,
    title: article.title || "",
    slug: article.slug || "",
    summary: article.summary || "",
    content: article.content || "",
    ourView: article.ourView || "",
    category: article.category || "",
    tags: Array.isArray(article.tags) ? article.tags : [],
    author: article.author || "Contextra Editorial",
    image: article.image || "",
    imageAltText: article.imageAltText || "",
    seoTitle: article.seoTitle || "",
    metaDescription: article.metaDescription || "",
    focusKeyword: article.focusKeyword || "",
    relatedKeywords: Array.isArray(article.relatedKeywords) ? article.relatedKeywords : [],
    socialCaption: article.socialCaption || "",
    featured: article.featured === true,
    showOnHomepage: article.showOnHomepage === true,
    homepageOrder: Number(article.homepageOrder ?? 999),
    sourceName: article.sourceName || "",
    sourceUrls: Array.isArray(article.sourceUrls) ? article.sourceUrls : [],
    status: article.status || "draft",
    readingTime: article.readingTime || "",
    seoQuality: article.seoQuality || null,
    publishedAt: asIsoDate(article.publishedAt),
    createdAt: asIsoDate(article.createdAt),
    updatedAt: asIsoDate(article.updatedAt),
  };
}

function normalizeCategory(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeTags(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value
    .map((tag) => String(tag).toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-"))
    .filter(Boolean))]
    .slice(0, 12);
}

function normalizeKeywords(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => String(item).trim()).filter(Boolean))].slice(0, 8);
}

function cleanUpdates(updates) {
  const result = {};
  for (const [key, value] of Object.entries(updates || {})) {
    if (!EDITABLE_FIELDS.has(key)) continue;
    result[key] = value;
  }

  if ("category" in result) result.category = normalizeCategory(result.category);
  if ("tags" in result) result.tags = normalizeTags(result.tags);
  if ("relatedKeywords" in result) result.relatedKeywords = normalizeKeywords(result.relatedKeywords);
  if ("homepageOrder" in result) {
    result.homepageOrder = result.showOnHomepage
      ? Math.max(1, Number(result.homepageOrder) || 1)
      : 999;
  }

  for (const key of [
    "title", "summary", "content", "ourView", "category", "author", "image",
    "imageAltText", "seoTitle", "metaDescription", "focusKeyword", "socialCaption",
  ]) {
    if (key in result) result[key] = String(result[key] ?? "").trim();
  }

  for (const key of ["featured", "showOnHomepage"]) {
    if (key in result) result[key] = result[key] === true;
  }

  return result;
}

function validationErrors(article) {
  const errors = validateArticle(article);
  if (!article.ourView?.trim()) {
    errors.ourView = "Why this story matters is required.";
  } else if (article.ourView.trim().length < 40) {
    errors.ourView = "Why this story matters must be at least 40 characters.";
  }
  if (article.title?.length > 180) errors.title = "Title must be 180 characters or fewer.";
  if (article.summary?.length > 1000) errors.summary = "Summary must be 1,000 characters or fewer.";
  if (article.content?.length > 100000) errors.content = "Content is too long.";
  return errors;
}

export async function GET(request) {
  const authResponse = authorize(request);
  if (authResponse) return authResponse;

  try {
    const { searchParams } = new URL(request.url);
    const requestedLimit = Number(searchParams.get("limit") || 200);
    const limit = Math.min(MAX_LIST_LIMIT, Math.max(1, Number.isFinite(requestedLimit) ? requestedLimit : 200));
    const snapshot = await adminDb
      .collection("articles")
      .where("status", "==", "published")
      .get();
    const articles = snapshot.docs
      .map(mapArticle)
      .sort((left, right) => {
        const leftDate = Date.parse(left.publishedAt || left.createdAt || "") || 0;
        const rightDate = Date.parse(right.publishedAt || right.createdAt || "") || 0;
        return rightDate - leftDate;
      })
      .slice(0, limit);

    return NextResponse.json({ success: true, data: articles, count: articles.length });
  } catch (error) {
    console.error("GET managed articles error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load published articles." },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  const authResponse = authorize(request);
  if (authResponse) return authResponse;

  try {
    const body = await request.json();
    const id = String(body?.id || "").trim();
    const updates = cleanUpdates(body?.updates);
    if (!id || !body?.updates || typeof body.updates !== "object" || Array.isArray(body.updates)) {
      return NextResponse.json(
        { success: false, message: "Article ID and updates are required." },
        { status: 400 },
      );
    }
    if (!Object.keys(updates).length) {
      return NextResponse.json(
        { success: false, message: "No supported article fields were provided." },
        { status: 400 },
      );
    }

    const ref = adminDb.collection("articles").doc(id);
    const snapshot = await ref.get();
    if (!snapshot.exists || snapshot.get("status") !== "published") {
      return NextResponse.json(
        { success: false, message: "Published article not found." },
        { status: 404 },
      );
    }

    const current = snapshot.data();
    const merged = enrichArticleSeo({ ...current, ...updates, status: "published" });
    const errors = validationErrors(merged);
    if (Object.keys(errors).length) {
      return NextResponse.json(
        { success: false, message: "Validation failed.", errors },
        { status: 400 },
      );
    }

    const editablePayload = {};
    for (const key of EDITABLE_FIELDS) {
      if (key in merged && (key in updates || [
        "tags", "seoTitle", "metaDescription", "focusKeyword", "relatedKeywords",
        "socialCaption", "imageAltText",
      ].includes(key))) {
        editablePayload[key] = merged[key];
      }
    }
    editablePayload.readingTime = readingTime(merged.content || "");
    editablePayload.seoQuality = calculateSeoQuality(merged);
    editablePayload.updatedAt = FieldValue.serverTimestamp();
    editablePayload.lastEditedBy = "contexta-news-monitor";

    await ref.update(editablePayload);
    const updated = await ref.get();
    return NextResponse.json({
      success: true,
      message: "Published article updated successfully.",
      data: mapArticle(updated),
    });
  } catch (error) {
    console.error("PATCH managed article error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update published article." },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  const authResponse = authorize(request);
  if (authResponse) return authResponse;

  try {
    const body = await request.json();
    const ids = [...new Set(Array.isArray(body?.ids)
      ? body.ids.map((id) => String(id).trim()).filter(Boolean)
      : [])];
    if (!ids.length || ids.length > MAX_DELETE_COUNT) {
      return NextResponse.json(
        { success: false, message: `Choose between 1 and ${MAX_DELETE_COUNT} published articles.` },
        { status: 400 },
      );
    }

    const articleSnapshots = await Promise.all(
      ids.map((id) => adminDb.collection("articles").doc(id).get()),
    );
    const invalidIds = articleSnapshots
      .filter((snapshot) => !snapshot.exists || snapshot.get("status") !== "published")
      .map((snapshot) => snapshot.id);
    if (invalidIds.length) {
      return NextResponse.json(
        { success: false, message: "One or more selected published articles no longer exist.", invalidIds },
        { status: 409 },
      );
    }

    const relatedSnapshots = await Promise.all(ids.flatMap((id) =>
      RELATED_COLLECTIONS.map((collectionName) =>
        adminDb.collection(collectionName).where("articleId", "==", id).get()
      )
    ));
    const writer = adminDb.bulkWriter();
    writer.onWriteError((error) => error.failedAttempts < 3);
    articleSnapshots.forEach((snapshot) => writer.delete(snapshot.ref));
    relatedSnapshots.forEach((snapshot) => {
      snapshot.docs.forEach((doc) => writer.delete(doc.ref));
    });
    await writer.close();

    const relatedDeleted = relatedSnapshots.reduce((total, snapshot) => total + snapshot.size, 0);
    return NextResponse.json({
      success: true,
      message: `${ids.length} published article${ids.length === 1 ? "" : "s"} deleted.`,
      data: { deleted: ids.length, deletedIds: ids, relatedDeleted },
    });
  } catch (error) {
    console.error("DELETE managed articles error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete published articles." },
      { status: 500 },
    );
  }
}
