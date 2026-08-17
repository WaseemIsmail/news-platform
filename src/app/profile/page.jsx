"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import AccountShell from "@/components/account/AccountShell";
import AccountState from "@/components/account/AccountState";
import { useAuthContext } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { formatArticleDate } from "@/lib/articlePresentation";

const quickLinks = [
  { href: "/bookmarks", title: "Continue reading", description: "Return to stories you saved for later.", action: "Open saved stories" },
  { href: "/notifications", title: "Stay in the conversation", description: "See replies, reactions, and account updates.", action: "View notifications" },
  { href: "/latest", title: "Discover something new", description: "Explore the newest published reporting.", action: "Browse latest" },
];

export default function ProfilePage() {
  const { user, firebaseUser, loading, logout } = useAuthContext();
  const [stats, setStats] = useState({ saved: 0, comments: 0, reactions: 0, notifications: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsMessage, setStatsMessage] = useState("");

  useEffect(() => {
    if (!user?.uid) return undefined;
    let active = true;

    const loadStats = async () => {
      try {
        const [commentsSnapshot, reactionsSnapshot, notificationsSnapshot] = await Promise.all([
          getDocs(query(collection(db, "comments"), where("userId", "==", user.uid))),
          getDocs(query(collection(db, "reactions"), where("userId", "==", user.uid))),
          getDocs(query(collection(db, "notifications"), where("userId", "==", user.uid))),
        ]);
        const savedIds = JSON.parse(localStorage.getItem("bookmarkedArticles") || "[]");
        if (active) setStats({ saved: Array.isArray(savedIds) ? savedIds.length : 0, comments: commentsSnapshot.size, reactions: reactionsSnapshot.size, notifications: notificationsSnapshot.size });
      } catch (statsError) {
        console.error("Failed to load reader activity:", statsError);
        if (active) setStatsMessage("Some activity totals are temporarily unavailable.");
      } finally {
        if (active) setStatsLoading(false);
      }
    };

    loadStats();
    return () => { active = false; };
  }, [user?.uid]);

  if (loading) return <AccountState loading />;
  if (!user) return <AccountState title="Your reader profile is private" description="Sign in to access saved stories, notifications, reactions, and account settings." />;

  const displayName = user.fullName || user.displayName || user.email?.split("@")[0] || "Contextra Reader";
  const initial = displayName.charAt(0).toUpperCase();
  const memberSince = formatArticleDate(user.createdAt, "Contextra reader");
  const statItems = [
    { label: "Saved stories", value: stats.saved, href: "/bookmarks" },
    { label: "Comments", value: stats.comments },
    { label: "Reactions", value: stats.reactions },
    { label: "Notifications", value: stats.notifications, href: "/notifications" },
  ];

  return (
    <AccountShell eyebrow="Reader account" title={`Welcome, ${displayName}`} description="Your private place to organise reading, follow conversations, and manage your Contextra account." actions={<><Link href="/settings" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900">Edit profile</Link><button type="button" onClick={async () => { await logout(); window.location.href = "/"; }} className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-amber-400 dark:text-slate-950">Sign out</button></>}>
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="relative bg-slate-950 p-6 text-white sm:p-8"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(245,158,11,0.3),_transparent_35%)]" /><div className="relative flex flex-col gap-5 sm:flex-row sm:items-center"><div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-amber-400 text-3xl font-black text-slate-950">{initial}</div><div><h2 className="text-2xl font-black">{displayName}</h2><p className="mt-1 text-sm text-slate-300">{user.email}</p><div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold capitalize">{user.role || "Reader"}</span><span className={`rounded-full px-3 py-1 text-xs font-bold ${firebaseUser?.emailVerified ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400/15 text-amber-300"}`}>{firebaseUser?.emailVerified ? "Email verified" : "Email verification pending"}</span><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">Member since {memberSince}</span></div></div></div></div>

        <div className="grid grid-cols-2 divide-x divide-y divide-slate-200 dark:divide-slate-800 lg:grid-cols-4 lg:divide-y-0">
          {statItems.map((item) => {
            const content = <><span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{item.label}</span><strong className="mt-2 block text-3xl font-black">{statsLoading ? "—" : item.value}</strong></>;
            return item.href ? <Link key={item.label} href={item.href} className="p-5 transition hover:bg-slate-50 dark:hover:bg-slate-800">{content}</Link> : <div key={item.label} className="p-5">{content}</div>;
          })}
        </div>
      </section>

      {statsMessage && <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-300" role="status">{statsMessage}</p>}

      <section className="mt-8"><div className="mb-5"><p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">Quick access</p><h2 className="mt-2 text-2xl font-black tracking-tight">What would you like to do?</h2></div><div className="grid gap-4 md:grid-cols-3">{quickLinks.map((item) => <Link key={item.href} href={item.href} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"><h3 className="text-lg font-black">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p><span className="mt-6 inline-flex text-sm font-bold text-amber-700 dark:text-amber-400">{item.action} <span className="ml-2 transition-transform group-hover:translate-x-1">→</span></span></Link>)}</div></section>
    </AccountShell>
  );
}
