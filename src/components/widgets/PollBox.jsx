"use client";

import { useState } from "react";

export default function PollBox({
  question = "What do you think about this issue?",
  options = [],
  onVote,
  loading = false,
}) {
  const [selectedOption, setSelectedOption] = useState("");

  const handleVote = async () => {
    if (!selectedOption || !onVote) return;
    await onVote(selectedOption);
  };

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          Live Poll
        </p>
        <h3 className="mt-2 text-xl font-semibold text-slate-900">
          {question}
        </h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Cast your vote and see how others are thinking.
        </p>
      </div>

      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selectedOption === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => setSelectedOption(option)}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                isSelected
                  ? "border-amber-300 bg-amber-50 text-amber-800"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={handleVote}
          disabled={!selectedOption || loading}
          className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Submitting..." : "Submit Vote"}
        </button>
      </div>
    </section>
  );
}