"use client";

import { useEffect, useMemo, useState } from "react";
import ArticleCard from "@/components/article/ArticleCard";

const suggestions = ["Politics", "Technology", "Business", "World", "Sports"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const normalizedQuery = query.trim();

  const updateQuery = (value) => {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      setLoading(false);
      setError("");
      setActiveCategory("All");
    }
  };

  useEffect(() => {
    if (normalizedQuery.length < 2) {
      return undefined;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(normalizedQuery)}`, { signal: controller.signal });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.message || "Search failed.");
        setResults(Array.isArray(payload.data) ? payload.data : []);
        setActiveCategory("All");
      } catch (searchError) {
        if (searchError.name !== "AbortError") {
          setResults([]);
          setError(searchError.message || "Search is temporarily unavailable.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 350);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [normalizedQuery]);

  const categories = useMemo(() => ["All", ...new Set(results.map((article) => article.category).filter(Boolean))], [results]);
  const filteredResults = activeCategory === "All" ? results : results.filter((article) => article.category === activeCategory);

  return (
    <main className="min-h-[70vh] bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="border-b border-slate-200 bg-slate-950 text-white dark:border-slate-800">
        <div className="mx-auto max-w-5xl px-5 py-14 text-center sm:px-6 md:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-400">Explore the archive</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.035em] sm:text-5xl">What do you want to understand?</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">Search published reporting by headline, topic, category, author, or tag.</p>

          <div className="relative mx-auto mt-8 max-w-3xl">
            <label htmlFor="article-search" className="sr-only">Search published articles</label>
            <input id="article-search" type="search" value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Try ‘technology’, ‘election’, or a person’s name" autoComplete="off" className="w-full rounded-2xl border border-white/20 bg-white px-5 py-4 pr-20 text-base text-slate-950 shadow-2xl outline-none placeholder:text-slate-400 focus:border-amber-400 dark:bg-white dark:text-slate-950" />
            {query && <button type="button" onClick={() => updateQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-3 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100">Clear</button>}
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Suggested searches">
            {suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => updateQuery(suggestion)} className="rounded-full border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-amber-400 hover:text-amber-300">{suggestion}</button>)}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Searching" aria-busy="true">
              {[0, 1, 2].map((item) => <div key={item} className="h-96 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-900" />)}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300" role="alert">{error}</div>
          ) : normalizedQuery.length < 2 ? (
            <div className="mx-auto max-w-xl py-8 text-center">
              <h2 className="text-2xl font-black">Search all published stories</h2>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">Enter at least two characters above. Drafts and private editorial work never appear in public search.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-xl font-bold">No stories matched “{normalizedQuery}”</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">Try a broader topic, a shorter phrase, or one of the suggestions above.</p>
            </div>
          ) : (
            <>
              <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Results for “{normalizedQuery}”</p>
                  <h2 className="mt-1 text-3xl font-black tracking-tight">{filteredResults.length} {filteredResults.length === 1 ? "story" : "stories"}</h2>
                </div>
                {categories.length > 2 && <div className="flex flex-wrap gap-2" aria-label="Filter search results by category">{categories.map((category) => <button key={category} type="button" onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category} className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${activeCategory === category ? "bg-slate-950 text-white dark:bg-amber-400 dark:text-slate-950" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300"}`}>{category}</button>)}</div>}
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredResults.map((article) => <ArticleCard key={article.id} article={article} />)}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
