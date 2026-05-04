function formatDate(dateValue) {
  if (!dateValue) return "Recently published";

  try {
    if (dateValue?.toDate) {
      return dateValue.toDate().toLocaleDateString();
    }

    return new Date(dateValue).toLocaleDateString();
  } catch {
    return "Recently published";
  }
}

export default function ArticleMeta({ article }) {
  const author = article.author || "Contextra Editorial";
  const publishedDate = formatDate(article.publishedAt || article.createdAt);
  const readingTime = article.readingTime || "";

  return (
    <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-slate-200 pb-6 text-sm text-slate-500">
      {/* Author */}
      <div className="flex items-center gap-2">
        <span className="font-medium text-slate-700">{author}</span>
      </div>

      <span className="hidden md:block">•</span>

      {/* Published Date */}
      <div>{publishedDate}</div>

      {/* Reading Time - show only if available */}
      {readingTime && (
        <>
          <span className="hidden md:block">•</span>
          <div>{readingTime}</div>
        </>
      )}
    </div>
  );
}