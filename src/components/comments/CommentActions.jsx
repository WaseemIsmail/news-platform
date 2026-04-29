"use client";

import { useAuthContext } from "@/context/AuthContext";

export default function CommentActions({
  onReply,
  onDelete,
  onLike,
  likes = 0,
  likedUsers = [],
  showDelete = false,
}) {
  const { user } = useAuthContext();

  const hasLiked =
    user &&
    Array.isArray(likedUsers) &&
    likedUsers.includes(user.uid);

  const handleLike = async () => {
    if (!user) return;

    if (onLike) {
      await onLike();
    }
  };

  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      {/* Like / Unlike */}
      <button
        type="button"
        onClick={handleLike}
        className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
          hasLiked
            ? "border-amber-300 bg-amber-100 text-amber-800"
            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
        }`}
      >
        <span>{hasLiked ? "❤️" : "👍"}</span>
        <span>
          {hasLiked ? "Liked" : "Like"}{" "}
          {likes > 0 ? `(${likes})` : ""}
        </span>
      </button>

      {/* Reply */}
      <button
        type="button"
        onClick={onReply}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
      >
        <span>💬</span>
        <span>Reply</span>
      </button>

      {/* Delete */}
      {showDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <span>🗑</span>
          <span>Delete</span>
        </button>
      )}
    </div>
  );
}