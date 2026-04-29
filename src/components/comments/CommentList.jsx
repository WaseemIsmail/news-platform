import CommentItem from "./CommentItem";

export default function CommentList({
  comments = [],
  user = null,
  onReply,
  onDelete,
  onLike,
}) {
  if (!comments.length) {
    return (
      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="text-slate-600">
          No comments yet. Be the first to start the discussion.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          Public Discussion
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Reader Comments
        </h2>
      </div>

      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            user={user}
            onReply={onReply}
            onDelete={onDelete}
            onLike={onLike}
          />
        ))}
      </div>
    </section>
  );
}