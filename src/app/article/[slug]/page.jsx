import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/firestore";
import { generateSEO } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { slug } = params;
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
    url: `https://contextra.vercel.app/article/${article.slug}`,
  });
}

export default async function ArticlePage({ params }) {
  const { slug } = params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const publishedDate = article.createdAt?.toDate
    ? article.createdAt.toDate().toLocaleDateString()
    : "Recently published";

  const contentParagraphs = article.content
    ? article.content
        .split("\n")
        .filter((paragraph) => paragraph.trim() !== "")
    : [];

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

        {/* Category */}
        <div className="mb-6">
          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
            {article.category || "General"}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span>{article.author || "Contextra Editorial"}</span>
          <span>•</span>
          <span>{publishedDate}</span>
        </div>

        {/* Summary */}
        {(article.summary || article.ourView) && (
          <p className="mt-8 text-lg leading-8 text-slate-600">
            {article.summary || article.ourView}
          </p>
        )}

        {/* Featured Image */}
        {article.image && (
          <div className="relative mt-10 h-[420px] overflow-hidden rounded-2xl border border-slate-200">
            <Image
              src={article.image}
              alt={article.title}
              fill
              priority
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
        <section className="mt-10">
          <div className="space-y-7 text-base leading-8 text-slate-700">
            {contentParagraphs.length > 0 ? (
              contentParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            ) : (
              <p>No article content available.</p>
            )}
          </div>
        </section>

        {/* Continue Exploring */}
        <section className="mt-14 border-t border-slate-200 pt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            Continue Exploring
          </h2>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/trending"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
            >
              Trending Topics
            </Link>

            <Link
              href="/latest"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
            >
              Latest Articles
            </Link>

            {article.category && (
              <Link
                href={`/category/${article.category.toLowerCase()}`}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
              >
                More in {article.category}
              </Link>
            )}
          </div>
        </section>
      </article>
    </main>
  );
}