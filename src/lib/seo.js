import { siteMetadata } from "./metadata";

/**
 * Generate dynamic metadata for pages (especially articles)
 */
export function generateSEO({
  title,
  description,
  image,
  url,
}) {
  return {
    title,
    description,
    keywords: siteMetadata.keywords,

    openGraph: {
      title,
      description,
      url: url || siteMetadata.siteUrl,
      siteName: siteMetadata.siteName,
      images: [
        {
          url: image || siteMetadata.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "article",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image || siteMetadata.ogImage],
    },

    alternates: {
      canonical: url || siteMetadata.siteUrl,
    },
  };
}