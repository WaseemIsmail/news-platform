export async function GET() {
  const baseUrl = "https://your-domain.com";

  const robotsText = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

  return new Response(robotsText, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}