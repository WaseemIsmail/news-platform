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

function articleDate(article) {
  const value = article.publishedAt || article.createdAt || article.updatedAt;
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function cleanDescription(article) {
  return String(article.summary || article.metaDescription || article.content || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
}

export async function GET() {
  const articles = (await fetchAllArticles())
    .filter((article) => article?.status === "published" && article?.slug && article?.title)
    .map((article) => ({ article, published: articleDate(article) }))
    .filter(({ published }) => published)
    .sort((left, right) => right.published.getTime() - left.published.getTime())
    .slice(0, 50);

  const lastBuildDate = articles[0]?.published?.toUTCString() || new Date().toUTCString();
  const items = articles.map(({ article, published }) => {
    const articleUrl = `${siteMetadata.siteUrl}/article/${encodeURIComponent(article.slug)}`;
    return `<item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(articleUrl)}</link>
      <guid isPermaLink="true">${escapeXml(articleUrl)}</guid>
      <pubDate>${published.toUTCString()}</pubDate>
      <description>${escapeXml(cleanDescription(article))}</description>
      ${article.category ? `<category>${escapeXml(article.category)}</category>` : ""}
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escapeXml(siteMetadata.siteName)}</title>
      <link>${escapeXml(siteMetadata.siteUrl)}</link>
      <description>${escapeXml(siteMetadata.description)}</description>
      <language>${escapeXml(siteMetadata.language)}</language>
      <lastBuildDate>${lastBuildDate}</lastBuildDate>
      <atom:link href="${escapeXml(`${siteMetadata.siteUrl}/feed.xml`)}" rel="self" type="application/rss+xml" />
      ${items.join("")}
    </channel>
  </rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
    },
  });
}
