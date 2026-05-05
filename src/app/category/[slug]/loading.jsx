export default function Loading() {
  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="mt-5 h-10 w-72 rounded bg-slate-200" />
          <div className="mt-5 h-5 w-full max-w-2xl rounded bg-slate-200" />
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-56 rounded-2xl border border-slate-200 bg-slate-50"
            />
          ))}
        </div>
      </section>
    </main>
  );
}