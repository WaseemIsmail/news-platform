"use client";

import { useState } from "react";
import ReplyBox from "./ReplyBox";
import { useAuthContext } from "@/context/AuthContext";

export default function CommentItem({
  comment,
  onReply,
  onDelete,
  onLike,
  depth = 0,
}) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const { user, isAdmin } = useAuthContext();

  const replies = comment.replies || [];
  const likes = Number(comment.likes || 0);

  const likedUsers = Array.isArray(comment.likedUsers)
    ? comment.likedUsers
    : [];

  const hasLiked = !!user?.uid && likedUsers.includes(user.uid);

  const canDelete = isAdmin || (user?.uid && user.uid === comment.userId);

  const handleLike = async () => {
    if (!user?.uid) {
      alert("Please login to like comments.");
      return;
    }

    if (!onLike || likeLoading) return;

    try {
      setLikeLoading(true);
      await onLike(comment);
    } catch (error) {
      console.error("Like comment failed:", error);
      alert("Failed to update like. Please try again.");
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${
        depth > 0 ? "mt-4" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {comment.name || "Anonymous"}
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            {comment.createdAt?.toDate
              ? comment.createdAt.toDate().toLocaleString()
              : "Recently posted"}
          </p>
        </div>

        {canDelete && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(comment.id)}
            className="text-xs font-medium text-red-600 transition hover:text-red-700"
          >
            Delete
          </button>
        )}
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-700">
        {comment.comment}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-5">
        <button
          type="button"
          onClick={handleLike}
          disabled={likeLoading}
          className={`cursor-pointer text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
            hasLiked
              ? "text-amber-700"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {likeLoading
            ? "Updating..."
            : hasLiked
            ? "👍 Liked"
            : "👍 Like"}{" "}
          {likes > 0 ? `(${likes})` : ""}
        </button>

        <button
          type="button"
          onClick={() => setShowReplyBox((prev) => !prev)}
          className="cursor-pointer text-sm font-medium text-amber-700 transition hover:text-amber-800"
        >
          {showReplyBox ? "Cancel Reply" : "Reply"}
        </button>
      </div>

      {showReplyBox && (
        <div className="mt-5">
          <ReplyBox
            articleId={comment.articleId}
            parentId={comment.id}
            onSubmit={async (replyData) => {
              if (!onReply) return;

              await onReply({
                ...replyData,
                parentId: comment.id,
              });

              setShowReplyBox(false);
            }}
          />
        </div>
      )}

      {replies.length > 0 && (
        <div className="mt-6 border-l-2 border-slate-200 pl-5">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
              onLike={onLike}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}