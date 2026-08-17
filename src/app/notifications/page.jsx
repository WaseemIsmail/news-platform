"use client";

import Link from "next/link";
import { useState } from "react";
import AccountShell from "@/components/account/AccountShell";
import AccountState from "@/components/account/AccountState";
import { useAuthContext } from "@/context/AuthContext";
import { useNotificationContext } from "@/context/NotificationContext";
import { formatArticleDate } from "@/lib/articlePresentation";

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuthContext();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications } = useNotificationContext();
  const [confirmClear, setConfirmClear] = useState(false);
  const [message, setMessage] = useState("");

  const runAction = async (action, successMessage) => {
    await action();
    setMessage(successMessage);
    window.setTimeout(() => setMessage(""), 2500);
  };

  if (authLoading || (user && loading)) return <AccountState loading />;
  if (!user) return <AccountState title="Sign in to see notifications" description="Replies, reactions, and important account updates are private to your reader account." />;

  return (
    <AccountShell eyebrow="Inbox" title="Notifications" description="A calm record of replies, reactions, and account updates—newest first." actions={notifications.length > 0 && <button type="button" onClick={() => runAction(markAllAsRead, "All notifications marked as read.")} disabled={unreadCount === 0} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-900">Mark all read</button>}>
      {message && <div className="mb-5 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white dark:bg-amber-400 dark:text-slate-950" role="status" aria-live="polite">{message}</div>}

      {notifications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900 sm:p-14"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-black text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300" aria-hidden="true">✓</div><h2 className="mt-5 text-2xl font-black">You’re all caught up</h2><p className="mx-auto mt-3 max-w-lg leading-7 text-slate-600 dark:text-slate-300">Replies and important account updates will appear here when there is something worth your attention.</p><Link href="/latest" className="mt-7 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white dark:bg-amber-400 dark:text-slate-950">Explore latest stories</Link></div>
      ) : (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800"><p className="text-sm font-semibold text-slate-600 dark:text-slate-300"><strong className="text-slate-950 dark:text-white">{unreadCount}</strong> unread of {notifications.length}</p><button type="button" onClick={() => setConfirmClear(true)} className="text-xs font-bold text-red-600 hover:underline dark:text-red-400">Clear all</button></div>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">{notifications.map((item) => {
            const isRead = Boolean(item.read ?? item.isRead);
            const href = item.href || item.link || "";
            const content = <><div className="flex min-w-0 flex-1 gap-4"><span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${isRead ? "bg-slate-300 dark:bg-slate-700" : "bg-amber-500"}`} aria-label={isRead ? "Read" : "Unread"} /><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className={`text-sm ${isRead ? "font-semibold" : "font-black"}`}>{item.title || "Notification"}</h2><time className="text-xs text-slate-400">{formatArticleDate(item.createdAt, "Recently")}</time></div><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.message || "You have a new update."}</p>{href && <span className="mt-3 inline-flex text-xs font-bold text-amber-700 dark:text-amber-400">Open update →</span>}</div></div></>;
            return <article key={item.id} className={`flex items-start gap-4 p-5 transition ${isRead ? "bg-white dark:bg-slate-900" : "bg-amber-50/60 dark:bg-amber-500/5"}`}>
              {href ? <Link href={href} onClick={() => !isRead && markAsRead(item.id)} className="min-w-0 flex-1">{content}</Link> : <button type="button" onClick={() => !isRead && markAsRead(item.id)} className="min-w-0 flex-1 text-left">{content}</button>}
              <button type="button" onClick={() => deleteNotification(item.id)} className="shrink-0 rounded-lg px-2 py-1 text-xs font-bold text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30" aria-label={`Delete ${item.title || "notification"}`}>Delete</button>
            </article>;
          })}</div>
        </section>
      )}

      {confirmClear && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="clear-notifications-title"><div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl dark:bg-slate-900"><h2 id="clear-notifications-title" className="text-xl font-black">Clear every notification?</h2><p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">This removes your notification history and cannot be undone.</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setConfirmClear(false)} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold dark:border-slate-700">Cancel</button><button type="button" onClick={() => { setConfirmClear(false); runAction(clearAllNotifications, "Notification history cleared."); }} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700">Clear all</button></div></div></div>}
    </AccountShell>
  );
}
