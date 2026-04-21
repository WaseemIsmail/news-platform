export default function TimelineChart({ items = [] }) {
  if (!items.length) return null;

  return (
    <section className="mt-14 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          Visual Overview
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Timeline Progression
        </h2>

        <p className="mt-3 text-sm leading-7 text-slate-600">
          A simplified view of how the story evolved over time.
        </p>
      </div>

      {/* Horizontal Progress Line */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="relative flex items-center justify-between">
            {/* Background Line */}
            <div className="absolute left-0 top-5 h-1 w-full rounded-full bg-slate-200" />

            {items.map((item, index) => (
              <div
                key={index}
                className="relative z-10 flex flex-col items-center text-center"
              >
                {/* Circle */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-200 bg-amber-100 text-xs font-semibold text-amber-800 shadow-sm">
                  {index + 1}
                </div>

                {/* Year */}
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">
                  {item.year || "Stage"}
                </p>

                {/* Title */}
                <p className="mt-2 max-w-[140px] text-sm font-medium text-slate-700">
                  {item.title || "Event"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}