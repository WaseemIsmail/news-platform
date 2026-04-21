export default function ArticleHeader({ article }) {
  return (
    <header className="border-b border-slate-200 pb-8">
      <div className="mb-5">
        <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
          {article.category || "General"}
        </span>
      </div>

      <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
        {article.title}
      </h1>

      {(article.summary || article.ourView) && (
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          {article.summary || article.ourView}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <span>{article.author || "Contextra Editorial"}</span>
        <span>•</span>
        <span>
          {article.createdAt?.toDate
            ? article.createdAt.toDate().toLocaleDateString()
            : "Recently published"}
        </span>
      </div>
    </header>
  );
}