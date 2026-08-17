import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

function serializeDate(value) {
  if (!value) return null;

  try {
    if (typeof value.toDate === "function") return value.toDate().toISOString();
    if (typeof value.seconds === "number") return new Date(value.seconds * 1000).toISOString();
    return new Date(value).toISOString();
  } catch {
    return null;
  }
}

function getSearchText(article) {
  return [article.title, article.summary, article.content, article.category, article.author, ...(Array.isArray(article.tags) ? article.tags : [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getRelevance(article, query) {
  const title = String(article.title || "").toLowerCase();
  if (title === query) return 4;
  if (title.startsWith(query)) return 3;
  if (title.includes(query)) return 2;
  return 1;
}

export async function GET(request) {
  try {
    const searchQuery = new URL(request.url).searchParams.get("q")?.trim().toLowerCase();

    if (!searchQuery || searchQuery.length < 2) {
      return NextResponse.json({ success: false, message: "Enter at least two characters.", data: [] }, { status: 400 });
    }

    const snapshot = await getDocs(collection(db, "articles"));
    const results = snapshot.docs
      .map((document) => ({ id: document.id, ...document.data() }))
      .filter((article) => article.status === "published" && article.slug && article.title && getSearchText(article).includes(searchQuery))
      .sort((a, b) => {
        const relevanceDifference = getRelevance(b, searchQuery) - getRelevance(a, searchQuery);
        if (relevanceDifference !== 0) return relevanceDifference;
        return (b.publishedAt?.seconds || b.createdAt?.seconds || 0) - (a.publishedAt?.seconds || a.createdAt?.seconds || 0);
      })
      .slice(0, 40)
      .map((article) => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        summary: article.summary || "",
        category: article.category || "General",
        image: article.image || "",
        author: article.author || "",
        readingTime: article.readingTime || "",
        publishedAt: serializeDate(article.publishedAt),
        createdAt: serializeDate(article.createdAt),
      }));

    return NextResponse.json({ success: true, count: results.length, data: results });
  } catch (error) {
    console.error("GET search error:", error);
    return NextResponse.json({ success: false, message: "Search is temporarily unavailable.", data: [] }, { status: 500 });
  }
}
