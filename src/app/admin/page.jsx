export default function AdminPage() {
  return (
    <section>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          Admin Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Welcome to Contextra Admin
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          Manage articles, moderate discussions, organize categories, and keep
          the platform updated with high-quality content.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Articles</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">24</h2>
          <p className="mt-2 text-sm text-slate-600">
            Published and draft articles currently in the system.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Comments</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">138</h2>
          <p className="mt-2 text-sm text-slate-600">
            Public comments posted across articles and discussions.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Categories</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">10</h2>
          <p className="mt-2 text-sm text-slate-600">
            Active categories used for article organization and discovery.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Users</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">312</h2>
          <p className="mt-2 text-sm text-slate-600">
            Registered users engaging with Contextra content.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Quick Actions
          </h3>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="/admin/articles/new"
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              New Article
            </a>

            <a
              href="/admin/articles"
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
            >
              Manage Articles
            </a>

            <a
              href="/admin/comments"
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
            >
              Moderate Comments
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Admin Note
          </h3>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Start by creating your first article, then move to categories,
            comments, and interaction features. This dashboard will later show
            real-time article counts, recent comments, and content activity.
          </p>
        </div>
      </div>
    </section>
  );
}