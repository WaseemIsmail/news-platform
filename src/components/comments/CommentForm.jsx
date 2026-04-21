"use client";

import { useState } from "react";

export default function CommentForm({
  articleId,
  parentId = null,
  onSubmit,
  placeholder = "Write your comment...",
  buttonText = "Post Comment",
}) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
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
        parentId,
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
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="space-y-4">
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
            Comment
          </label>

          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-70"
        >
          {loading ? "Submitting..." : buttonText}
        </button>
      </div>
    </form>
  );
}