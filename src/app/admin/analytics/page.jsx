"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalUsers: 0,
    totalComments: 0,
    totalBookmarks: 0,
    totalCategories: 0,
    totalTags: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [
        articlesSnap,
        usersSnap,
        commentsSnap,
        bookmarksSnap,
        categoriesSnap,
        tagsSnap,
      ] = await Promise.all([
        getDocs(collection(db, "articles")),
        getDocs(collection(db, "users")),
        getDocs(collection(db, "comments")),
        getDocs(collection(db, "bookmarks")),
        getDocs(collection(db, "categories")),
        getDocs(collection(db, "tags")),
      ]);

      setStats({
        totalArticles: articlesSnap.size,
        totalUsers: usersSnap.size,
        totalComments: commentsSnap.size,
        totalBookmarks: bookmarksSnap.size,
        totalCategories: categoriesSnap.size,
        totalTags: tagsSnap.size,
      });
    } catch (error) {
      console.error("Analytics fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Total Articles",
      value: stats.totalArticles,
      link: "/admin/articles",
    },
    {
      title: "Registered Users",
      value: stats.totalUsers,
      link: "/admin/users",
    },
    {
      title: "Comments",
      value: stats.totalComments,
      link: "/admin/comments",
    },
    {
      title: "Bookmarks",
      value: stats.totalBookmarks,
      link: "/admin/articles",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      link: "/admin/categories",
    },
    {
      title: "Tags",
      value: stats.totalTags,
      link: "/admin/tags",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Admin Dashboard
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            Analytics Overview
          </h1>

          <p className="mt-3 text-slate-600">
            Monitor articles, users, engagement, comments, and overall
            platform performance for Contextra.
          </p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-slate-600">Loading analytics...</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card, index) => (
              <Link
                key={index}
                href={card.link}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-3 text-4xl font-bold text-slate-900">
                  {card.value}
                </h2>

                <p className="mt-4 text-sm font-medium text-amber-700">
                  View Details →
                </p>
              </Link>
            ))}
          </div>
        )}

        {/* Quick Insights */}
        <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Quick Insights
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900">
                Most Active Section
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Based on content volume and interaction trends, this
                section can be expanded later using article analytics.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900">
                Reader Engagement
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Comments and bookmarks indicate how strongly users are
                interacting with editorial content.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900">
                Growth Opportunity
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Newsletter subscriptions and returning visitors can be
                tracked in the next analytics phase.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900">
                SEO Performance
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Organic traffic from categories, tags, and article pages
                can later integrate with Google Search Console reports.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}