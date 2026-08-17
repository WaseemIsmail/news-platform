import Link from "next/link";
import ArticleCard from "@/components/article/ArticleCard";
import { generateSEO } from "@/lib/seo";
import { calculateTrendingScore, fetchTrendingArticles } from "@/services/trendingService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = generateSEO({
  title: "Popular Stories | Contextra",
  description: "Discover published Contextra stories ranked by available reader activity, including views, reactions, comments, and shares.",
  url: "/trending",
});

export default async function TrendingPage() {
  const trendingArticles = await fetchTrendingArticles();
  const hasEngagementData = trendingArticles.some((article) => calculateTrendingScore(article) > 0);

  return (
    <main className="bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="border-b border-slate-200 bg-slate-950 text-white dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:py-16">
          <Link href="/" className="text-sm font-bold text-slate-300 hover:text-amber-400">← Home</Link>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-amber-400">Reader interest</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.035em] sm:text-5xl">Popular stories</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            {hasEngagementData
              ? "Stories ordered by the reader activity currently available: views, reactions, comments, and shares."
              : "Reader activity is still building, so recent published stories appear first for now."}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          {trendingArticles.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-xl font-bold">No reader activity yet</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">Published stories will appear as readers begin exploring them.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {trendingArticles.map((article) => <ArticleCard key={article.id} article={article} />)}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
