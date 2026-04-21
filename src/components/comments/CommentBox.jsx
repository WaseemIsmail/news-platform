"use client";

import { useState } from "react";

export default function CommentBox({ articleId, onSubmit }) {
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !comment.trim()) {
      return;
    }

    try {
      setLoading(true);

      await onSubmit({
        articleId,
        name: name.trim(),
        comment: comment.trim(),
      });

      setName("");
      setComment("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          Join the Discussion
        </p>

        <h3 className="mt-2 text-xl font-semibold text-slate-900">
          Share your thoughts
        </h3>

        <p className="mt-2 text-sm leading-7 text-slate-600">
          Add your opinion and be part of the public conversation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Your Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Your Comment
          </label>

          <textarea
            rows={5}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your thoughts here..."
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-70"
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </section>
  );
}