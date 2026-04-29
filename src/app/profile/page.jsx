"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [savedArticlesCount, setSavedArticlesCount] =
    useState(0);

  const [commentsCount, setCommentsCount] =
    useState(0);

  const [reactionsCount, setReactionsCount] =
    useState(0);

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
      /*
        BOOKMARKS FROM LOCALSTORAGE
      */
      const savedBookmarks = JSON.parse(
        localStorage.getItem("bookmarkedArticles") || "[]"
      );

      setSavedArticlesCount(savedBookmarks.length);

      /*
        COMMENTS COUNT
      */
      const commentsRef = collection(db, "comments");

      const commentsQuery = query(
        commentsRef,
        where("userId", "==", currentUser.uid)
      );

      const commentsSnapshot = await getDocs(
        commentsQuery
      );

      setCommentsCount(commentsSnapshot.size);

      /*
        REACTIONS COUNT
      */
      const reactionsRef = collection(
        db,
        "reactions"
      );

      const reactionsQuery = query(
        reactionsRef,
        where("userId", "==", currentUser.uid)
      );

      const reactionsSnapshot = await getDocs(
        reactionsQuery
      );

      setReactionsCount(reactionsSnapshot.size);
    } catch (error) {
      console.error(
        "Failed to fetch profile stats:",
        error
      );
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser);

        if (currentUser) {
          await fetchUserStats(currentUser);
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <main className="bg-white min-h-screen">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="text-slate-600">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="bg-white min-h-screen">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Please Login First
          </h1>

          <p className="mt-4 text-slate-600">
            You need to sign in to access your profile.
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
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            My Profile
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            Welcome Back
          </h1>

          <p className="mt-4 text-slate-600">
            Manage your account, saved articles,
            and activity.
          </p>
        </div>
      </section>

      {/* Profile Card */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              {/* User Info */}
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-2xl font-bold text-amber-700">
                  {user.displayName
                    ? user.displayName
                        .charAt(0)
                        .toUpperCase()
                    : user.email
                        .charAt(0)
                        .toUpperCase()}
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {user.displayName ||
                      "Contextra Reader"}
                  </h2>

                  <p className="mt-2 text-sm text-slate-600">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/bookmarks"
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Saved Articles
                </Link>

                <Link
                  href="/notifications"
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Notifications
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 p-5">
                <p className="text-sm text-slate-500">
                  Saved Articles
                </p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {savedArticlesCount}
                </h3>
              </div>

              <div className="rounded-xl border border-slate-200 p-5">
                <p className="text-sm text-slate-500">
                  Comments Posted
                </p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {commentsCount}
                </h3>
              </div>

              <div className="rounded-xl border border-slate-200 p-5">
                <p className="text-sm text-slate-500">
                  Reactions Given
                </p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {reactionsCount}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}