import Link from "next/link";

export default function UserActivityList({ activities = [] }) {
  const formatDate = (value) => {
    if (!value) return "Recently";

    if (typeof value?.toDate === "function") {
      return value.toDate().toLocaleDateString();
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Recently";

    return date.toLocaleDateString();
  };

  const getActivityLabel = (type) => {
    switch (type) {
      case "comment":
        return "Commented";
      case "bookmark":
        return "Bookmarked";
      case "reaction":
        return "Reacted";
      case "profile-update":
        return "Updated profile";
      case "login":
        return "Logged in";
      default:
        return "Activity";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "comment":
        return "bg-blue-100 text-blue-700";
      case "bookmark":
        return "bg-amber-100 text-amber-700";
      case "reaction":
        return "bg-green-100 text-green-700";
      case "profile-update":
        return "bg-purple-100 text-purple-700";
      case "login":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Activity
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Recent Activity
          </h2>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
          <p className="text-sm text-slate-600">
            No recent activity available yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Activity
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Recent Activity
          </h2>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const label = getActivityLabel(activity.type);
          const badgeClass = getActivityColor(activity.type);
          const title = activity.title || "Untitled activity";
          const description = activity.description || "";
          const href = activity.href || null;

          const content = (
            <div className="rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
                    >
                      {label}
                    </span>

                    <span className="text-xs text-slate-500">
                      {formatDate(activity.createdAt || activity.date)}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-slate-900">
                    {title}
                  </h3>

                  {description && (
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {description}
                    </p>
                  )}
                </div>

                {href && (
                  <span className="text-sm font-medium text-amber-700">
                    View →
                  </span>
                )}
              </div>
            </div>
          );

          return href ? (
            <Link key={activity.id || index} href={href} className="block">
              {content}
            </Link>
          ) : (
            <div key={activity.id || index}>{content}</div>
          );
        })}
      </div>
    </section>
  );
}