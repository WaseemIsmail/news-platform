import TimelineItem from "./TimelineItem";
import TimelineSummary from "./TimelineSummary";

export default function Timeline({
  title,
  subtitle,
  items = [],
  showSummary = true,
}) {
  if (!items.length) {
    return (
      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          No timeline available
        </h2>

        <p className="mt-3 text-sm leading-7 text-slate-600">
          Timeline data has not been added for this story yet.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          Historical Context
        </p>

        <h2 className="mt-3 text-3xl font-bold text-slate-900">
          {title || "Story Timeline"}
        </h2>

        {subtitle && (
          <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-600">
            {subtitle}
          </p>
        )}
      </div>

      {/* Timeline Line */}
      <div className="relative">
        <div className="absolute left-5 top-0 h-full w-px bg-slate-200" />

        <div className="space-y-10">
          {items.map((item, index) => (
            <TimelineItem
              key={index}
              index={index}
              year={item.year}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>

      {/* Final Summary */}
      {showSummary && (
        <TimelineSummary />
      )}
    </section>
  );
}