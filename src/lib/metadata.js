export const siteMetadata = {
  siteName: "Contextra",
  title: "Contextra - Understand Current Events with Context",
  description:
    "Contextra helps readers understand current events through historical context, clear analysis, and real public discussion.",
  siteUrl: "https://contextra.netlify.app",
  ogImage: "/opengraph-image",
  author: "Contextra",
  language: "en",
  locale: "en_US",
  publisherLogo: "/contextra-app-icon-v2-512.png",
  keywords: [
    "Contextra",
    "news analysis",
    "current events",
    "historical context",
    "explained news",
    "world news",
    "public discussion",
    "news platform",
    "timeline news",
    "context based news",
  ],
};

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteMetadata.siteUrl}${normalizedPath}`;
}
