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
    <main className="flex min-h-[70vh] items-center justify-center bg-white px-5 py-16 dark:bg-slate-950">
      <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-12">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl dark:bg-amber-400/15" aria-hidden="true">!</span>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
          Something Went Wrong
        </p>

        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
          This page did not load
        </h1>

        <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300">
          We encountered an issue while loading this page.
          Please try again or return to the homepage.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-black text-white transition hover:bg-amber-500 hover:text-slate-950 dark:bg-amber-400 dark:text-slate-950"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-black text-slate-900 transition hover:bg-white dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
