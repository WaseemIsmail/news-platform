"use client";

import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";

const reactions = [
  {
    key: "support",
    label: "👍 Support",
  },
  {
    key: "against",
    label: "👎 Against",
  },
  {
    key: "neutral",
    label: "😐 Neutral",
  },
  {
    key: "need_more_info",
    label: "ℹ Need More Info",
  },
];

export default function ReactionBar({
  articleId,
  reactionCounts = {},
  userReaction = null,
  onReact,
}) {
  const { user } = useAuthContext();

  const handleReaction = async (reactionKey) => {
    if (!user) return;

    if (onReact) {
      await onReact({
        articleId,
        reaction: reactionKey,
        userId: user.uid,
      });
    }
  };

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Public Sentiment
          </p>

          <h3 className="mt-2 text-xl font-semibold text-slate-900">
            What do you think about this story?
          </h3>

          <p className="mt-2 text-sm leading-7 text-slate-600">
            Share your quick reaction before joining the discussion.
          </p>
        </div>

        {/* Not logged in */}
        {!user ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h4 className="text-base font-semibold text-slate-900">
              Login required to react
            </h4>

            <p className="mt-2 text-sm leading-7 text-slate-600">
              Please login to support, react, and participate in the
              discussion.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Create Account
              </Link>
            </div>
          </div>
        ) : (
          /* Logged in */
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {reactions.map((reaction) => {
              const isActive = userReaction === reaction.key;
              const count = reactionCounts?.[reaction.key] || 0;

              return (
                <button
                  key={reaction.key}
                  type="button"
                  onClick={() => handleReaction(reaction.key)}
                  className={`rounded-xl border px-4 py-4 text-sm font-medium transition ${
                    isActive
                      ? "border-amber-300 bg-amber-100 text-amber-800"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span>{reaction.label}</span>

                    <span className="text-xs font-semibold">
                      ({count})
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}