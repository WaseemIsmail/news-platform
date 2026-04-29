"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";

export default function ReplyBox({
  articleId,
  parentId,
  onSubmit,
}) {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuthContext();

  // Automatically take logged-in user name
  const displayName =
    user?.displayName ||
    user?.fullName ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return;
    if (!reply.trim()) return;

    try {
      setLoading(true);

      await onSubmit({
        articleId,
        parentId,
        name: displayName, // auto save logged-in user name
        userId: user.uid,
        comment: reply.trim(),
      });

      setReply("");
    } catch (error) {
      console.error("Failed to submit reply:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
        <h4 className="text-base font-semibold text-slate-900">
          Login required to reply
        </h4>

        <p className="mt-2 text-sm leading-7 text-slate-600">
          Please login to reply and join the discussion.
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
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-slate-50 p-5"
    >
      <div className="space-y-4">
        {/* Removed Replying as field */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Your Reply
          </label>

          <textarea
            rows={4}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write your reply..."
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900"
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