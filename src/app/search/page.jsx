"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import useArticles from "@/hooks/useArticles";

export default function SearchPage() {
  const { articles, loading, error } = useArticles();
  const [query, setQuery] = useState("");

  const filteredArticles = useMemo(() => {
    const searchText = query.trim().toLowerCase();

    if (!searchText) return articles;

    return articles.filter((article) => {
      const title = article.title?.toLowerCase() || "";
      const summary = article.summary?.toLowerCase() || "";
      const category = article.category?.toLowerCase() || "";
      const content = article.content?.toLowerCase() || "";
      const tags = Array.isArray(article.tags)
        ? article.tags.join(" ").toLowerCase()
        : "";

      return (
        title.includes(searchText) ||
        summary.includes(searchText) ||
        category.includes(searchText) ||
        content.includes(searchText) ||
        tags.includes(searchText)
      );
    });
  }, [articles, query]);

  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Search
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">
            Search Articles
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Find stories, topics, and discussions across Contextra.
          </p>

          <div className="mt-8">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, topic, category, or tag..."
              className="w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-slate-900"
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-slate-600">Loading articles...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
              <p className="text-red-700">{error}</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">
                No results found
              </h2>
              <p className="mt-3 text-slate-600">
                Try searching with a different keyword or topic.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  {filteredArticles.length} Result
                  {filteredArticles.length > 1 ? "s" : ""}
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredArticles.map((article) => (
                  <article
                    key={article.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                      {article.category || "General"}
                    </span>

                    <h3 className="mt-4 text-xl font-semibold leading-8 text-slate-900">
                      <Link
                        href={`/article/${article.slug}`}
                        className="transition hover:text-amber-700"
                      >
                        {article.title}
                      </Link>
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {article.summary ||
                        "Read the full article for deeper context and analysis."}
                    </p>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-sm text-slate-400">
                        {article.createdAt?.toDate
                          ? article.createdAt.toDate().toLocaleDateString()
                          : "Recently published"}
                      </span>

                      <Link
                        href={`/article/${article.slug}`}
                        className="text-sm font-semibold text-slate-900 transition hover:text-amber-700"
                      >
                        Read More →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}