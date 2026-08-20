"use client";

import { signOut } from "firebase/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAppContext } from "@/context/AppContext";
import { useAuthContext } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import BrandMark from "./BrandMark";

const primaryLinks = [
  { label: "Home", href: "/" },
  { label: "Latest", href: "/latest" },
  { label: "Popular", href: "/trending" },
  { label: "Opinion", href: "/opinion" },
  { label: "Fact Check", href: "/fact-check" },
  { label: "Timelines", href: "/timeline" },
];

const topicLinks = ["Politics", "Business", "Economy", "Technology", "World", "Sports", "Education"];

export default function MobileMenu({ isOpen, onClose }) {
  const pathname = usePathname();
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const { user, isAdmin, isEditor } = useAuthContext();
  const { theme, toggleTheme } = useAppContext();
  const displayName = user?.displayName || user?.fullName || user?.name || user?.email?.split("@")[0] || "Contextra Reader";

  const isActive = (href) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const previouslyFocused = document.activeElement;
    closeButtonRef.current?.focus();

    const handleKeyboard = (event) => {
      if (event.key === "Escape") return onClose();
      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusable = drawerRef.current.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyboard);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <button type="button" onClick={onClose} className="fixed inset-0 z-[90] cursor-default bg-slate-950/65 backdrop-blur-sm" aria-label="Close site menu overlay" tabIndex={-1} />
      <aside id="mobile-navigation" ref={drawerRef} role="dialog" aria-modal="true" aria-label="Site navigation" className="fixed right-0 top-0 z-[100] flex h-dvh w-full flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 sm:w-[min(92%,26rem)]">
        <header className="mobile-navigation-header flex min-h-[4.25rem] items-center justify-between border-b border-slate-200 px-4 pb-3 pt-3 dark:border-slate-800 sm:px-5 sm:pb-4 sm:pt-4">
          <Link href="/" onClick={onClose} className="flex items-center gap-3"><BrandMark className="h-9 w-9 rounded-xl" /><span><strong className="block text-lg leading-none tracking-tight">Contextra</strong><span className="mt-1 block text-[0.58rem] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">News with context</span></span></Link>
          <button ref={closeButtonRef} type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Close site menu"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-5">
          <Link href="/search" onClick={onClose} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-700 transition hover:border-amber-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"><svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>Search stories, topics, and tags</Link>

          <section className="mt-7" aria-labelledby="mobile-primary-title"><div className="mb-3 flex items-center justify-between"><h2 id="mobile-primary-title" className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">Explore</h2><Link href="/category" onClick={onClose} className="text-xs font-bold text-slate-500 dark:text-slate-400">All topics →</Link></div><nav className="grid grid-cols-2 gap-2" aria-label="Primary mobile navigation">{primaryLinks.map((item) => <Link key={item.href} href={item.href} onClick={onClose} aria-current={isActive(item.href) ? "page" : undefined} className={`rounded-xl px-4 py-3 text-sm font-bold transition ${isActive(item.href) ? "bg-slate-950 text-white dark:bg-amber-400 dark:text-slate-950" : "bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"}`}>{item.label}</Link>)}</nav></section>

          <section className="mt-7" aria-labelledby="mobile-topics-title"><h2 id="mobile-topics-title" className="mb-3 text-[0.68rem] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Topics</h2><div className="flex flex-wrap gap-2">{topicLinks.map((topic) => { const href = `/category/${topic.toLowerCase()}`; return <Link key={topic} href={href} onClick={onClose} className={`rounded-full border px-3 py-2 text-xs font-bold transition ${isActive(href) ? "border-amber-400 bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-300" : "border-slate-200 text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:text-slate-300"}`}>{topic}</Link>; })}</div></section>

          <section className="mt-7 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900" aria-labelledby="mobile-account-title">
            <div className="flex items-center justify-between gap-4"><div><h2 id="mobile-account-title" className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Reader account</h2>{user && <p className="mt-2 truncate text-sm font-black text-slate-950 dark:text-white">{displayName}</p>}</div><button type="button" onClick={toggleTheme} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300" aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>{theme === "dark" ? "Light mode" : "Dark mode"}</button></div>
            {user ? <><nav className="mt-4 grid grid-cols-2 gap-2" aria-label="Reader account"><Link href="/profile" onClick={onClose} className="rounded-xl bg-white px-3 py-2.5 text-xs font-bold dark:bg-slate-950">Profile</Link><Link href="/bookmarks" onClick={onClose} className="rounded-xl bg-white px-3 py-2.5 text-xs font-bold dark:bg-slate-950">Saved stories</Link><Link href="/notifications" onClick={onClose} className="rounded-xl bg-white px-3 py-2.5 text-xs font-bold dark:bg-slate-950">Notifications</Link><Link href="/settings" onClick={onClose} className="rounded-xl bg-white px-3 py-2.5 text-xs font-bold dark:bg-slate-950">Settings</Link></nav>{(isAdmin || isEditor) && <Link href="/admin" onClick={onClose} className="mt-3 block rounded-xl border border-slate-300 px-3 py-2.5 text-center text-xs font-bold dark:border-slate-700">Open admin dashboard</Link>}<button type="button" onClick={handleLogout} className="mt-3 text-xs font-bold text-red-600 dark:text-red-400">Sign out</button></> : <div className="mt-4 grid grid-cols-2 gap-2"><Link href="/login" onClick={onClose} className="rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-bold dark:border-slate-700">Sign in</Link><Link href="/signup" onClick={onClose} className="rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white dark:bg-amber-400 dark:text-slate-950">Create account</Link></div>}
          </section>
        </div>

        <footer className="flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-200 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:px-5"><Link href="/about" onClick={onClose}>About</Link><Link href="/contact" onClick={onClose}>Contact</Link><Link href="/privacy" onClick={onClose}>Privacy</Link><Link href="/terms" onClick={onClose}>Terms</Link></footer>
      </aside>
    </>
  );
}
