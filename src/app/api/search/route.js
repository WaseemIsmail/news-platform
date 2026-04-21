import { NextResponse } from "next/server";
import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

/**
 * GET /api/search?q=keyword
 * Search articles by title, summary, content, category, tags
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("q")?.trim();

    if (!searchQuery) {
      return NextResponse.json(
        {
          success: false,
          message: "Search query is required.",
          data: [],
        },
        { status: 400 }
      );
    }

    const snapshot = await getDocs(
      collection(db, "articles")
    );

    const normalizedQuery = searchQuery.toLowerCase();

    const results = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((article) => {
        const title = article.title?.toLowerCase() || "";
        const summary = article.summary?.toLowerCase() || "";
        const content = article.content?.toLowerCase() || "";
        const category = article.category?.toLowerCase() || "";
        const author = article.author?.toLowerCase() || "";
        const tags = Array.isArray(article.tags)
          ? article.tags.join(" ").toLowerCase()
          : "";

        return (
          title.includes(normalizedQuery) ||
          summary.includes(normalizedQuery) ||
          content.includes(normalizedQuery) ||
          category.includes(normalizedQuery) ||
          author.includes(normalizedQuery) ||
          tags.includes(normalizedQuery)
        );
      });

    return NextResponse.json(
      {
        success: true,
        count: results.length,
        data: results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET search error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to search articles.",
        data: [],
      },
      { status: 500 }
    );
  }
}