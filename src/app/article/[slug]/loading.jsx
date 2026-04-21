export default function ArticleLoading() {
  return (
    <main className="bg-white">
      <article className="mx-auto max-w-4xl px-6 py-14">
        {/* Back Button Skeleton */}
        <div className="mb-8 h-5 w-36 animate-pulse rounded bg-slate-200" />

        {/* Category Badge Skeleton */}
        <div className="mb-6 h-7 w-24 animate-pulse rounded-full bg-amber-100" />

        {/* Title Skeleton */}
        <div className="space-y-3">
          <div className="h-10 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-10 w-4/5 animate-pulse rounded bg-slate-200" />
        </div>

        {/* Meta Skeleton */}
        <div className="mt-6 flex gap-3">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
        </div>

        {/* Summary Skeleton */}
        <div className="mt-8 space-y-3">
          <div className="h-5 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-5 w-11/12 animate-pulse rounded bg-slate-200" />
          <div className="h-5 w-10/12 animate-pulse rounded bg-slate-200" />
        </div>

        {/* Image Skeleton */}
        <div className="mt-10 h-[420px] animate-pulse rounded-2xl bg-slate-200" />

        {/* Our View Skeleton */}
        <div className="mt-10 rounded-2xl border border-amber-100 bg-amber-50 p-6">
          <div className="h-4 w-24 animate-pulse rounded bg-amber-200" />
          <div className="mt-4 space-y-3">
            <div className="h-5 w-full animate-pulse rounded bg-amber-100" />
            <div className="h-5 w-11/12 animate-pulse rounded bg-amber-100" />
            <div className="h-5 w-9/12 animate-pulse rounded bg-amber-100" />
          </div>
        </div>

        {/* Content Skeleton */}
        <section className="mt-10 space-y-5">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="space-y-2"
            >
              <div className="h-5 w-full animate-pulse rounded bg-slate-200" />
              <div className="h-5 w-11/12 animate-pulse rounded bg-slate-200" />
              <div className="h-5 w-10/12 animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </section>

        {/* Continue Exploring Skeleton */}
        <section className="mt-14 border-t border-slate-200 pt-8">
          <div className="h-6 w-52 animate-pulse rounded bg-slate-200" />

          <div className="mt-5 flex flex-wrap gap-3">
            <div className="h-10 w-36 animate-pulse rounded-xl bg-slate-200" />
            <div className="h-10 w-36 animate-pulse rounded-xl bg-slate-200" />
            <div className="h-10 w-40 animate-pulse rounded-xl bg-slate-200" />
          </div>
        </section>
      </article>
    </main>
  );
}