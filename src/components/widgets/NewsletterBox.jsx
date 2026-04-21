"use client";

import { useState } from "react";
import Link from "next/link";

export default function NewsletterBox() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      // Future: connect this to Firestore or /api route
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess("You’re subscribed to the Contextra newsletter.");
      setEmail("");
    } catch (err) {
      console.error(err);
      setError("Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
          Newsletter
        </p>
        <h2 className="mt-2 text-xl font-bold text-slate-900">
          Stay ahead of the story
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Get the latest headlines, editorial insights, fact-check reports,
          and timeline breakdowns delivered to your inbox.
        </p>
      </div>

      {success && (
        <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubscribe} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Email address
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      <p className="mt-4 text-xs leading-6 text-slate-500">
        By subscribing, you agree to our{" "}
        <Link
          href="/privacy"
          className="font-medium text-slate-700 hover:text-amber-700"
        >
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link
          href="/terms"
          className="font-medium text-slate-700 hover:text-amber-700"
        >
          Terms
        </Link>
        .
      </p>
    </aside>
  );
}