"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";

export default function CommentBox({ articleId, onSubmit }) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuthContext();

  const displayName =
    user?.displayName ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return;
    if (!comment.trim()) return;

    try {
      setLoading(true);

      await onSubmit({
        articleId,
        name: displayName,
        userId: user.uid,
        comment: comment.trim(),
      });

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

      {!user ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h4 className="text-lg font-semibold text-slate-900">
            Login required to comment
          </h4>

          <p className="mt-2 text-sm leading-7 text-slate-600">
            You need to login to comment, reply, react, and join the discussion.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Create Account
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Your Comment
            </label>

            <textarea
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your thoughts here..."
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900"
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
      )}
    </section>
  );
}