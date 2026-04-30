"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [savedArticlesCount, setSavedArticlesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [reactionsCount, setReactionsCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);

  const getDisplayName = (currentUser) => {
    return (
      currentUser?.displayName ||
      currentUser?.email?.split("@")[0] ||
      "Contextra Reader"
    );
  };

  const getInitial = (currentUser) => {
    const name = getDisplayName(currentUser);
    return name ? name.charAt(0).toUpperCase() : "C";
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const fetchUserStats = async (currentUser) => {
    try {
      const savedBookmarks = JSON.parse(
        localStorage.getItem("bookmarkedArticles") || "[]"
      );

      setSavedArticlesCount(
        Array.isArray(savedBookmarks) ? savedBookmarks.length : 0
      );

      const commentsQuery = query(
        collection(db, "comments"),
        where("userId", "==", currentUser.uid)
      );

      const commentsSnapshot = await getDocs(commentsQuery);
      setCommentsCount(commentsSnapshot.size);

      const reactionsQuery = query(
        collection(db, "reactions"),
        where("userId", "==", currentUser.uid)
      );

      const reactionsSnapshot = await getDocs(reactionsQuery);
      setReactionsCount(reactionsSnapshot.size);

      const notificationsQuery = query(
        collection(db, "notifications"),
        where("userId", "==", currentUser.uid)
      );

      const notificationsSnapshot = await getDocs(notificationsQuery);
      setNotificationsCount(notificationsSnapshot.size);
    } catch (error) {
      console.error("Failed to fetch profile stats:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        await fetchUserStats(currentUser);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Please Login First
          </h1>

          <p className="mt-4 text-slate-600">
            You need to sign in to access your profile.
          </p>

          <Link
            href="/login"
            className="mt-8 inline-block rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            My Profile
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            Welcome Back, {getDisplayName(user)}
          </h1>

          <p className="mt-4 max-w-2xl text-slate-600">
            Manage your account, saved articles, notifications, and activity
            across Contextra.
          </p>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              {/* User Info */}
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-2xl font-bold text-white">
                  {getInitial(user)}
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {getDisplayName(user)}
                  </h2>

                  <p className="mt-2 text-sm text-slate-600">{user.email}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      Reader
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        user.emailVerified
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {user.emailVerified
                        ? "Email Verified"
                        : "Email Not Verified"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/bookmarks"
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Saved Articles
                </Link>

                <Link
                  href="/notifications"
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Notifications
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Stats - Card Boxes */}
            <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <p className="text-sm font-medium text-slate-500">
                  Saved Articles
                </p>

                <h3 className="mt-3 text-3xl font-bold text-slate-900">
                  {savedArticlesCount}
                </h3>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <p className="text-sm font-medium text-slate-500">
                  Comments Posted
                </p>

                <h3 className="mt-3 text-3xl font-bold text-slate-900">
                  {commentsCount}
                </h3>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <p className="text-sm font-medium text-slate-500">
                  Reactions Given
                </p>

                <h3 className="mt-3 text-3xl font-bold text-slate-900">
                  {reactionsCount}
                </h3>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <p className="text-sm font-medium text-slate-500">
                  Notifications
                </p>

                <h3 className="mt-3 text-3xl font-bold text-slate-900">
                  {notificationsCount}
                </h3>
              </div>
            </div>

            {/* Quick Access */}
            <div className="mt-10 grid gap-4 md:grid-cols-4">
              <Link
                href="/bookmarks"
                className="rounded-2xl border border-slate-200 p-5 transition hover:bg-slate-50"
              >
                <h4 className="font-semibold text-slate-900">
                  Saved Articles
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  View articles you have saved for later.
                </p>
              </Link>

              <Link
                href="/notifications"
                className="rounded-2xl border border-slate-200 p-5 transition hover:bg-slate-50"
              >
                <h4 className="font-semibold text-slate-900">
                  Notifications
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Check updates, replies, and platform alerts.
                </p>
              </Link>

              <Link
                href="/opinion"
                className="rounded-2xl border border-slate-200 p-5 transition hover:bg-slate-50"
              >
                <h4 className="font-semibold text-slate-900">Opinion</h4>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Read editorials and deeper public analysis.
                </p>
              </Link>

              <Link
                href="/timeline"
                className="rounded-2xl border border-slate-200 p-5 transition hover:bg-slate-50"
              >
                <h4 className="font-semibold text-slate-900">Timelines</h4>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Follow stories through chronological breakdowns.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}