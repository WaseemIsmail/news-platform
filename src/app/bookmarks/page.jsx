"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import AccountShell from "@/components/account/AccountShell";
import AccountState from "@/components/account/AccountState";
import ArticleCard from "@/components/article/ArticleCard";
import { useAuthContext } from "@/context/AuthContext";
import { db } from "@/lib/firebase";

export default function BookmarksPage() {
  const { user, loading: authLoading } = useAuthContext();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user?.uid) return undefined;
    let active = true;

    const loadBookmarks = async () => {
      await Promise.resolve();
      try {
        const savedIds = JSON.parse(localStorage.getItem("bookmarkedArticles") || "[]");
        const ids = Array.isArray(savedIds) ? savedIds : [];
        const articles = await Promise.all(ids.map(async (articleId) => {
          try {
            const snapshot = await getDoc(doc(db, "articles", articleId));
            return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
          } catch (articleError) {
            console.error(`Failed to load saved article ${articleId}:`, articleError);
            return null;
          }
        }));

        if (active) setBookmarks(articles.filter((article) => article?.status === "published" && article?.slug));
      } catch (bookmarkError) {
        console.error("Failed to load saved stories:", bookmarkError);
        if (active) setMessage("Your saved stories could not be loaded. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadBookmarks();
    return () => { active = false; };
  }, [user?.uid]);

  const removeBookmark = (articleId) => {
    const nextBookmarks = bookmarks.filter((article) => article.id !== articleId);
    setBookmarks(nextBookmarks);
    localStorage.setItem("bookmarkedArticles", JSON.stringify(nextBookmarks.map((article) => article.id)));
    setMessage("Story removed from your reading list.");
    window.setTimeout(() => setMessage(""), 2500);
  };

  if (authLoading || (user && loading)) return <AccountState loading />;
  if (!user) return <AccountState title="Sign in to see saved stories" description="Your reading list is connected to your reader account on this device." />;

  return (
    <AccountShell eyebrow="Your library" title="Saved stories" description="A focused reading list for reporting you want to revisit—without losing it in an endless feed." actions={<Link href="/latest" className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white dark:bg-amber-400 dark:text-slate-950">Find more stories</Link>}>
      {message && <div className="mb-5 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white dark:bg-amber-400 dark:text-slate-950" role="status" aria-live="polite">{message}</div>}
      {bookmarks.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900 sm:p-14"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-xl font-black text-amber-800 dark:bg-amber-500/15 dark:text-amber-300" aria-hidden="true">＋</div><h2 className="mt-5 text-2xl font-black">Build your reading list</h2><p className="mx-auto mt-3 max-w-lg leading-7 text-slate-600 dark:text-slate-300">Use the Save button on any article. Stories you want to revisit will appear here.</p><Link href="/latest" className="mt-7 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white dark:bg-amber-400 dark:text-slate-950">Explore latest stories</Link></div>
      ) : (
        <><div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-black">Your reading list</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{bookmarks.length} saved {bookmarks.length === 1 ? "story" : "stories"}</p></div><p className="text-xs text-slate-500 dark:text-slate-400">Saved on this browser</p></div><div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{bookmarks.map((article) => <div key={article.id} className="relative"><ArticleCard article={article} /><button type="button" onClick={() => removeBookmark(article.id)} className="absolute right-3 top-3 z-10 rounded-full bg-slate-950/85 px-3 py-2 text-xs font-bold text-white backdrop-blur transition hover:bg-red-600" aria-label={`Remove ${article.title} from saved stories`}>Remove</button></div>)}</div></>
      )}
    </AccountShell>
  );
}
