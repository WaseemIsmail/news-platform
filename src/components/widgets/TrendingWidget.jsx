import Link from "next/link";

export default function TrendingWidget({ articles = [] }) {
  if (!articles || articles.length === 0) {
    return (
      <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
              Trending
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">
              What people are reading
            </h2>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
          <p className="text-sm text-slate-600">
            No trending stories available right now.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            Trending
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">
            What people are reading
          </h2>
        </div>

        <Link
          href="/trending"
          className="text-sm font-medium text-slate-700 transition hover:text-amber-700"
        >
          View all
        </Link>
      </div>

      <div className="space-y-5">
        {articles.slice(0, 5).map((article, index) => (
          <Link
            key={article.id || article.slug || index}
            href={`/article/${article.slug}`}
            className="group flex items-start gap-4 rounded-2xl transition"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700 transition group-hover:bg-slate-900 group-hover:text-white">
              {index + 1}
            </div>

            <div className="min-w-0 flex-1">
              {article.category && (
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                  {article.category}
                </p>
              )}

              <h3 className="line-clamp-3 text-sm font-semibold leading-6 text-slate-900 transition group-hover:text-amber-700">
                {article.title}
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                {article.author && <span>By {article.author}</span>}

                {article.publishedAt && (
                  <span>
                    •{" "}
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}