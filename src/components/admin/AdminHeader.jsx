"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function getPageTitle(pathname) {
  if (pathname === "/admin") return "Dashboard";
  if (pathname === "/admin/articles") return "Articles";
  if (pathname === "/admin/articles/new") return "Create Article";
  if (pathname.includes("/admin/articles/") && pathname.includes("/edit")) {
    return "Edit Article";
  }
  if (pathname === "/admin/comments") return "Comments";
  if (pathname === "/admin/categories") return "Categories";
  if (pathname === "/admin/tags") return "Tags";
  if (pathname === "/admin/users") return "Users";
  return "Admin";
}

export default function AdminHeader() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          Contextra Admin
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          {pageTitle}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/admin/articles/new"
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          New Article
        </Link>

        <Link
          href="/"
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
        >
          View Site
        </Link>
      </div>
    </header>
  );
}