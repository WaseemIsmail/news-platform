"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

export default function AdminShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    loading,
    user,
    canAccessAdmin,
    isAdmin,
    isEditor,
  } = useAuthContext();

  useEffect(() => {
    if (loading) return;

    // Not logged in
    if (!user) {
      router.replace("/login");
      return;
    }

    // Logged in but no admin/editor access
    if (!canAccessAdmin) {
      router.replace("/");
      return;
    }

    // Extra protection for admin-only routes
    const adminOnlyRoutes = [
      "/admin/users",
      "/admin/settings",
      "/admin/analytics",
    ];

    if (
      adminOnlyRoutes.includes(pathname) &&
      !isAdmin
    ) {
      router.replace("/admin");
    }
  }, [
    loading,
    user,
    canAccessAdmin,
    isAdmin,
    pathname,
    router,
  ]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-slate-600">
              Checking admin access...
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (!user || !canAccessAdmin) {
    return null;
  }

  const navLinks = [
    {
      label: "Dashboard",
      href: "/admin",
      adminOnly: false,
    },
    {
      label: "Articles",
      href: "/admin/articles",
      adminOnly: false,
    },
    {
      label: "New Article",
      href: "/admin/articles/new",
      adminOnly: false,
    },
    {
      label: "Comments",
      href: "/admin/comments",
      adminOnly: false,
    },
    {
      label: "Categories",
      href: "/admin/categories",
      adminOnly: false,
    },
    {
      label: "Tags",
      href: "/admin/tags",
      adminOnly: false,
    },
    {
      label: "Timeline",
      href: "/admin/timeline",
      adminOnly: false,
    },
    {
      label: "Polls",
      href: "/admin/polls",
      adminOnly: false,
    },
    {
      label: "Users",
      href: "/admin/users",
      adminOnly: true,
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      adminOnly: true,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      adminOnly: true,
    },
  ];

  const visibleLinks = navLinks.filter(
    (item) => !item.adminOnly || isAdmin
  );

  /* PERFECT ACTIVE SIDEBAR MATCHING */
  const isActive = (href) => {
    const exactOnlyRoutes = [
      "/admin",
      "/admin/articles",
      "/admin/articles/new",
    ];

    // exact match only for these routes
    if (exactOnlyRoutes.includes(href)) {
      return pathname === href;
    }

    // normal matching for others
    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 md:grid-cols-[280px_1fr]">
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

          <div className="mt-5 inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-700">
            {isAdmin
              ? "Admin Access"
              : isEditor
              ? "Editor Access"
              : "Restricted"}
          </div>

          {/* Navigation */}
          <nav className="mt-10 space-y-2">
            {visibleLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive(item.href)
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="mt-10 border-t border-slate-200 pt-6">
            <Link
              href="/"
              className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              ← Back to Site
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}