import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleContent from "@/components/article/ArticleContent";
import ArticleEngagementSection from "@/components/article/ArticleEngagementSection";
import ArticleHeader from "@/components/article/ArticleHeader";
import ArticleMeta from "@/components/article/ArticleMeta";
import ArticleReader from "@/components/article/ArticleReader";
import ReadingProgress from "@/components/article/ReadingProgress";
import RelatedArticles from "@/components/article/RelatedArticles";
import PollBox from "@/components/polls/PollBox";
import {
  getArticleBySlug,
  getArticlesByCategory,
  getPollById,
} from "@/lib/firestore";
import { generateSEO } from "@/lib/seo";
import { absoluteUrl, siteMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getSafeImage(image) {
  if (!image || typeof image !== "string") return "";
  const trimmedImage = image.trim();
  return /^(\/|https?:\/\/)/i.test(trimmedImage) ? trimmedImage : "";
}

function getSafeSourceUrl(value) {
  try {
    const url = new URL(String(value || "").trim());
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : "";
  } catch {
    return "";
  }
}

function getSourceHost(value) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return "Source";
  }
}

function serializeDate(dateValue) {
  if (!dateValue) return null;

  try {
    if (dateValue?.toDate) return dateValue.toDate().toISOString();
    return new Date(dateValue).toISOString();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (!slug) return { title: "Article Not Found | Contextra" };

  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found | Contextra" };

  const baseTitle = String(article.seoTitle || article.title || "News with context").trim();
  const pageTitle = /contextra/i.test(baseTitle) || baseTitle.length > 50
    ? baseTitle
    : `${baseTitle} | Contextra`;

  return generateSEO({
    title: pageTitle,
    description: article.metaDescription || article.summary || article.ourView || "Read the full article on Contextra.",
    image: getSafeImage(article.image) || `/article/${article.slug}/opengraph-image`,
    url: `/article/${article.slug}`,
    type: "article",
    publishedTime: serializeDate(article.publishedAt || article.createdAt),
    modifiedTime: serializeDate(article.updatedAt || article.publishedAt || article.createdAt),
    authors: [article.author || "Contextra Editorial"],
    section: article.category || "News",
    tags: [
      ...(Array.isArray(article.tags) ? article.tags : []),
      article.focusKeyword,
      ...(Array.isArray(article.relatedKeywords) ? article.relatedKeywords : []),
    ].filter(Boolean),
  });
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  if (!slug) notFound();

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  let relatedArticles = [];
  let attachedPoll = null;

  if (article.category) {
    const categoryArticles = await getArticlesByCategory(article.category);
    relatedArticles = (categoryArticles || []).filter((item) => item.id !== article.id).slice(0, 3);
  }

  if (article.pollId) attachedPoll = await getPollById(article.pollId);

  const safeArticle = {
    id: article.id,
    title: article.title || "",
    slug: article.slug || "",
    category: article.category || "",
    author: article.author || "",
    summary: article.summary || "",
    ourView: article.ourView || "",
    image: getSafeImage(article.image),
    content: article.content || "",
    seoTitle: article.seoTitle || "",
    metaDescription: article.metaDescription || "",
    focusKeyword: article.focusKeyword || "",
    relatedKeywords: Array.isArray(article.relatedKeywords) ? article.relatedKeywords : [],
    imageAltText: article.imageAltText || "",
    readingTime: article.readingTime || "",
    views: Number(article.views || 0),
    tags: Array.isArray(article.tags) ? article.tags : [],
    featured: Boolean(article.featured),
    sourceName: article.sourceName || "",
    sourceNote: article.sourceNote || "",
    sourceUrls: Array.isArray(article.sourceUrls) ? article.sourceUrls.map(getSafeSourceUrl).filter(Boolean) : [],
    sourceUsageBasis: article.sourceUsageBasis || "facts_and_attribution",
    articleType: article.articleType || article.editorialMode || "explainer",
    verificationConfidence: Number(article.verificationConfidence || 0),
    verificationNotice: article.verificationNotice || "",
    pollId: article.pollId || "",
    publishedAt: serializeDate(article.publishedAt),
    createdAt: serializeDate(article.createdAt),
    updatedAt: serializeDate(article.updatedAt),
  };

  const safePoll = attachedPoll
    ? {
        id: attachedPoll.id,
        question: attachedPoll.question || "",
        status: attachedPoll.status || "",
        totalVotes: Number(attachedPoll.totalVotes || 0),
        options: Array.isArray(attachedPoll.options)
          ? attachedPoll.options.map((option) => ({ label: option.label || "", votes: Number(option.votes || 0) }))
          : [],
      }
    : null;

  const articleUrl = absoluteUrl(`/article/${safeArticle.slug}`);
  const articleImage = absoluteUrl(
    safeArticle.image || `/article/${safeArticle.slug}/opengraph-image`,
  );
  const keywords = [
    ...safeArticle.tags,
    safeArticle.focusKeyword,
    ...safeArticle.relatedKeywords,
  ].filter(Boolean);
  const wordCount = [safeArticle.content, safeArticle.ourView]
    .filter(Boolean)
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsArticle",
        "@id": `${articleUrl}#article`,
        url: articleUrl,
        mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
        headline: safeArticle.title,
        alternativeHeadline: safeArticle.seoTitle || undefined,
        description: safeArticle.metaDescription || safeArticle.summary,
        image: [articleImage],
        datePublished: safeArticle.publishedAt || safeArticle.createdAt || undefined,
        dateModified: safeArticle.updatedAt || safeArticle.publishedAt || safeArticle.createdAt || undefined,
        author: {
          "@type": "Organization",
          name: safeArticle.author || "Contextra Editorial",
          url: absoluteUrl("/about"),
        },
        publisher: { "@id": `${siteMetadata.siteUrl}/#organization` },
        articleSection: safeArticle.category || "News",
        keywords,
        wordCount,
        inLanguage: siteMetadata.language,
        isAccessibleForFree: true,
        citation: safeArticle.sourceUrls,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${articleUrl}#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteMetadata.siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: safeArticle.category || "Latest",
            item: absoluteUrl(safeArticle.category ? `/category/${safeArticle.category}` : "/latest"),
          },
          { "@type": "ListItem", position: 3, name: safeArticle.title, item: articleUrl },
        ],
      },
    ],
  };

  const hasSources = safeArticle.sourceUrls.length > 0 || safeArticle.sourceName || safeArticle.sourceNote;

  return (
    <main className="bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />

      <article className="mx-auto max-w-7xl px-5 py-10 sm:px-6 md:py-14">
        <div className="mx-auto max-w-5xl">
          <Link href="/latest" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-amber-700 dark:text-slate-300 dark:hover:text-amber-400">
            <span aria-hidden="true">←</span> Latest reporting
          </Link>

          <div className="mt-8">
            <ArticleHeader article={safeArticle} />
            <ArticleMeta article={safeArticle} />
          </div>
        </div>

        {safeArticle.image && (
          <figure className="relative mx-auto mt-10 aspect-[16/9] max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
            <Image src={safeArticle.image} alt={safeArticle.imageAltText || safeArticle.title} fill preload unoptimized sizes="(max-width: 1280px) 100vw, 1200px" className="object-cover" />
          </figure>
        )}

        <div className="mx-auto max-w-3xl">
          <div className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-3 dark:border-slate-800 dark:bg-slate-900">
            <div><span className="font-bold text-slate-950 dark:text-white">Sourced</span><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">References are linked below.</p></div>
            <div><span className="font-bold text-slate-950 dark:text-white">Clearly labelled</span><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Analysis is separated from reporting.</p></div>
            <div><Link href="/contact" className="font-bold text-amber-700 hover:underline dark:text-amber-400">Report a correction</Link><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Help us keep the record accurate.</p></div>
          </div>

          <ArticleReader hasSources={hasSources}>
            <ArticleContent content={safeArticle.content} />
          </ArticleReader>

          {safeArticle.tags.length > 0 && (
            <nav className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-800" aria-label="Article topics">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Explore related topics</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {safeArticle.tags.map((tag) => (
                  <Link key={tag} href={`/tag/${encodeURIComponent(tag)}`} className="rounded-full border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-amber-400 hover:bg-amber-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900">
                    #{String(tag).replaceAll("-", " ")}
                  </Link>
                ))}
              </div>
            </nav>
          )}

          {hasSources && (
            <section id="sources" className="mt-12 scroll-mt-28 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">Transparency</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-black tracking-tight">Sources consulted</h2>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold capitalize text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {safeArticle.articleType.replaceAll("_", " ")}
                </span>
              </div>
              {safeArticle.sourceName && <p className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-300">This article references reporting from: {safeArticle.sourceName}.</p>}
              {safeArticle.sourceNote && <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{safeArticle.sourceNote}</p>}
              {safeArticle.verificationNotice && (
                <p className="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                  {safeArticle.verificationNotice}
                </p>
              )}
              {safeArticle.sourceUrls.length > 0 && (
                <ul className="mt-5 space-y-3">
                  {safeArticle.sourceUrls.map((url) => (
                    <li key={url}>
                      <a href={url} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:underline dark:text-blue-400">
                        Read the source at {getSourceHost(url)} <span aria-hidden="true">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {safeArticle.ourView && (
            <section className="mt-10 rounded-3xl border-l-4 border-amber-500 bg-amber-50 p-6 dark:bg-slate-900 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800 dark:text-amber-400">Contextra analysis</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">Why this story matters</h2>
              <p className="mt-4 text-base leading-8 text-slate-700 dark:text-slate-200">{safeArticle.ourView}</p>
              <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">This section contains editorial interpretation, separate from the reported article above.</p>
            </section>
          )}

          {safePoll && safePoll.status === "active" && <PollBox poll={safePoll} />}
          <ArticleEngagementSection article={safeArticle} />
        </div>

        <RelatedArticles articles={relatedArticles} />
      </article>
    </main>
  );
}
