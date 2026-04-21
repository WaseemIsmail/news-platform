"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-white px-6">
      <div className="max-w-2xl text-center">
        {/* Error Label */}
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
          Something Went Wrong
        </p>

        {/* Title */}
        <h1 className="mt-4 text-4xl font-bold text-slate-900 md:text-6xl">
          Unexpected Error
        </h1>

        {/* Description */}
        <p className="mt-6 text-lg leading-8 text-gray-600">
          We encountered an issue while loading this page.
          Please try again or return to the homepage.
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-gray-50"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}