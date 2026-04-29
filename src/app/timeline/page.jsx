import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { getAllTimelines } from "@/lib/firestore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  return generateSEO({
    title: "Timelines | Contextra",
    description:
      "Explore chronological timelines of major news stories, events, investigations, and public developments.",
    image: "/images/default-og.jpg",
    url: "https://contextra.vercel.app/timeline",
  });
}

function formatDate(dateValue) {
  if (!dateValue) return "";

  try {
    if (dateValue?.toDate) {
      return dateValue.toDate().toLocaleDateString();
    }

    return new Date(dateValue).toLocaleDateString();
  } catch {
    return "";
  }
}

export default async function TimelinesPage() {
  let timelines = [];

  try {
    timelines = await getAllTimelines();
  } catch (error) {
    console.error("TimelinesPage error:", error);
    timelines = [];
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-4 py-14">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Timeline Analysis
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            News Timelines
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Follow major stories through clear chronological breakdowns. Each
            timeline helps you understand how events developed over time.
          </p>
        </div>

        {/* Timeline List */}
        {timelines.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {timelines.map((timeline) => (
              <Link
                key={timeline.id}
                href={`/timeline/${timeline.slug}`}
                className="group rounded-3xl border border-slate-200 bg-white p-6 transition hover:shadow-md"
              >
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                    {timeline.category || "General"}
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
                    {timeline.status || "published"}
                  </span>
                </div>

                <h2 className="text-xl font-bold leading-7 text-slate-900 group-hover:text-black">
                  {timeline.title || "Untitled Timeline"}
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3">
                  {timeline.summary ||
                    "Read this timeline to understand how the story developed over time."}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span>
                    {Array.isArray(timeline.events)
                      ? timeline.events.length
                      : 0}{" "}
                    events
                  </span>

                  {formatDate(timeline.createdAt) && (
                    <>
                      <span>•</span>
                      <span>{formatDate(timeline.createdAt)}</span>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-20 text-center">
            <h3 className="text-xl font-semibold text-slate-800">
              No Timelines Available
            </h3>

            <p className="mt-2 text-slate-600">
              Timeline stories will appear here once they are published.
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-slate-900">
            Continue Exploring
          </h3>

          <p className="mt-3 text-slate-600">
            Read latest articles, opinion pieces, and fact-check reports.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/latest"
              className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Latest
            </Link>

            <Link
              href="/opinion"
              className="rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Opinion
            </Link>

            <Link
              href="/fact-check"
              className="rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Fact Check
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}