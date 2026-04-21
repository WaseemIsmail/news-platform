export default function TimelineLoading() {
  return (
    <main className="bg-white">
      {/* Hero Section Skeleton */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-14">
          {/* Back Button */}
          <div className="mb-6 h-5 w-40 animate-pulse rounded bg-slate-200" />

          {/* Category Badge */}
          <div className="mb-5 h-7 w-24 animate-pulse rounded-full bg-amber-100" />

          {/* Title */}
          <div className="space-y-3">
            <div className="h-10 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-10 w-4/5 animate-pulse rounded bg-slate-200" />
          </div>

          {/* Summary */}
          <div className="mt-6 space-y-3">
            <div className="h-5 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-11/12 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-9/12 animate-pulse rounded bg-slate-200" />
          </div>

          {/* Meta */}
          <div className="mt-6 flex gap-3">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </section>

      {/* Timeline Events Skeleton */}
      <section className="py-14">
        <div className="mx-auto max-w-5xl px-6">
          <div className="space-y-10">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="relative md:pl-14"
              >
                {/* Circle */}
                <div className="absolute left-0 top-2 hidden h-8 w-8 animate-pulse rounded-full bg-slate-200 md:block" />

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  {/* Badge + Date */}
                  <div className="flex flex-wrap gap-3">
                    <div className="h-7 w-24 animate-pulse rounded-full bg-slate-200" />
                    <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
                  </div>

                  {/* Event Title */}
                  <div className="mt-4 space-y-2">
                    <div className="h-8 w-4/5 animate-pulse rounded bg-slate-200" />
                  </div>

                  {/* Description */}
                  <div className="mt-4 space-y-3">
                    <div className="h-5 w-full animate-pulse rounded bg-slate-200" />
                    <div className="h-5 w-11/12 animate-pulse rounded bg-slate-200" />
                    <div className="h-5 w-9/12 animate-pulse rounded bg-slate-200" />
                  </div>

                  {/* Source */}
                  <div className="mt-4 h-4 w-40 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>

          {/* Continue Exploring Skeleton */}
          <section className="mt-14 border-t border-slate-200 pt-8">
            <div className="h-6 w-52 animate-pulse rounded bg-slate-200" />

            <div className="mt-5 flex flex-wrap gap-3">
              <div className="h-10 w-36 animate-pulse rounded-xl bg-slate-200" />
              <div className="h-10 w-36 animate-pulse rounded-xl bg-slate-200" />
              <div className="h-10 w-40 animate-pulse rounded-xl bg-slate-200" />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}