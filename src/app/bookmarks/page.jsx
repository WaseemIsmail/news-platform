"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { fetchUserBookmarks } from "@/services/bookmarkService";

export default function BookmarksPage() {
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookmarks = async (userId) => {
    try {
      const data = await fetchUserBookmarks(userId);
      setBookmarks(data || []);
    } catch (error) {
      console.error("Failed to load bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        loadBookmarks(currentUser.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <main className="bg-white min-h-screen">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="text-slate-600">Loading saved articles...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="bg-white min-h-screen">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Please Login First
          </h1>

          <p className="mt-4 text-slate-600">
            Sign in to view your saved articles.
          </p>

          <Link
            href="/login"
            className="mt-8 inline-block rounded-xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-800"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      {/* Header */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Bookmarks
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            Saved Articles
          </h1>

          <p className="mt-4 text-slate-600">
            Your personal reading list for later.
          </p>
        </div>
      </section>

      {/* Bookmarks */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          {bookmarks.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">
                No saved articles yet
              </h2>

              <p className="mt-4 text-slate-600">
                Start bookmarking important stories to read later.
              </p>

              <Link
                href="/latest"
                className="mt-8 inline-block rounded-xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-800"
              >
                Explore Articles
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  {bookmarks.length} Saved Article
                  {bookmarks.length > 1 ? "s" : ""}
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {bookmarks.map((article) => (
                  <article
                    key={article.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                  >
                    <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                      {article.category || "General"}
                    </span>

                    <h3 className="mt-4 text-xl font-semibold text-slate-900">
                      {article.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {article.summary ||
                        "Read the full article for deeper analysis and context."}
                    </p>

                    <div className="mt-6">
                      <Link
                        href={`/article/${article.slug}`}
                        className="text-sm font-semibold text-slate-900 hover:text-amber-700"
                      >
                        Read Article →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}