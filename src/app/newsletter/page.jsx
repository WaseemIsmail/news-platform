"use client";

import { useState } from "react";
import Link from "next/link";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      // Future: Save to Firestore / API route
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(
        "Successfully subscribed to the Contextra Newsletter!"
      );
      setEmail("");
    } catch (err) {
      console.error(err);
      setError("Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Side */}
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
              Stay Updated
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Subscribe to the Contextra Newsletter
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Get the latest breaking news, trending stories, opinion
              pieces, fact-check reports, and editorial insights
              delivered directly to your inbox.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-slate-200 p-4">
                Daily updates on politics, business, tech, and global affairs
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                Weekly opinion roundups and editorial insights
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                Exclusive timeline stories and deep analysis reports
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="mx-auto w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
            <div className="text-center">
              <Link
                href="/"
                className="text-2xl font-bold tracking-tight text-slate-900"
              >
                Contextra
              </Link>

              <h2 className="mt-4 text-3xl font-bold text-slate-900">
                Join Our Newsletter
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Stay informed without missing important stories.
              </p>
            </div>

            {success && (
              <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubscribe}
              className="mt-8 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Subscribing..." : "Subscribe Now"}
              </button>
            </form>

            <p className="mt-6 text-center text-xs leading-6 text-slate-500">
              By subscribing, you agree to our{" "}
              <Link
                href="/privacy"
                className="font-medium text-slate-900 hover:text-amber-700"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/terms"
                className="font-medium text-slate-900 hover:text-amber-700"
              >
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}