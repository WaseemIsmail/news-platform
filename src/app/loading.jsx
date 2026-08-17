export default function Loading() {
  return (
    <main className="min-h-[72vh] bg-white px-5 py-16 dark:bg-slate-950" aria-busy="true" aria-label="Loading Contextra">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 animate-pulse items-center justify-center rounded-xl bg-amber-400 font-black text-slate-950">C</span>
          <div>
            <p className="font-black text-slate-950 dark:text-white">Contextra</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Preparing the next view…</p>
          </div>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800">
            <div className="h-64 animate-pulse bg-slate-200 dark:bg-slate-800 sm:h-80" />
            <div className="space-y-4 p-6">
              <div className="h-4 w-28 animate-pulse rounded-full bg-amber-200 dark:bg-amber-500/20" />
              <div className="h-8 w-5/6 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-900" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100 dark:bg-slate-900" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {[0, 1].map((item) => <div key={item} className="h-52 animate-pulse rounded-3xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900" />)}
          </div>
        </div>
      </div>
    </main>
  );
}
