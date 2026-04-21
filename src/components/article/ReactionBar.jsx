"use client";

import { useState } from "react";

const reactions = [
  { key: "support", label: "Support" },
  { key: "against", label: "Against" },
  { key: "neutral", label: "Neutral" },
  { key: "need_more_info", label: "Need More Info" },
];

export default function ReactionBar({ articleId }) {
  const [selectedReaction, setSelectedReaction] = useState(null);

  const handleReaction = (reactionKey) => {
    setSelectedReaction(reactionKey);

    // Later connect this to Firestore
    console.log("Reaction saved:", {
      articleId,
      reaction: reactionKey,
    });
  };

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4">
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

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {reactions.map((reaction) => {
            const isActive = selectedReaction === reaction.key;

            return (
              <button
                key={reaction.key}
                type="button"
                onClick={() => handleReaction(reaction.key)}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "border-amber-300 bg-amber-100 text-amber-800"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {reaction.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}