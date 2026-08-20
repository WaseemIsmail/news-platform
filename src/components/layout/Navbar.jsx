"use client";

import { signOut } from "firebase/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useAuthContext } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import MobileMenu from "./MobileMenu";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Latest", href: "/latest" },
  { label: "Opinion", href: "/opinion" },
  { label: "Fact Check", href: "/fact-check" },
  { label: "Timelines", href: "/timeline" },
];

const categoryLinks = [
  { label: "Politics", href: "/category/politics" },
  { label: "Business", href: "/category/business" },
  { label: "Economy", href: "/category/economy" },
  { label: "Technology", href: "/category/technology" },
  { label: "World", href: "/category/world" },
  { label: "Sports", href: "/category/sports" },
  { label: "Education", href: "/category/education" },
];

const readerLinks = [
  { label: "Profile overview", href: "/profile" },
  { label: "Saved stories", href: "/bookmarks" },
  { label: "Notifications", href: "/notifications" },
  { label: "Profile & security", href: "/settings" },
];

function Brand() {
  return (
    <Link href="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3" aria-label="Contextra home">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white shadow-sm transition group-hover:bg-amber-500 group-hover:text-slate-950 dark:bg-amber-400 dark:text-slate-950 dark:group-hover:bg-amber-300 sm:h-10 sm:w-10 sm:text-base" aria-hidden="true">C</span>
      <span>
        <span className="block text-lg font-black leading-none tracking-[-0.035em] text-slate-950 dark:text-white sm:text-xl">Contextra</span>
        <span className="mt-1 hidden text-[0.62rem] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 sm:block">News with context</span>
      </span>
    </Link>
  );
}

function ThemeButton({ theme, onToggle }) {
  const dark = theme === "dark";
  return (
    <button type="button" onClick={onToggle} className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-amber-400 dark:hover:bg-amber-400/10 dark:hover:text-amber-300 sm:h-10 sm:w-10" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} aria-pressed={dark} title={dark ? "Switch to light mode" : "Switch to dark mode"}>
      {dark ? <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" /></svg> : <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" /></svg>}
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAdmin, isEditor } = useAuthContext();
  const { theme, toggleTheme } = useAppContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const profileRef = useRef(null);
  const categoriesRef = useRef(null);

  const isActive = (href) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  const categoryActive = pathname.startsWith("/category") || pathname.startsWith("/tag");
  const displayName = user?.displayName || user?.fullName || user?.name || user?.email?.split("@")[0] || "Contextra Reader";
  const roleLabel = isAdmin ? "Administrator" : isEditor ? "Editor" : "Reader";

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) setCategoriesOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setCategoriesOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setProfileOpen(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <header className="site-navbar sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 shadow-[0_1px_0_rgba(15,23,42,0.02)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-3 px-3 sm:h-[4.75rem] sm:gap-5 sm:px-6">
          <Brand />

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary navigation">
            {navLinks.map((item) => {
              const active = isActive(item.href);
              return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`rounded-xl px-3.5 py-2.5 text-sm font-bold transition ${active ? "bg-slate-950 text-white dark:bg-amber-400 dark:text-slate-950" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"}`}>{item.label}</Link>;
            })}

            <div ref={categoriesRef} className="relative">
              <button type="button" onClick={() => { setCategoriesOpen((current) => !current); setProfileOpen(false); }} aria-expanded={categoriesOpen} aria-haspopup="true" aria-controls="category-navigation" className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-bold transition ${categoryActive ? "bg-slate-950 text-white dark:bg-amber-400 dark:text-slate-950" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"}`}>Topics <svg viewBox="0 0 20 20" className={`h-4 w-4 transition-transform ${categoriesOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m5 7.5 5 5 5-5" /></svg></button>

              {categoriesOpen && <div id="category-navigation" className="absolute left-1/2 top-[calc(100%+0.8rem)] w-[27rem] -translate-x-1/2 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30">
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-950"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">Explore topics</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Follow the subjects shaping the news.</p></div><Link href="/category" onClick={() => setCategoriesOpen(false)} className="text-xs font-black text-slate-950 hover:text-amber-700 dark:text-white dark:hover:text-amber-400">All topics →</Link></div>
                <div className="grid grid-cols-2 gap-1 p-3">{categoryLinks.map((item) => <Link key={item.href} href={item.href} onClick={() => setCategoriesOpen(false)} className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${isActive(item.href) ? "bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-300" : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"}`}><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300" aria-hidden="true">{item.label.charAt(0)}</span>{item.label}</Link>)}</div>
                <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-700"><Link href="/tag" onClick={() => setCategoriesOpen(false)} className="text-xs font-bold text-slate-500 hover:text-amber-700 dark:text-slate-400 dark:hover:text-amber-400">Browse the complete tag index →</Link></div>
              </div>}
            </div>
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Link href="/search" aria-current={isActive("/search") ? "page" : undefined} className={`hidden h-10 items-center gap-2 rounded-xl border px-3 text-sm font-bold transition xl:flex ${isActive("/search") ? "border-amber-400 bg-amber-50 text-amber-900 dark:bg-amber-400/10 dark:text-amber-300" : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"}`}><svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>Search</Link>
            <ThemeButton theme={theme} onToggle={toggleTheme} />

            {!user ? <>
              <Link href="/login" className="hidden rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 sm:inline-flex">Sign in</Link>
              <Link href="/signup" className="hidden rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-amber-500 hover:text-slate-950 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300 lg:inline-flex">Join</Link>
            </> : <div ref={profileRef} className="relative">
              <button type="button" onClick={() => { setProfileOpen((current) => !current); setCategoriesOpen(false); }} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-2.5 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800" aria-label="Open reader account menu" aria-expanded={profileOpen} aria-haspopup="true" aria-controls="profile-navigation"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white dark:bg-amber-400 dark:text-slate-950">{displayName.charAt(0).toUpperCase()}</span><span className="hidden max-w-28 truncate text-sm font-bold text-slate-800 dark:text-slate-100 md:block">{displayName}</span><svg viewBox="0 0 20 20" className={`hidden h-4 w-4 text-slate-400 transition-transform md:block ${profileOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m5 7.5 5 5 5-5" /></svg></button>

              {profileOpen && <div id="profile-navigation" className="absolute right-0 top-[calc(100%+0.8rem)] w-72 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30"><div className="bg-slate-950 px-5 py-4 text-white"><p className="truncate text-sm font-black">{displayName}</p><p className="mt-1 truncate text-xs text-slate-400">{user.email}</p><span className="mt-3 inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-slate-200">{roleLabel}</span></div><nav className="p-3" aria-label="Reader account">{readerLinks.map((item) => <Link key={item.href} href={item.href} onClick={() => setProfileOpen(false)} className={`block rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive(item.href) ? "bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-300" : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"}`}>{item.label}</Link>)}</nav>{(isAdmin || isEditor) && <div className="border-t border-slate-200 p-3 dark:border-slate-700"><p className="mb-2 px-3 text-[0.65rem] font-black uppercase tracking-[0.16em] text-slate-400">Management</p><Link href="/admin" onClick={() => setProfileOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800">Admin dashboard</Link><Link href="/admin/articles" onClick={() => setProfileOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Manage articles</Link></div>}<div className="border-t border-slate-200 p-3 dark:border-slate-700"><button type="button" onClick={handleLogout} className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-bold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30">Sign out</button></div></div>}
            </div>}

            <button type="button" onClick={() => setMobileOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 sm:h-10 sm:w-10 xl:hidden" aria-label="Open site menu" aria-expanded={mobileOpen} aria-controls="mobile-navigation"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg></button>
          </div>
        </div>
      </header>
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
