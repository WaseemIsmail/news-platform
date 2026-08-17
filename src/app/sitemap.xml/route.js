import { getAllTimelines } from "@/lib/firestore";
import { siteMetadata } from "@/lib/metadata";
import { fetchAllArticles } from "@/services/articleService";

export const dynamic = "force-dynamic";

function escapeXml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function isoDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function urlEntry(path, lastModified = "") {
  const lastmod = isoDate(lastModified);
  return `<url><loc>${escapeXml(`${siteMetadata.siteUrl}${path}`)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
}

export async function GET() {
  const [articles, timelines] = await Promise.all([
    fetchAllArticles(),
    getAllTimelines(),
  ]);

  const publishedArticles = (articles || []).filter(
    (article) => article?.status === "published" && article?.slug,
  );
  const categories = [...new Set(publishedArticles.map((article) => article.category).filter(Boolean))];
  const tags = [...new Set(publishedArticles.flatMap((article) => Array.isArray(article.tags) ? article.tags : []).filter(Boolean))];

  const staticPages = [
    "",
    "/latest",
    "/trending",
    "/opinion",
    "/fact-check",
    "/timeline",
    "/category",
    "/tag",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ];

  const urls = [
    ...staticPages.map((path) => urlEntry(path)),
    ...categories.map((category) => urlEntry(`/category/${encodeURIComponent(category)}`)),
    ...tags.map((tag) => urlEntry(`/tag/${encodeURIComponent(tag)}`)),
    ...publishedArticles.map((article) => urlEntry(
      `/article/${encodeURIComponent(article.slug)}`,
      article.updatedAt || article.publishedAt || article.createdAt,
    )),
    ...(timelines || [])
      .filter((timeline) => timeline?.status === "published" && timeline?.slug)
      .map((timeline) => urlEntry(
        `/timeline/${encodeURIComponent(timeline.slug)}`,
        timeline.updatedAt || timeline.publishedAt || timeline.createdAt,
      )),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
