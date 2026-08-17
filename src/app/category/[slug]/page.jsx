import Link from "next/link";
import ArticleCard from "@/components/article/ArticleCard";
import FeaturedArticleCard from "@/components/article/FeaturedArticleCard";
import { toDate } from "@/lib/articlePresentation";
import { getArticlesByCategory } from "@/lib/firestore";
import { generateSEO } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatCategoryName(slug = "") {
  return slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function getPublishedArticles(articles = []) {
  return articles
    .filter((article) => article?.status?.toString().trim().toLowerCase() === "published" && article?.title?.trim() && article?.slug?.trim())
    .sort((a, b) => {
      const dateA = toDate(a.publishedAt || a.createdAt || a.updatedAt)?.getTime() || 0;
      const dateB = toDate(b.publishedAt || b.createdAt || b.updatedAt)?.getTime() || 0;
      return dateB - dateA;
    });
}

export async function generateMetadata({ params }) {
  const { slug = "" } = await params;
  const categoryName = formatCategoryName(slug);
  return generateSEO({
    title: `${categoryName || "Topic"} News | Contextra`,
    description: `Explore the latest ${categoryName || "topic"} reporting, context, and analysis on Contextra.`,
    image: "/opengraph-image",
    url: `/category/${slug}`,
  });
}

export default async function CategoryPage({ params }) {
  const { slug = "" } = await params;
  const categoryName = formatCategoryName(slug);
  const articles = getPublishedArticles(await getArticlesByCategory(slug));
  const [leadArticle, ...remainingArticles] = articles;

  return (
    <main className="bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:py-16">
          <div className="flex flex-wrap gap-4 text-sm font-bold">
            <Link href="/category" className="text-slate-600 hover:text-amber-700 dark:text-slate-300 dark:hover:text-amber-400">← All topics</Link>
            <Link href="/latest" className="text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white">Latest reporting</Link>
          </div>
          <p className="mt-9 text-xs font-bold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-400">Topic</p>
          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-6xl">{categoryName}</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">The newest reporting, useful background, and clearly labelled analysis covering {categoryName}.</p>
            </div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{articles.length} published {articles.length === 1 ? "story" : "stories"}</p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          {!leadArticle ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-2xl font-black">No published {categoryName} stories yet</h2>
              <p className="mt-3 text-slate-600 dark:text-slate-300">Explore the latest reporting while this topic is being updated.</p>
              <Link href="/latest" className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white dark:bg-amber-400 dark:text-slate-950">Browse latest</Link>
            </div>
          ) : (
            <>
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">Latest in {categoryName}</p>
              <FeaturedArticleCard article={leadArticle} />
              {remainingArticles.length > 0 && (
                <div className="mt-10">
                  <div className="mb-6 flex items-end justify-between border-b border-slate-200 pb-4 dark:border-slate-800"><h2 className="text-2xl font-black tracking-tight">More {categoryName} reporting</h2><span className="text-sm text-slate-500 dark:text-slate-400">Newest first</span></div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{remainingArticles.map((article) => <ArticleCard key={article.id} article={article} />)}</div>
                </div>
              )}
            </>
          )}

          <nav className="mt-16 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-8 dark:border-slate-800" aria-label="Continue exploring">
            <span className="mr-2 text-sm font-bold">Continue exploring</span>
            {[{ href: "/latest", label: "Latest" }, { href: "/opinion", label: "Opinion" }, { href: "/fact-check", label: "Fact Check" }, { href: "/timeline", label: "Timelines" }].map((item) => <Link key={item.href} href={item.href} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:border-amber-400 hover:bg-amber-50 dark:border-slate-700 dark:hover:bg-slate-900">{item.label}</Link>)}
          </nav>
        </div>
      </section>
    </main>
  );
}
