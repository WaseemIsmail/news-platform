"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function AdminPage() {
  const router = useRouter();

  const {
    loading,
    user,
    canAccessAdmin,
    isAdmin,
    isEditor,
  } = useAuthContext();

  const [stats, setStats] = useState({
    totalArticles: 0,
    totalComments: 0,
    totalCategories: 0,
    totalUsers: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!canAccessAdmin) {
      router.replace("/");
      return;
    }

    fetchDashboardStats();
  }, [loading, user, canAccessAdmin, router]);

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);

      const [
        articlesSnapshot,
        commentsSnapshot,
        categoriesSnapshot,
        usersSnapshot,
      ] = await Promise.all([
        getDocs(collection(db, "articles")),
        getDocs(collection(db, "comments")),
        getDocs(collection(db, "categories")),
        getDocs(collection(db, "users")),
      ]);

      setStats({
        totalArticles: articlesSnapshot.size,
        totalComments: commentsSnapshot.size,
        totalCategories: categoriesSnapshot.size,
        totalUsers: usersSnapshot.size,
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-slate-50">
        <section className="mx-auto max-w-7xl px-4 py-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
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

  return (
    <section>
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          Admin Dashboard
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Welcome to Contextra Admin
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          Manage articles, moderate discussions, organize categories,
          and keep the platform updated with high-quality content.
        </p>

        <div className="mt-4 inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-700">
          {isAdmin
            ? "Admin Access"
            : isEditor
            ? "Editor Access"
            : "Restricted"}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {/* Articles */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Articles
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {statsLoading ? "..." : stats.totalArticles}
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Published and draft articles currently in the system.
          </p>
        </div>

        {/* Comments */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Comments
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {statsLoading ? "..." : stats.totalComments}
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Public comments posted across articles and discussions.
          </p>
        </div>

        {/* Categories */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Categories
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {statsLoading ? "..." : stats.totalCategories}
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Active categories used for article organization and discovery.
          </p>
        </div>

        {/* Users */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Users
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {statsLoading ? "..." : stats.totalUsers}
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Registered users engaging with Contextra content.
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Quick Actions
          </h3>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/admin/articles/new"
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              New Article
            </Link>

            <Link
              href="/admin/articles"
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
            >
              Manage Articles
            </Link>

            <Link
              href="/admin/comments"
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
            >
              Moderate Comments
            </Link>

            {isAdmin && (
              <Link
                href="/admin/users"
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
              >
                Manage Users
              </Link>
            )}
          </div>
        </div>

        {/* Admin Note */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Admin Note
          </h3>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            Start by creating your first article, then move to categories,
            comments, and interaction features. This dashboard now shows
            real-time values directly from Firestore instead of hardcoded data.
          </p>
        </div>
      </div>
    </section>
  );
}