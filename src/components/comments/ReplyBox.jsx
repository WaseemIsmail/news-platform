"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";

const MAX_REPLY_LENGTH = 800;

export default function ReplyBox({ articleId, parentId, onSubmit }) {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();
  const displayName = user?.displayName || user?.fullName || user?.name || user?.email?.split("@")[0] || "Reader";

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user || !reply.trim() || loading) return;
    try {
      setLoading(true);
      await onSubmit({ articleId, parentId, name: displayName, userId: user.uid, comment: reply.trim() });
      setReply("");
    } catch (error) {
      console.error("Failed to submit reply:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Sign in to reply to this reader.</p>
        <div className="flex gap-2">
          <Link href="/login" className="inline-flex min-h-10 items-center rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white dark:bg-amber-400 dark:text-slate-950">Sign in</Link>
          <Link href="/signup" className="inline-flex min-h-10 items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-black text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">Join</Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={`reply-${parentId}`} className="text-xs font-black text-slate-700 dark:text-slate-200">Reply as {displayName}</label>
        <span className="text-xs tabular-nums text-slate-400">{reply.length}/{MAX_REPLY_LENGTH}</span>
      </div>
      <textarea id={`reply-${parentId}`} rows={3} maxLength={MAX_REPLY_LENGTH} value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write a constructive reply…" className="mt-3 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
      <div className="mt-3 flex justify-end">
        <button type="submit" disabled={loading || !reply.trim()} className="inline-flex min-h-10 items-center rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300">
          {loading ? "Publishing…" : "Publish reply"}
        </button>
      </div>
    </form>
  );
}
