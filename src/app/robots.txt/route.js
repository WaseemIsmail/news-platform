import { siteMetadata } from "@/lib/metadata";

export async function GET() {
  const robotsText = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /bookmarks
Disallow: /notifications
Disallow: /profile
Disallow: /settings
Disallow: /login
Disallow: /signup
Disallow: /forgot-password
Disallow: /reset-password

Sitemap: ${siteMetadata.siteUrl}/sitemap.xml
Sitemap: ${siteMetadata.siteUrl}/news-sitemap.xml`;

  return new Response(robotsText, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600",
    },
  });
}
