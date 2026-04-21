export default function TopCommentCard({ comment }) {
  if (!comment) return null;

  return (
    <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          Top Comment
        </p>
        <h3 className="mt-2 text-xl font-semibold text-slate-900">
          Most Valuable Reader Opinion
        </h3>
      </div>

      <div className="rounded-xl bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              {comment.name || "Anonymous"}
            </h4>

            <p className="mt-1 text-xs text-slate-400">
              {comment.createdAt?.toDate
                ? comment.createdAt.toDate().toLocaleString()
                : "Recently posted"}
            </p>
          </div>

          {comment.likes !== undefined && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
              {comment.likes} likes
            </span>
          )}
        </div>

        <p className="mt-4 text-sm leading-7 text-slate-700">
          {comment.comment}
        </p>
      </div>
    </section>
  );
}