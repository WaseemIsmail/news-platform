"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";

const reactions = [
  {
    key: "support",
    label: "Support",
    description: "I agree with this perspective",
    symbol: "↑",
    iconClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
    activeClass: "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200 dark:border-emerald-400 dark:bg-emerald-400/10 dark:ring-emerald-400/20",
  },
  {
    key: "against",
    label: "Against",
    description: "I disagree with this perspective",
    symbol: "↓",
    iconClass: "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300",
    activeClass: "border-rose-400 bg-rose-50 ring-2 ring-rose-200 dark:border-rose-400 dark:bg-rose-400/10 dark:ring-rose-400/20",
  },
  {
    key: "neutral",
    label: "Neutral",
    description: "I see more than one side",
    symbol: "—",
    iconClass: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
    activeClass: "border-slate-400 bg-slate-100 ring-2 ring-slate-200 dark:border-slate-500 dark:bg-slate-800 dark:ring-slate-700",
  },
  {
    key: "need_more_info",
    label: "Need context",
    description: "I need more information",
    symbol: "?",
    iconClass: "bg-blue-100 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300",
    activeClass: "border-blue-400 bg-blue-50 ring-2 ring-blue-200 dark:border-blue-400 dark:bg-blue-400/10 dark:ring-blue-400/20",
  },
];

export default function ReactionBar({
  articleId,
  reactionCounts = {},
  userReaction = null,
  onReact,
}) {
  const { user } = useAuthContext();
  const [pendingReaction, setPendingReaction] = useState("");
  const totalReactions = reactions.reduce(
    (total, reaction) => total + Number(reactionCounts?.[reaction.key] || 0),
    0,
  );

  const handleReaction = async (reactionKey) => {
    if (!user || !onReact || pendingReaction) return;

    try {
      setPendingReaction(reactionKey);
      await onReact({ articleId, reaction: reactionKey, userId: user.uid });
    } finally {
      setPendingReaction("");
    }
  };

  return (
    <section className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-5 dark:border-slate-800 dark:bg-slate-950/50 sm:flex sm:items-end sm:justify-between sm:gap-6 sm:px-7">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
            Quick reaction
          </p>
          <h3 className="mt-2 text-xl font-black tracking-tight text-slate-950 dark:text-white sm:text-2xl">
            How did this story land with you?
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Choose one response. You can change or remove it at any time.
          </p>
        </div>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 sm:mt-0">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          {totalReactions} {totalReactions === 1 ? "response" : "responses"}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {reactions.map((reaction) => {
            const isActive = userReaction === reaction.key;
            const count = Number(reactionCounts?.[reaction.key] || 0);
            const isPending = pendingReaction === reaction.key;

            return (
              <button
                key={reaction.key}
                type="button"
                onClick={() => handleReaction(reaction.key)}
                disabled={!user || Boolean(pendingReaction)}
                aria-pressed={isActive}
                className={`group flex min-h-24 items-center gap-4 rounded-2xl border p-4 text-left transition focus-visible:outline-offset-2 disabled:cursor-not-allowed ${
                  isActive
                    ? reaction.activeClass
                    : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600"
                } ${!user ? "opacity-80" : ""}`}
              >
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl font-black ${reaction.iconClass}`} aria-hidden="true">
                  {reaction.symbol}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-3">
                    <strong className="text-sm font-black text-slate-950 dark:text-white">
                      {isPending ? "Updating…" : reaction.label}
                    </strong>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black tabular-nums text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {count}
                    </span>
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {reaction.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {!user ? (
          <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black text-slate-950 dark:text-white">Sign in to add your voice</p>
              <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">Reader accounts help keep one reaction per person.</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link href="/login" className="inline-flex min-h-11 items-center rounded-xl bg-slate-950 px-4 py-2 text-sm font-black text-white dark:bg-amber-400 dark:text-slate-950">Sign in</Link>
              <Link href="/signup" className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-black text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">Join</Link>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400" role="status" aria-live="polite">
            {userReaction ? "Your response is included in the totals." : "Select a response to take part in the reader pulse."}
          </p>
        )}
      </div>
    </section>
  );
}
