import Link from "next/link";

export default function AdminArticlesPage() {
  const articles = [
    {
      id: 1,
      title: "Fuel Price Increase in Sri Lanka",
      category: "Economy",
      status: "Published",
      date: "April 20, 2026",
    },
    {
      id: 2,
      title: "Why Global Wars Affect Economies",
      category: "World",
      status: "Draft",
      date: "April 18, 2026",
    },
    {
      id: 3,
      title: "AI Is Changing Jobs Faster",
      category: "Technology",
      status: "Published",
      date: "April 15, 2026",
    },
  ];

  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Admin Articles
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Manage Articles
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            View, edit, and organize all Contextra articles from one place.
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="inline-flex items-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          New Article
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {articles.map((article) => (
                <tr
                  key={article.id}
                  className="border-b border-slate-100 last:border-b-0"
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {article.title}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {article.category}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        article.status === "Published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {article.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-500">
                    {article.date}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="text-sm font-medium text-slate-700 transition hover:text-slate-900 hover:underline"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        className="text-sm font-medium text-red-600 transition hover:text-red-700 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
