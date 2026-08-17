import { absoluteUrl, siteMetadata } from "./metadata";

/**
 * Generate dynamic metadata for pages (especially articles)
 */
export function generateSEO({
  title,
  description,
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags = [],
  noIndex = false,
}) {
  const canonicalUrl = absoluteUrl(url || "/");
  const socialImage = absoluteUrl(image || siteMetadata.ogImage);
  const cleanDescription = String(description || siteMetadata.description).trim();
  const cleanTags = [...new Set([...(tags || []), ...siteMetadata.keywords])]
    .map((item) => String(item).trim())
    .filter(Boolean);

  return {
    title,
    description: cleanDescription,
    keywords: cleanTags,
    authors: (authors || [siteMetadata.author]).map((name) => ({ name })),
    creator: siteMetadata.author,
    publisher: siteMetadata.siteName,
    category: section,
    robots: noIndex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },

    openGraph: {
      title,
      description: cleanDescription,
      url: canonicalUrl,
      siteName: siteMetadata.siteName,
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: siteMetadata.locale,
      type,
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: authors || [siteMetadata.author],
        section,
        tags,
      }),
    },

    twitter: {
      card: "summary_large_image",
      title,
      description: cleanDescription,
      images: [socialImage],
    },

    alternates: {
      canonical: canonicalUrl,
      types: {
        "application/rss+xml": absoluteUrl("/feed.xml"),
      },
    },
  };
}
