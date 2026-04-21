import Link from "next/link";

export default function FeaturedArticleCard({ article }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      {article.image && (
        <div className="overflow-hidden border-b border-slate-200">
          <img
            src={article.image}
            alt={article.title}
            className="h-64 w-full object-cover transition duration-500 hover:scale-105"
          />
        </div>
      )}

      <div className="p-6 md:p-8">
        <div className="mb-4">
          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
            {article.category || "Featured"}
          </span>
        </div>

        <h2 className="text-2xl font-bold leading-tight text-slate-900 md:text-3xl">
          <Link
            href={`/article/${article.slug}`}
            className="transition hover:text-amber-700"
          >
            {article.title}
          </Link>
        </h2>

        <p className="mt-4 text-base leading-8 text-slate-600">
          {article.summary ||
            "Discover the full story with deeper context, analysis, and discussion."}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span>{article.author || "Contextra Editorial"}</span>
          <span>•</span>
          <span>
            {article.createdAt?.toDate
              ? article.createdAt.toDate().toLocaleDateString()
              : "Recently published"}
          </span>
        </div>

        <div className="mt-8">
          <Link
            href={`/article/${article.slug}`}
            className="inline-flex items-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Read Full Story
          </Link>
        </div>
      </div>
    </article>
  );
}