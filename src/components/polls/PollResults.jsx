export default function PollResults({ poll }) {
  if (!poll || !Array.isArray(poll.options) || poll.options.length === 0) {
    return null;
  }

  const totalVotes =
    Number(poll.totalVotes || 0) ||
    poll.options.reduce(
      (total, option) => total + Number(option.votes || 0),
      0
    );

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          Poll Results
        </p>

        <h3 className="mt-2 text-lg font-semibold text-slate-900">
          Community Response
        </h3>

        <p className="mt-2 text-sm leading-7 text-slate-600">
          Total votes: {totalVotes}
        </p>
      </div>

      <div className="space-y-4">
        {poll.options.map((option, index) => {
          const votes = Number(option.votes || 0);
          const percentage =
            totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

          return (
            <div key={`${option.label}-${index}`}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-slate-700">
                  {option.label}
                </span>

                <span className="text-sm text-slate-500">
                  {percentage}% ({votes} votes)
                </span>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}