import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard | Contextra",
  description: "Manage Contextra articles, comments, categories, and users.",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 md:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="border-r border-slate-200 bg-white p-6">
          <Link href="/" className="block">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Contextra
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Admin Panel
            </p>
          </Link>

          <nav className="mt-10 space-y-2">
            <Link
              href="/admin"
              className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/articles"
              className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Articles
            </Link>

            <Link
              href="/admin/articles/new"
              className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              New Article
            </Link>

            <Link
              href="/admin/comments"
              className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Comments
            </Link>

            <Link
              href="/admin/categories"
              className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Categories
            </Link>

            <Link
              href="/admin/tags"
              className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Tags
            </Link>

            <Link
              href="/admin/users"
              className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Users
            </Link>
          </nav>
        </aside>

        {/* Content */}
        <main className="p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}