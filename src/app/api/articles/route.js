import { NextResponse } from "next/server";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { validateArticle } from "@/utils/validationSchemas";

/**
 * GET /api/articles
 * Fetch all articles
 */
export async function GET() {
  try {
    const articlesQuery = query(
      collection(db, "articles"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(articlesQuery);

    const articles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      {
        success: true,
        data: articles,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET articles error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch articles.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/articles
 * Create new article
 */
export async function POST(request) {
  try {
    const body = await request.json();

    const errors = validateArticle(body);

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors,
        },
        { status: 400 }
      );
    }

    const payload = {
      title: body.title.trim(),
      slug: body.slug.trim(),
      summary: body.summary.trim(),
      content: body.content.trim(),
      image: body.image || "",
      category: body.category.trim(),
      tags: Array.isArray(body.tags) ? body.tags : [],
      author: body.author || "Contextra Editorial",
      authorId: body.authorId || "",
      status: body.status || "published",
      featured: body.featured || false,
      trendingScore: body.trendingScore || 0,
      views: body.views || 0,
      publishedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(
      collection(db, "articles"),
      payload
    );

    return NextResponse.json(
      {
        success: true,
        message: "Article created successfully.",
        data: {
          id: docRef.id,
          ...payload,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST article error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create article.",
      },
      { status: 500 }
    );
  }
}