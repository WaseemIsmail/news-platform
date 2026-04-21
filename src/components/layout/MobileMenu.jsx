"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function MobileMenu({ isOpen, onClose }) {
  const pathname = usePathname();

  const navigationLinks = [
    { label: "Home", href: "/" },
    { label: "Latest", href: "/latest" },
    { label: "Trending", href: "/trending" },
    { label: "Opinion", href: "/opinion" },
    { label: "Fact Check", href: "/fact-check" },
    { label: "Timeline", href: "/timeline" },
    { label: "Newsletter", href: "/newsletter" },
  ];

  const secondaryLinks = [
    { label: "Bookmarks", href: "/bookmarks" },
    { label: "Profile", href: "/profile" },
    { label: "Notifications", href: "/notifications" },
    { label: "Settings", href: "/settings" },
  ];

  const isActive = (href) => pathname === href;

  /* Close menu when route changes */
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname]);

  /* Prevent body scroll when menu is open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  /* ESC key support */
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 z-[100] flex h-screen w-[85%] max-w-sm flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <Link
            href="/"
            onClick={onClose}
            className="text-2xl font-bold tracking-tight text-slate-900"
          >
            Contextra
          </Link>

          <button
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Main Navigation */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
              Main Navigation
            </p>

            <nav className="space-y-2">
              {navigationLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive(item.href)
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Secondary Links */}
          <div className="mt-10">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Account
            </p>

            <nav className="space-y-2">
              {secondaryLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive(item.href)
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-5">
          <div className="space-y-2 text-sm text-slate-500">
            <Link
              href="/about"
              onClick={onClose}
              className="block transition hover:text-slate-900"
            >
              About
            </Link>

            <Link
              href="/privacy"
              onClick={onClose}
              className="block transition hover:text-slate-900"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              onClick={onClose}
              className="block transition hover:text-slate-900"
            >
              Terms of Service
            </Link>

            <Link
              href="/contact"
              onClick={onClose}
              className="block transition hover:text-slate-900"
            >
              Contact
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}