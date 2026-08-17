"use client";

import { useEffect, useState } from "react";

const actionClass = "inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600";

export default function ShareBar({ article }) {
  const [articleUrl, setArticleUrl] = useState(`https://contextra.netlify.app/article/${article?.slug || ""}`);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [message, setMessage] = useState("");
  const shareText = article?.title || "Read this article on Contextra";

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setArticleUrl(window.location.href);
      try {
        const savedBookmarks = JSON.parse(localStorage.getItem("bookmarkedArticles") || "[]");
        setIsBookmarked(savedBookmarks.includes(article?.id));
      } catch {
        setIsBookmarked(false);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [article?.id]);

  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(() => setMessage(""), 2500);
    return () => window.clearTimeout(timer);
  }, [message]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setMessage("Link copied to your clipboard");
    } catch {
      setMessage("Could not copy the link");
    }
  };

  const handleBookmark = () => {
    try {
      const savedBookmarks = JSON.parse(localStorage.getItem("bookmarkedArticles") || "[]");
      const exists = savedBookmarks.includes(article?.id);
      const updatedBookmarks = exists ? savedBookmarks.filter((id) => id !== article?.id) : [...savedBookmarks, article?.id];
      localStorage.setItem("bookmarkedArticles", JSON.stringify(updatedBookmarks));
      setIsBookmarked(!exists);
      setMessage(exists ? "Removed from saved stories" : "Saved for later");
    } catch {
      setMessage("Could not update saved stories");
    }
  };

  const networks = [
    { label: "X", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(articleUrl)}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${articleUrl}`)}` },
  ];

  return (
    <aside className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60 sm:flex sm:items-center sm:justify-between sm:gap-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-amber-400 dark:text-slate-950" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v6h14v-6"/></svg>
        </span>
        <div>
          <h3 className="text-sm font-black text-slate-950 dark:text-white">Keep or share this story</h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Return later or continue the conversation elsewhere.</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 sm:mt-0 sm:justify-end">
        <button type="button" onClick={handleBookmark} className={`${actionClass} ${isBookmarked ? "border-amber-300 bg-amber-100 text-amber-950 dark:border-amber-500 dark:bg-amber-500/15 dark:text-amber-300" : ""}`} aria-pressed={isBookmarked}>
          {isBookmarked ? "Saved" : "Save"}
        </button>
        <button type="button" onClick={handleCopyLink} className={actionClass}>Copy link</button>
        <details className="group relative">
          <summary className={`${actionClass} list-none marker:content-none`}>Share <span className="ml-1 transition group-open:rotate-180" aria-hidden="true">⌄</span></summary>
          <div className="absolute right-0 top-[calc(100%+0.5rem)] z-30 grid min-w-40 gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
            {networks.map((network) => (
              <a key={network.label} href={network.href} target="_blank" rel="noopener noreferrer" className="rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
                {network.label}
              </a>
            ))}
          </div>
        </details>
      </div>
      <p className="sr-only" role="status" aria-live="polite">{message}</p>
      {message && <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-xl dark:bg-amber-400 dark:text-slate-950">{message}</div>}
    </aside>
  );
}
