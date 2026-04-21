"use client";

export default function CommentActions({
  onReply,
  onDelete,
  onLike,
  likes = 0,
  showDelete = false,
}) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={onReply}
        className="text-sm font-medium text-amber-700 transition hover:text-amber-800"
      >
        Reply
      </button>

      <button
        type="button"
        onClick={onLike}
        className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
      >
        Like {likes > 0 ? `(${likes})` : ""}
      </button>

      {showDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="text-sm font-medium text-red-600 transition hover:text-red-700"
        >
          Delete
        </button>
      )}
    </div>
  );
}