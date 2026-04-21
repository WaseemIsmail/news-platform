import Link from "next/link";
import { fetchAllArticles } from "@/services/articleService";
import ArticleCard from "@/components/article/ArticleCard";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Latest News | Contextra",
  description:
    "Read the latest articles, breaking developments, and fresh analysis with deeper context on Contextra.",
  url: "https://your-domain.com/latest",
});

function sortLatestArticles(articles = []) {
  return [...articles].sort((a, b) => {
    const dateA = a.createdAt?.seconds || 0;
    const dateB = b.createdAt?.seconds || 0;
    return dateB - dateA;
  });
}

export default async function LatestPage() {
  const articles = await fetchAllArticles();
  const latestArticles = sortLatestArticles(articles);

  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Latest Updates
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">
            Fresh News & Analysis
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Stay updated with the newest stories, current events, and deeper perspectives.
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
          {latestArticles.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">
                No articles published yet
              </h2>
              <p className="mt-3 text-slate-600">
                Start publishing articles to see them here.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latestArticles.map((article) => (
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