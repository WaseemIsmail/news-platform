import Link from "next/link";

export default function RelatedArticles({ articles = [] }) {
  if (!articles.length) return null;

  return (
    <section className="mt-12 border-t border-slate-200 pt-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Related
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Continue Reading
          </h2>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
              {article.category || "General"}
            </span>

            <h3 className="mt-4 text-lg font-semibold leading-7 text-slate-900 group-hover:text-amber-700">
              {article.title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3">
              {article.summary ||
                "Explore this related article for deeper understanding."}
            </p>

            <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
              <span>
                {article.createdAt?.toDate
                  ? article.createdAt.toDate().toLocaleDateString()
                  : "Recently"}
              </span>

              <span className="font-medium text-slate-900 group-hover:underline">
                Read →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}