"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";

import MobileMenu from "./MobileMenu";
import { useAuthContext } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";

export default function Navbar() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const dropdownRef = useRef(null);

  const { user, isAdmin, isEditor } = useAuthContext();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Latest", href: "/latest" },
    { label: "Trending", href: "/trending" },
    { label: "Opinion", href: "/opinion" },
    { label: "Fact Check", href: "/fact-check" },
    { label: "Timeline", href: "/timeline" },
  ];

  const isActive = (href) => pathname === href;

  const getDisplayName = () => {
    return (
      user?.displayName ||
      user?.fullName ||
      (user?.email ? user.email.split("@")[0] : "Contextra Reader")
    );
  };

  const getUserInitial = () => {
    const name = getDisplayName();

    if (name) {
      return name.charAt(0).toUpperCase();
    }

    return "C";
  };

  const getUserRoleLabel = () => {
    if (isAdmin) return "Administrator";
    if (isEditor) return "Editor";
    return "Reader";
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          {/* Brand */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              Contextra
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition ${
                  isActive(item.href)
                    ? "text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className="hidden text-sm font-medium text-slate-600 transition hover:text-slate-900 md:block"
            >
              Search
            </Link>

            {!user ? (
              <>
                <Link
                  href="/login"
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="hidden rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 sm:block"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                {/* Profile Button */}
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1 pr-3 transition hover:bg-slate-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    {getUserInitial()}
                  </div>

                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-semibold text-slate-900">
                      {getDisplayName()}
                    </p>

                    <p className="text-xs text-slate-500">
                      {getUserRoleLabel()}
                    </p>
                  </div>
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                    {/* User Info */}
                    <div className="border-b border-slate-100 pb-4">
                      <p className="text-sm font-semibold text-slate-900">
                        {getDisplayName()}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {user?.email}
                      </p>

                      <div className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {getUserRoleLabel()}
                      </div>
                    </div>

                    {/* Common Links */}
                    <div className="mt-4 space-y-2">
                      <Link
                        href="/profile"
                        className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                      >
                        My Profile
                      </Link>

                      <Link
                        href="/bookmarks"
                        className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                      >
                        Saved Articles
                      </Link>

                      <Link
                        href="/notifications"
                        className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                      >
                        Notifications
                      </Link>

                      <Link
                        href="/settings"
                        className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                      >
                        Settings
                      </Link>
                    </div>

                    {/* Admin Only */}
                    {(isAdmin || isEditor) && (
                      <div className="mt-4 border-t border-slate-100 pt-4">
                        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Management
                        </p>

                        <Link
                          href="/admin"
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
                        >
                          Admin Dashboard
                        </Link>
                      </div>
                    )}

                    {/* Logout */}
                    <div className="mt-4 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 md:hidden"
              aria-label="Open mobile menu"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}