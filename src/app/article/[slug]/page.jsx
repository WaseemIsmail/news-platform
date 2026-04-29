import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getArticleBySlug,
  getArticlesByCategory,
  getPollById,
} from "@/lib/firestore";
import { generateSEO } from "@/lib/seo";

import ArticleHeader from "@/components/article/ArticleHeader";
import ArticleMeta from "@/components/article/ArticleMeta";
import ArticleContent from "@/components/article/ArticleContent";
import RelatedArticles from "@/components/article/RelatedArticles";
import ArticleEngagementSection from "@/components/article/ArticleEngagementSection";
import PollBox from "@/components/polls/PollBox";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getSafeImage(image) {
  if (!image || typeof image !== "string") {
    return "";
  }

  const trimmedImage = image.trim();

  if (!trimmedImage) {
    return "";
  }

  if (
    trimmedImage.startsWith("/") ||
    trimmedImage.startsWith("http://") ||
    trimmedImage.startsWith("https://")
  ) {
    return trimmedImage;
  }

  return "";
}

function serializeDate(dateValue) {
  if (!dateValue) return null;

  try {
    if (dateValue?.toDate) {
      return dateValue.toDate().toISOString();
    }

    return new Date(dateValue).toISOString();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  if (!slug) {
    return {
      title: "Article Not Found | Contextra",
      description: "The article you are looking for could not be found.",
    };
  }

  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | Contextra",
      description: "The article you are looking for could not be found.",
    };
  }

  return generateSEO({
    title: `${article.title} | Contextra`,
    description:
      article.summary ||
      article.ourView ||
      "Read the full article on Contextra.",
    image: getSafeImage(article.image) || "/images/default-og.jpg",
    url: `https://contextra.netlify.app/article/${article.slug}`,
  });
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  let relatedArticles = [];
  let attachedPoll = null;

  if (article.category) {
    const categoryArticles = await getArticlesByCategory(article.category);

    relatedArticles = (categoryArticles || [])
      .filter((item) => item.id !== article.id)
      .slice(0, 3);
  }

  if (article.pollId) {
    attachedPoll = await getPollById(article.pollId);
  }

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
    readingTime: article.readingTime || "",
    views: Number(article.views || 0),
    tags: Array.isArray(article.tags) ? article.tags : [],
    featured: Boolean(article.featured),
    pollId: article.pollId || "",
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
          ? attachedPoll.options.map((option) => ({
              label: option.label || "",
              votes: Number(option.votes || 0),
            }))
          : [],
      }
    : null;

  return (
    <main className="bg-white">
      <article className="mx-auto max-w-4xl px-6 py-14">
        {/* Back to latest */}
        <div className="mb-8">
          <Link
            href="/latest"
            className="text-sm font-medium text-amber-700 transition hover:underline"
          >
            ← Back to Latest
          </Link>
        </div>

        {/* Header */}
        <ArticleHeader article={article} />

        {/* Meta */}
        <ArticleMeta article={article} />

        {/* Featured image */}
        {safeArticle.image && (
          <div className="relative mt-10 h-[420px] overflow-hidden rounded-2xl border border-slate-200">
            <Image
              src={safeArticle.image}
              alt={article.title || "Article image"}
              fill
              priority
              unoptimized
              className="object-cover"
            />
          </div>
        )}

        {/* Our View */}
        {article.ourView && (
          <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
              Our View
            </p>

            <p className="mt-3 text-base leading-8 text-slate-700">
              {article.ourView}
            </p>
          </section>
        )}

        {/* Full content */}
        <ArticleContent content={article.content || ""} />

        {/* Attached Poll */}
        {safePoll && safePoll.status === "active" && (
          <PollBox poll={safePoll} />
        )}

        {/* Client Component Section */}
        <ArticleEngagementSection article={safeArticle} />

        {/* Related Articles */}
        <RelatedArticles articles={relatedArticles} />
      </article>
    </main>
  );
}