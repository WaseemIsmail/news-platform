"use client";

import { useState } from "react";

export default function ReplyBox({
  articleId,
  parentId,
  onSubmit,
}) {
  const [name, setName] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !reply.trim()) {
      return;
    }

    try {
      setLoading(true);

      await onSubmit({
        articleId,
        parentId,
        name: name.trim(),
        comment: reply.trim(),
      });

      setName("");
      setReply("");
    } catch (error) {
      console.error("Failed to submit reply:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-slate-50 p-5"
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
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Your Reply
          </label>

          <textarea
            rows={4}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write your reply..."
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-70"
        >
          {loading ? "Replying..." : "Post Reply"}
        </button>
      </div>
    </form>
  );
}