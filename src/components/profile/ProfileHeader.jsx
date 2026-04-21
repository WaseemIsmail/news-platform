"use client";

import Link from "next/link";

export default function ProfileHeader({ user }) {
  const displayName =
    user?.fullName ||
    user?.displayName ||
    "Contextra Reader";

  const email =
    user?.email ||
    "reader@contextra.com";

  const photoURL = user?.photoURL || null;

  const role =
    user?.role ||
    "Reader";

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-2xl font-bold text-slate-700">
            {photoURL ? (
              <img
                src={photoURL}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>

          {/* User Info */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
              Profile
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              {displayName}
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              {email}
            </p>

            <div className="mt-3 inline-flex rounded-full bg-slate-100 px-4 py-1 text-xs font-medium text-slate-700">
              {role}
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/settings"
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Edit Profile
          </Link>

          <Link
            href="/bookmarks"
            className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Saved Articles
          </Link>
        </div>
      </div>
    </section>
  );
}