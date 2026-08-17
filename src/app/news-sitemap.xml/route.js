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
  const date = new Date(article.publishedAt || article.createdAt || article.updatedAt || 0);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET() {
  const cutoff = Date.now() - (48 * 60 * 60 * 1000);
  const articles = (await fetchAllArticles())
    .filter((article) => article?.status === "published" && article?.slug && article?.title)
    .map((article) => ({ article, published: articleDate(article) }))
    .filter(({ published }) => published && published.getTime() >= cutoff)
    .sort((left, right) => right.published.getTime() - left.published.getTime());

  const urls = articles.map(({ article, published }) => `
    <url>
      <loc>${escapeXml(`${siteMetadata.siteUrl}/article/${encodeURIComponent(article.slug)}`)}</loc>
      <news:news>
        <news:publication>
          <news:name>${escapeXml(siteMetadata.siteName)}</news:name>
          <news:language>${escapeXml(siteMetadata.language)}</news:language>
        </news:publication>
        <news:publication_date>${published.toISOString()}</news:publication_date>
        <news:title>${escapeXml(article.title)}</news:title>
      </news:news>
    </url>`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${urls.join("")}</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
    },
  });
}
