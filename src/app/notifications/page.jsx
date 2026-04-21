"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { fetchUserNotifications } from "@/services/notificationService";

export default function NotificationsPage() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async (userId) => {
    try {
      const data = await fetchUserNotifications(userId);
      setNotifications(data || []);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        loadNotifications(currentUser.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="text-slate-600">Loading notifications...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Please Login First
          </h1>

          <p className="mt-4 text-slate-600">
            Sign in to access your notifications.
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
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Notifications
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            Your Updates
          </h1>

          <p className="mt-4 text-slate-600">
            Stay updated with replies, reactions, and important alerts.
          </p>
        </div>
      </section>

      {/* Notifications List */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          {notifications.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">
                No notifications yet
              </h2>

              <p className="mt-4 text-slate-600">
                When people interact with your content, updates will appear here.
              </p>

              <Link
                href="/latest"
                className="mt-8 inline-block rounded-xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-800"
              >
                Explore Articles
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {item.title || "Notification"}
                      </p>

                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {item.message ||
                          "You have received a new notification."}
                      </p>
                    </div>

                    <span className="text-xs text-slate-400">
                      {item.createdAt?.toDate
                        ? item.createdAt.toDate().toLocaleDateString()
                        : "Recently"}
                    </span>
                  </div>

                  {item.link && (
                    <div className="mt-4">
                      <Link
                        href={item.link}
                        className="text-sm font-medium text-slate-900 hover:text-amber-700"
                      >
                        View →
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}