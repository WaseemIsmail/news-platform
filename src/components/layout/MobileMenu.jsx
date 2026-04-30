"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "firebase/auth";

import { useAuthContext } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";

export default function MobileMenu({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user, isAdmin, isEditor } = useAuthContext();

  const navigationLinks = [
    { label: "Home", href: "/" },
    { label: "Latest", href: "/latest" },
    { label: "Opinion", href: "/opinion" },
    { label: "Fact Check", href: "/fact-check" },
    { label: "Timeline", href: "/timeline" },
    { label: "Search", href: "/search" },
  ];

  const categoryLinks = [
    { label: "Politics", href: "/category/politics" },
    { label: "Business", href: "/category/business" },
    { label: "Economy", href: "/category/economy" },
    { label: "Technology", href: "/category/technology" },
    { label: "World", href: "/category/world" },
    { label: "Sports", href: "/sports" },
  ];

  const userLinks = [
    { label: "My Profile", href: "/profile" },
    { label: "Saved Articles", href: "/bookmarks" },
    { label: "Notifications", href: "/notifications" },
  ];

  const adminLinks = [
    { label: "Admin Dashboard", href: "/admin" },
    { label: "Manage Articles", href: "/admin/articles" },
    { label: "Manage Polls", href: "/admin/polls" },
    { label: "Manage Timelines", href: "/admin/timeline" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const getDisplayName = () => {
    return (
      user?.displayName ||
      user?.fullName ||
      user?.name ||
      (user?.email ? user.email.split("@")[0] : "Contextra Reader")
    );
  };

  const getUserInitial = () => {
    const name = getDisplayName();
    return name ? name.charAt(0).toUpperCase() : "C";
  };

  const getUserRoleLabel = () => {
    if (isAdmin) return "Administrator";
    if (isEditor) return "Editor";
    return "Reader";
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname]);

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
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* User Info */}
          {user && (
            <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                  {getUserInitial()}
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {getDisplayName()}
                  </p>

                  {user?.email && (
                    <p className="mt-1 break-all text-xs text-slate-500">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>

              <span className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
                {getUserRoleLabel()}
              </span>
            </div>
          )}

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

          {/* Categories */}
          <div className="mt-10">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Categories
            </p>

            <nav className="space-y-2">
              {categoryLinks.map((item) => (
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

              <Link
                href="/tag"
                onClick={onClose}
                className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive("/tag")
                    ? "bg-amber-100 text-amber-800"
                    : "text-amber-700 hover:bg-amber-50"
                }`}
              >
                Browse All Tags →
              </Link>
            </nav>
          </div>

          {/* User Links */}
          {user && (
            <div className="mt-10">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                My Account
              </p>

              <nav className="space-y-2">
                {userLinks.map((item) => (
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
          )}

          {/* Auth Links */}
          {!user && (
            <div className="mt-10">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Account
              </p>

              <nav className="space-y-2">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="block rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  onClick={onClose}
                  className="block rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Sign Up
                </Link>
              </nav>
            </div>
          )}

          {/* Admin / Editor Links */}
          {user && (isAdmin || isEditor) && (
            <div className="mt-10">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Management
              </p>

              <nav className="space-y-2">
                {adminLinks.map((item) => (
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
          )}

          {/* Logout */}
          {user && (
            <div className="mt-10">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-2xl bg-red-50 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-100"
              >
                Logout
              </button>
            </div>
          )}
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