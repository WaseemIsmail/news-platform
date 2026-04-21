import Link from "next/link";

export default function ArticleCard({ article }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Category */}
      <div className="mb-4">
        <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
          {article.category || "General"}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold leading-8 text-slate-900">
        <Link
          href={`/article/${article.slug}`}
          className="transition hover:text-amber-700"
        >
          {article.title}
        </Link>
      </h2>

      {/* Summary */}
      <p className="mt-4 text-sm leading-7 text-slate-600">
        {article.summary ||
          "Read the full article and understand the deeper context behind the story."}
      </p>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-slate-400">
          {article.createdAt?.toDate
            ? article.createdAt.toDate().toLocaleDateString()
            : "Recently published"}
        </div>

        <Link
          href={`/article/${article.slug}`}
          className="text-sm font-semibold text-slate-900 transition hover:text-amber-700"
        >
          Read More →
        </Link>
      </div>
    </article>
  );
}