"use client";

import Link from "next/link";

export default function TimelineError({
  error,
  reset,
}) {
  console.error(error);

  return (
    <main className="bg-white">
      <section className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center px-6 py-16">
        <div className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Timeline Error
          </p>

          <h1 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
            Unable to load this timeline
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
            We couldn’t load the timeline you were trying to view.
            This may be a temporary issue, or the timeline may no
            longer be available.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => reset()}
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Try Again
            </button>

            <Link
              href="/timeline"
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
            >
              Back to Timelines
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}