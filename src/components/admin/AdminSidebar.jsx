"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin",
  },
  {
    name: "Articles",
    path: "/admin/articles",
  },
  {
    name: "New Article",
    path: "/admin/articles/new",
  },
  {
    name: "Comments",
    path: "/admin/comments",
  },
  {
    name: "Categories",
    path: "/admin/categories",
  },
  {
    name: "Tags",
    path: "/admin/tags",
  },
  {
    name: "Users",
    path: "/admin/users",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="min-h-screen border-r border-slate-200 bg-white p-6">
      <div className="mb-10">
        <Link href="/" className="block">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Contextra
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Admin Panel
          </p>
        </Link>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.path !== "/admin" && pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`block rounded-lg px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-amber-50 text-amber-700"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

