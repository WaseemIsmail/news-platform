import {
  formatArticleDate,
  getArticleDate,
  getReadingTime,
  toDate,
} from "@/lib/articlePresentation";

export default function ArticleMeta({ article }) {
  const sourceCount = Array.isArray(article.sourceUrls) ? article.sourceUrls.length : 0;
  const publishedDate = toDate(getArticleDate(article));
  const updatedDate = toDate(article.updatedAt);
  const showUpdated = publishedDate && updatedDate && updatedDate.getTime() - publishedDate.getTime() > 60000;

  return (
    <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-slate-200 py-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
      <span className="font-bold text-slate-800 dark:text-slate-100">
        By {article.author || "Contextra Editorial"}
      </span>
      <span aria-hidden="true">•</span>
      <time dateTime={publishedDate?.toISOString()}>
        Published {formatArticleDate(publishedDate)}
      </time>
      {showUpdated && (
        <>
          <span aria-hidden="true">•</span>
          <time dateTime={updatedDate.toISOString()}>Updated {formatArticleDate(updatedDate)}</time>
        </>
      )}
      <span aria-hidden="true">•</span>
      <span>{getReadingTime(article)}</span>
      {sourceCount > 0 && (
        <>
          <span aria-hidden="true">•</span>
          <a href="#sources" className="font-semibold text-amber-700 hover:underline dark:text-amber-400">
            {sourceCount} {sourceCount === 1 ? "source" : "sources"}
          </a>
        </>
      )}
    </div>
  );
}
