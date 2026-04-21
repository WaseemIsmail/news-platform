export default function TimelineItem({
  index,
  year,
  title,
  description,
}) {
  return (
    <div className="relative pl-16">
      {/* Timeline Number Circle */}
      <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border border-amber-200 bg-amber-100 text-xs font-semibold text-amber-800">
        {index + 1}
      </div>

      {/* Content Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
        {/* Year / Phase */}
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-700">
          {year || "Timeline Event"}
        </p>

        {/* Title */}
        <h3 className="mt-2 text-xl font-semibold text-slate-900">
          {title || "Untitled Event"}
        </h3>

        {/* Description */}
        <p className="mt-4 text-sm leading-7 text-slate-600">
          {description ||
            "Detailed explanation for this event will be added here."}
        </p>
      </div>
    </div>
  );
}