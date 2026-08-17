export default function Loading() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950" aria-busy="true" aria-label="Loading topic">
      <section className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl animate-pulse px-5 py-16 sm:px-6">
          <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="mt-8 h-14 w-72 max-w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="mt-5 h-5 w-full max-w-2xl rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </section>
      <section className="mx-auto max-w-7xl animate-pulse px-5 py-12 sm:px-6">
        <div className="h-[440px] rounded-3xl bg-slate-100 dark:bg-slate-900" />
        <div className="mt-8 grid gap-6 md:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-80 rounded-3xl bg-slate-100 dark:bg-slate-900" />)}</div>
      </section>
    </main>
  );
}
