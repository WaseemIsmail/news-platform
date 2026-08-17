function formatDate(value) {
  try {
    const date = value?.toDate ? value.toDate() : new Date(value);
    if (Number.isNaN(date.getTime())) return "Recently posted";
    return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
  } catch {
    return "Recently posted";
  }
}

export default function TopCommentCard({ comment }) {
  if (!comment || Number(comment.likes || 0) < 1) return null;
  const name = comment.name || "Anonymous reader";

  return (
    <aside className="mt-8 rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 dark:border-amber-500/30 dark:from-amber-500/10 dark:to-slate-900 sm:p-6" aria-labelledby="community-highlight-title">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">Community highlight</p>
          <h3 id="community-highlight-title" className="mt-1 text-lg font-black text-slate-950 dark:text-white">A response readers found useful</h3>
        </div>
        <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-black text-amber-800 shadow-sm dark:bg-slate-900 dark:text-amber-300">♥ {Number(comment.likes || 0)}</span>
      </div>
      <blockquote className="mt-5 border-l-2 border-amber-400 pl-4 text-sm leading-7 text-slate-700 dark:text-slate-200">“{comment.comment}”</blockquote>
      <p className="mt-4 text-xs font-bold text-slate-500 dark:text-slate-400">{name} · {formatDate(comment.createdAt)}</p>
    </aside>
  );
}
