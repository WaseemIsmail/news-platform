import CommentItem from "./CommentItem";

export default function CommentList({ comments = [], user = null, onReply, onDelete, onLike, totalCount = comments.length }) {
  return (
    <section className="mt-10" aria-labelledby="reader-comments-title">
      <div className="mb-5 flex items-end justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">Reader discussion</p>
          <h2 id="reader-comments-title" className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">Comments</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black tabular-nums text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {totalCount} {totalCount === 1 ? "comment" : "comments"}
        </span>
      </div>

      {!comments.length ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900/60">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 17.5 3.5 21l4-1.5A9 9 0 1 0 5 17.5Z"/><path d="M8 10h8M8 14h5"/></svg>
          </span>
          <h3 className="mt-4 font-black text-slate-950 dark:text-white">Start a thoughtful discussion</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">There are no reader comments yet. Add a relevant question, perspective, or piece of context above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} user={user} onReply={onReply} onDelete={onDelete} onLike={onLike} />
          ))}
        </div>
      )}
    </section>
  );
}
