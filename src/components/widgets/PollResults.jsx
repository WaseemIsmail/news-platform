export default function PollResults({ poll }) {
  if (!poll || !poll.options?.length) return null;

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          Poll Results
        </p>
        <h3 className="mt-2 text-xl font-semibold text-slate-900">
          Community Response
        </h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Total votes: {poll.totalVotes || 0}
        </p>
      </div>

      <div className="space-y-4">
        {poll.options.map((option) => (
          <div key={option.label}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">
                {option.label}
              </span>
              <span className="text-sm text-slate-500">
                {option.percentage || 0}% ({option.votes || 0})
              </span>
            </div>

            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-500"
                style={{ width: `${option.percentage || 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}