import Link from "next/link";
import { notFound } from "next/navigation";
import { getTimelineBySlug } from "@/lib/firestore";
import { generateSEO } from "@/lib/seo";
import formatDate from "@/utils/formatDate";

function normalizeEvents(events) {
  if (!Array.isArray(events)) return [];

  return events
    .filter((event) => event && typeof event === "object")
    .map((event, index) => ({
      id: event.id || `event-${index}`,
      title: event.title || "",
      description: event.description || "",
      date: event.date || "",
      type: event.type || "",
      source: event.source || "",
    }))
    .filter((event) => event.title.trim() !== "");
}

function sortEvents(events) {
  return [...events].sort((a, b) => {
    const aTime = a.date ? new Date(a.date).getTime() : Number.MAX_SAFE_INTEGER;
    const bTime = b.date ? new Date(b.date).getTime() : Number.MAX_SAFE_INTEGER;

    return aTime - bTime;
  });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const timeline = await getTimelineBySlug(slug);

  if (!timeline) {
    return {
      title: "Timeline Not Found | Contextra",
      description: "The timeline you are looking for could not be found.",
    };
  }

  return generateSEO({
    title: `${timeline.title} | Contextra`,
    description:
      timeline.summary ||
      "Follow this story through a clear chronological timeline on Contextra.",
    image: timeline.coverImage || "/images/default-og.jpg",
    url: `https://contextra.vercel.app/timeline/${timeline.slug}`,
  });
}

export default async function TimelinePage({ params }) {
  const { slug } = await params;
  const timeline = await getTimelineBySlug(slug);

  if (!timeline) {
    notFound();
  }

  const events = sortEvents(normalizeEvents(timeline.events));

  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="mb-6">
            <Link
              href="/timeline"
              className="text-sm font-medium text-amber-700 hover:underline"
            >
              ← Back to Timelines
            </Link>
          </div>

          <div className="mb-5">
            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
              {timeline.category || "General"}
            </span>
          </div>

          <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
            {timeline.title}
          </h1>

          {timeline.summary && (
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              {timeline.summary}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>{events.length} events</span>
            <span>•</span>
            <span>{timeline.status || "published"}</span>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-5xl px-6">
          {events.length > 0 ? (
            <div className="relative">
              <div className="absolute left-4 top-0 hidden h-full w-px bg-slate-200 md:block" />

              <div className="space-y-10">
                {events.map((event, index) => (
                  <div
                    key={event.id || index}
                    className="relative md:pl-14"
                  >
                    <div className="absolute left-0 top-2 hidden h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-xs font-bold text-white shadow md:flex">
                      {index + 1}
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="flex flex-wrap items-center gap-3">
                        {event.type && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
                            {event.type}
                          </span>
                        )}

                        {event.date && (
                          <span className="text-sm font-medium text-amber-700">
                            {formatDate(event.date)}
                          </span>
                        )}
                      </div>

                      <h2 className="mt-4 text-2xl font-bold text-slate-900">
                        {event.title}
                      </h2>

                      {event.description && (
                        <p className="mt-3 text-base leading-8 text-slate-600">
                          {event.description}
                        </p>
                      )}

                      {event.source && (
                        <p className="mt-4 text-sm text-slate-500">
                          Source: {event.source}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
              <h2 className="text-2xl font-bold text-slate-900">
                No timeline events available
              </h2>
              <p className="mt-3 text-slate-600">
                Events for this timeline have not been added yet.
              </p>
            </div>
          )}

          <section className="mt-14 border-t border-slate-200 pt-8">
            <h2 className="text-xl font-semibold text-slate-900">
              Continue Exploring
            </h2>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/latest"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
              >
                Latest Articles
              </Link>

              <Link
                href="/trending"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
              >
                Trending Topics
              </Link>

              {timeline.category && (
                <Link
                  href={`/category/${timeline.category.toLowerCase()}`}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
                >
                  More in {timeline.category}
                </Link>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}