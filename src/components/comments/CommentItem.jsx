"use client";

import { useState } from "react";
import ReplyBox from "./ReplyBox";
import { useAuthContext } from "@/context/AuthContext";

function formatCommentDate(value) {
  try {
    const date = value?.toDate ? value.toDate() : new Date(value);
    if (Number.isNaN(date.getTime())) return "Recently posted";
    return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(date);
  } catch {
    return "Recently posted";
  }
}

export default function CommentItem({ comment, onReply, onDelete, onLike, depth = 0 }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [likeMessage, setLikeMessage] = useState("");
  const { user, isAdmin } = useAuthContext();
  const replies = comment.replies || [];
  const likes = Number(comment.likes || 0);
  const likedUsers = Array.isArray(comment.likedUsers) ? comment.likedUsers : [];
  const hasLiked = Boolean(user?.uid && likedUsers.includes(user.uid));
  const canDelete = isAdmin || (user?.uid && user.uid === comment.userId);
  const name = comment.name || "Anonymous reader";
  const initial = name.charAt(0).toUpperCase();

  const handleLike = async () => {
    if (!user?.uid) {
      setLikeMessage("Sign in to like reader comments.");
      return;
    }
    if (!onLike || likeLoading) return;
    try {
      setLikeLoading(true);
      setLikeMessage("");
      await onLike(comment);
    } catch (error) {
      console.error("Like comment failed:", error);
      setLikeMessage("The like could not be updated. Please try again.");
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <article className={`rounded-3xl border bg-white p-5 shadow-sm transition hover:border-slate-300 dark:bg-slate-900 dark:hover:border-slate-700 sm:p-6 ${depth > 0 ? "mt-3 border-slate-200 dark:border-slate-700" : "border-slate-200 dark:border-slate-800"}`}>
      <header className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-black text-slate-700 dark:bg-slate-800 dark:text-slate-200" aria-hidden="true">{initial}</span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-black text-slate-950 dark:text-white">{name}</h3>
            <time className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{formatCommentDate(comment.createdAt)}</time>
          </div>
        </div>
        {canDelete && onDelete && (
          <button type="button" onClick={() => onDelete(comment.id)} className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-400 transition hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30 dark:hover:text-red-300" aria-label={`Delete comment by ${name}`}>Delete</button>
        )}
      </header>

      <p className="mt-4 whitespace-pre-wrap break-words text-[0.95rem] leading-7 text-slate-700 dark:text-slate-200">{comment.comment}</p>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
        <button type="button" onClick={handleLike} disabled={likeLoading} aria-pressed={hasLiked} className={`inline-flex min-h-9 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${hasLiked ? "bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-300" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"}`}>
          <span aria-hidden="true">{hasLiked ? "♥" : "♡"}</span>
          {likeLoading ? "Updating…" : "Helpful"}
          {likes > 0 && <span className="tabular-nums">{likes}</span>}
        </button>
        <button type="button" onClick={() => setShowReplyBox((current) => !current)} className="inline-flex min-h-9 items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
          {showReplyBox ? "Cancel reply" : "Reply"}
        </button>
        {replies.length > 0 && <span className="ml-auto text-xs font-bold text-slate-400">{replies.length} {replies.length === 1 ? "reply" : "replies"}</span>}
      </div>

      {likeMessage && <p className="mt-3 text-xs font-semibold text-amber-700 dark:text-amber-400" role="status">{likeMessage}</p>}

      {showReplyBox && (
        <div className="mt-4">
          <ReplyBox articleId={comment.articleId} parentId={comment.id} onSubmit={async (replyData) => {
            if (!onReply) return;
            await onReply({ ...replyData, parentId: comment.id });
            setShowReplyBox(false);
          }} />
        </div>
      )}

      {replies.length > 0 && (
        <div className="mt-5 border-l-2 border-amber-300 pl-3 dark:border-amber-500/40 sm:pl-5">
          {replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} onDelete={onDelete} onLike={onLike} depth={depth + 1} />
          ))}
        </div>
      )}
    </article>
  );
}
