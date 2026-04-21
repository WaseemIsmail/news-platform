import Link from "next/link";
import { fetchAllArticles } from "@/services/articleService";
import ArticleCard from "@/components/article/ArticleCard";
import { generateSEO } from "@/lib/seo";

function sortTrendingArticles(articles = []) {
  return [...articles].sort((a, b) => {
    const viewsA = a.views || 0;
    const viewsB = b.views || 0;
    return viewsB - viewsA;
  });
}

export const metadata = generateSEO({
  title: "Trending News | Contextra",
  description:
    "Discover the most discussed and trending stories with deeper context and analysis on Contextra.",
  url: "https://your-domain.com/trending",
});

export default async function TrendingPage() {
  const articles = await fetchAllArticles();
  const trendingArticles = sortTrendingArticles(articles);

  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Trending Now
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">
            Most Discussed Stories
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Explore the stories gaining the most attention, reactions, and public discussion.
          </p>

          <div className="mt-6">
            <Link
              href="/"
              className="text-sm font-medium text-slate-700 transition hover:text-slate-900 hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          {trendingArticles.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">
                No trending articles yet
              </h2>
              <p className="mt-3 text-slate-600">
                Publish articles first to see trending content here.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {trendingArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}