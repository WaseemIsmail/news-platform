"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";

const MAX_COMMENT_LENGTH = 1200;

export default function CommentBox({ articleId, onSubmit }) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();
  const displayName = user?.displayName || user?.name || user?.email?.split("@")[0] || "Reader";
  const initial = displayName.charAt(0).toUpperCase();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user || !comment.trim() || loading) return;

    try {
      setLoading(true);
      await onSubmit({ articleId, name: displayName, userId: user.uid, comment: comment.trim() });
      setComment("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" aria-labelledby="comment-composer-title">
      <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-7">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">Your perspective</p>
        <h3 id="comment-composer-title" className="mt-2 text-xl font-black tracking-tight text-slate-950 dark:text-white sm:text-2xl">Add to the conversation</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Respond to the reporting, add useful context, or ask a thoughtful question.</p>
      </div>

      <div className="p-5 sm:p-7">
        {!user ? (
          <div className="grid gap-5 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/30 dark:bg-amber-500/10 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <h4 className="font-black text-slate-950 dark:text-white">Sign in before commenting</h4>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">Accounts support moderation and give you control of your own contributions.</p>
            </div>
            <div className="flex gap-2">
              <Link href="/login" className="inline-flex min-h-11 items-center rounded-xl bg-slate-950 px-4 py-2 text-sm font-black text-white dark:bg-amber-400 dark:text-slate-950">Sign in</Link>
              <Link href="/signup" className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-black text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">Join</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white dark:bg-amber-400 dark:text-slate-950" aria-hidden="true">{initial}</span>
              <div>
                <p className="text-sm font-black text-slate-950 dark:text-white">Commenting as {displayName}</p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Keep it relevant, respectful, and useful.</p>
              </div>
            </div>

            <label htmlFor="article-comment" className="sr-only">Your comment</label>
            <textarea
              id="article-comment"
              rows={5}
              maxLength={MAX_COMMENT_LENGTH}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="What perspective or context would improve this discussion?"
              className="mt-5 w-full resize-y rounded-2xl border border-slate-300 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950"
            />

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400"><span className="font-bold tabular-nums">{comment.length}</span> / {MAX_COMMENT_LENGTH} characters</p>
              <button type="submit" disabled={loading || !comment.trim()} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300 sm:min-w-36">
                {loading ? "Publishing…" : "Publish comment"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
