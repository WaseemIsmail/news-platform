export default function ArticleMeta({ article }) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-slate-200 pb-6 text-sm text-slate-500">
      {/* Author */}
      <div className="flex items-center gap-2">
        <span className="font-medium text-slate-700">
          {article.author || "Contextra Editorial"}
        </span>
      </div>

      <span className="hidden md:block">•</span>

      {/* Published Date */}
      <div>
        {article.createdAt?.toDate
          ? article.createdAt.toDate().toLocaleDateString()
          : "Recently published"}
      </div>

      <span className="hidden md:block">•</span>

      {/* Reading Time */}
      <div>
        {article.readingTime || "5 min read"}
      </div>

      <span className="hidden md:block">•</span>

      {/* Views */}
      <div>
        {article.views || "1.2K"} views
      </div>
    </div>
  );
}