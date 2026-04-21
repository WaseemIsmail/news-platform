import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticlesByCategory } from "@/lib/firestore";
import { generateSEO } from "@/lib/seo";

import ArticleHeader from "@/components/article/ArticleHeader";
import ArticleMeta from "@/components/article/ArticleMeta";
import ArticleContent from "@/components/article/ArticleContent";
import RelatedArticles from "@/components/article/RelatedArticles";
import ArticleEngagementSection from "@/components/article/ArticleEngagementSection";

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
    image: article.image || "/images/default-og.jpg",
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

  if (article.category) {
    const categoryArticles = await getArticlesByCategory(article.category);

    relatedArticles = (categoryArticles || [])
      .filter((item) => item.id !== article.id)
      .slice(0, 3);
  }

  return (
    <main className="bg-white">
      <article className="mx-auto max-w-4xl px-6 py-14">
        {/* Back */}
        <div className="mb-8">
          <Link
            href="/latest"
            className="text-sm font-medium text-amber-700 transition hover:underline"
          >
            ← Back to Latest
          </Link>
        </div>

        {/* Reusable Article UI */}
        <ArticleHeader article={article} />
        <ArticleMeta article={article} />

        {/* Featured Image */}
        {article.image && (
          <div className="relative mt-10 h-[420px] overflow-hidden rounded-2xl border border-slate-200">
            <Image
              src={article.image}
              alt={article.title}
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

        {/* Content */}
        <ArticleContent content={article.content} />

        {/* Interactive Section */}
        <ArticleEngagementSection article={article} />

        {/* Related Articles */}
        <RelatedArticles articles={relatedArticles} />
      </article>
    </main>
  );
}