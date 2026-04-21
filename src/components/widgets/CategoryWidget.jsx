import Link from "next/link";

export default function CategoryWidget({ categories = [] }) {
  if (!categories || categories.length === 0) {
    return (
      <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            Categories
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">
            Browse Topics
          </h2>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
          <p className="text-sm text-slate-600">
            No categories available right now.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            Categories
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">
            Browse Topics
          </h2>
        </div>

        <Link
          href="/category"
          className="text-sm font-medium text-slate-700 transition hover:text-amber-700"
        >
          View all
        </Link>
      </div>

      <div className="space-y-3">
        {categories.slice(0, 8).map((category, index) => (
          <Link
            key={category.id || category.slug || index}
            href={`/category/${category.slug}`}
            className="group flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 transition group-hover:text-amber-700">
                {category.name}
              </p>
            </div>

            {category.count !== undefined && category.count !== null ? (
              <span className="ml-3 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {category.count}
              </span>
            ) : (
              <span className="ml-3 text-sm text-slate-400">→</span>
            )}
          </Link>
        ))}
      </div>
    </aside>
  );
}