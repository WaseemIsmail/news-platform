import Link from "next/link";

export default function TopComment({ comment }) {
  if (!comment) {
    return (
      <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            Top Comment
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">
            Community Highlight
          </h2>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
          <p className="text-sm text-slate-600">
            No highlighted comment available right now.
          </p>
        </div>
      </aside>
    );
  }

  const authorName = comment.authorName || "Anonymous Reader";
  const articleTitle = comment.articleTitle || "Related Article";
  const articleSlug = comment.articleSlug || "";
  const content = comment.content || "No comment content available.";

  const formatDate = (value) => {
    if (!value) return "";

    if (typeof value?.toDate === "function") {
      return value.toDate().toLocaleDateString();
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString();
  };

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
          Top Comment
        </p>
        <h2 className="mt-2 text-xl font-bold text-slate-900">
          Community Highlight
        </h2>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-base leading-7 text-slate-700">“{content}”</p>

        <div className="mt-5 border-t border-slate-200 pt-4">
          <p className="text-sm font-semibold text-slate-900">{authorName}</p>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            {formatDate(comment.createdAt) && (
              <span>{formatDate(comment.createdAt)}</span>
            )}

            {comment.likesCount ? <span>• {comment.likesCount} likes</span> : null}
          </div>

          {articleSlug ? (
            <Link
              href={`/article/${articleSlug}`}
              className="mt-4 inline-block text-sm font-medium text-slate-700 transition hover:text-amber-700"
            >
              From: {articleTitle}
            </Link>
          ) : (
            <p className="mt-4 text-sm font-medium text-slate-700">
              From: {articleTitle}
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}