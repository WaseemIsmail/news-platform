import { fetchAllArticles } from "@/services/articleService";

export async function GET() {
  const baseUrl = "https://your-domain.com";

  const articles = await fetchAllArticles();

  const staticPages = [
    "",
    "/latest",
    "/trending",
    "/search",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ];

  const staticUrls = staticPages
    .map(
      (path) => `
        <url>
          <loc>${baseUrl}${path}</loc>
        </url>
      `
    )
    .join("");

  const articleUrls = articles
    .map(
      (article) => `
        <url>
          <loc>${baseUrl}/article/${article.slug}</loc>
        </url>
      `
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticUrls}
    ${articleUrls}
  </urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}