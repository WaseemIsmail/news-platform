import Link from "next/link";
import ArticleCard from "@/components/article/ArticleCard";
import { toDate } from "@/lib/articlePresentation";
import { generateSEO } from "@/lib/seo";
import { fetchAllArticles } from "@/services/articleService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = generateSEO({
  title: "Latest News | Contextra",
  description: "Read the latest published reporting and analysis from Contextra, ordered by publication date.",
  url: "/latest",
});

function getPublishedArticles(articles = []) {
  return articles
    .filter((article) => article?.status === "published" && article?.title?.trim() && article?.slug?.trim())
    .sort((a, b) => {
      const dateA = toDate(a.publishedAt || a.createdAt || a.updatedAt)?.getTime() || 0;
      const dateB = toDate(b.publishedAt || b.createdAt || b.updatedAt)?.getTime() || 0;
      return dateB - dateA;
    });
}

export default async function LatestPage() {
  const latestArticles = getPublishedArticles(await fetchAllArticles());

  return (
    <main className="bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:py-16">
          <Link href="/" className="text-sm font-bold text-slate-600 hover:text-amber-700 dark:text-slate-300 dark:hover:text-amber-400">← Home</Link>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-400">Published reporting</p>
          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-[-0.035em] sm:text-5xl">Latest stories</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">The newest reporting, context, and clearly labelled analysis from Contextra.</p>
            </div>
            {latestArticles.length > 0 && <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{latestArticles.length} published {latestArticles.length === 1 ? "story" : "stories"}</p>}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          {latestArticles.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-xl font-bold">No published stories yet</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">New reporting will appear here after it is published.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latestArticles.map((article) => <ArticleCard key={article.id} article={article} />)}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
