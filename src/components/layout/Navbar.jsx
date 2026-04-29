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
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const profileDropdownRef = useRef(null);
  const categoriesDropdownRef = useRef(null);

  const { user, isAdmin, isEditor } = useAuthContext();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Latest", href: "/latest" },
    { label: "Opinion", href: "/opinion" },
    { label: "Fact Check", href: "/fact-check" },
    { label: "Timeline", href: "/timeline" },
  ];

  const categoryLinks = [
    { label: "Politics", href: "/category/politics" },
    { label: "Business", href: "/category/business" },
    { label: "Economy", href: "/category/economy" },
    { label: "Technology", href: "/category/technology" },
    { label: "World", href: "/category/world" },
    { label: "Sports", href: "/sports" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isCategoryActive = () => {
    return (
      pathname.startsWith("/category") ||
      pathname.startsWith("/sports")
    );
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

  const closeProfileDropdown = () => {
    setProfileOpen(false);
  };

  const closeCategoriesDropdown = () => {
    setCategoriesOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setProfileOpen(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      if (
        categoriesDropdownRef.current &&
        !categoriesDropdownRef.current.contains(event.target)
      ) {
        setCategoriesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
    setCategoriesOpen(false);
  }, [pathname]);

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
          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-sm font-medium transition ${
                  isActive(item.href)
                    ? "text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {item.label}

                {isActive(item.href) && (
                  <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-amber-600" />
                )}
              </Link>
            ))}

            {/* Categories Dropdown */}
            <div className="relative" ref={categoriesDropdownRef}>
              <button
                type="button"
                onClick={() => setCategoriesOpen((prev) => !prev)}
                className={`relative flex items-center gap-1 text-sm font-medium transition ${
                  isCategoryActive()
                    ? "text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Categories
                <span className="text-xs">
                  {categoriesOpen ? "▲" : "▼"}
                </span>

                {isCategoryActive() && (
                  <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-amber-600" />
                )}
              </button>

              {categoriesOpen && (
                <div className="absolute left-0 top-8 w-56 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Browse Categories
                  </p>

                  <div className="space-y-1">
                    {categoryLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeCategoriesDropdown}
                        className={`block rounded-lg px-3 py-2 text-sm transition ${
                          isActive(item.href)
                            ? "bg-slate-100 font-medium text-slate-900"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-3 border-t border-slate-100 pt-3">
                    <Link
                      href="/tag"
                      onClick={closeCategoriesDropdown}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-50"
                    >
                      Browse All Tags →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className={`hidden rounded-lg px-3 py-2 text-sm font-medium transition md:block ${
                isActive("/search")
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
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
              <div className="relative" ref={profileDropdownRef}>
                {/* Profile Button */}
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1 pr-3 transition hover:bg-slate-50"
                  aria-label="Open profile menu"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    {getUserInitial()}
                  </div>

                  <div className="hidden text-left sm:block">
                    <p className="max-w-[140px] truncate text-sm font-semibold text-slate-900">
                      {getDisplayName()}
                    </p>

                    <p className="text-xs text-slate-500">
                      {getUserRoleLabel()}
                    </p>
                  </div>

                  <span className="hidden text-xs text-slate-400 sm:inline">
                    {profileOpen ? "▲" : "▼"}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                    {/* User Info */}
                    <div className="border-b border-slate-100 pb-4">
                      <p className="text-sm font-semibold text-slate-900">
                        {getDisplayName()}
                      </p>

                      {user?.email && (
                        <p className="mt-1 break-all text-xs text-slate-500">
                          {user.email}
                        </p>
                      )}

                      <div className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {getUserRoleLabel()}
                      </div>
                    </div>

                    {/* Reader Links */}
                    <div className="mt-4 space-y-2">
                      <Link
                        href="/latest"
                        onClick={closeProfileDropdown}
                        className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                      >
                        Latest Articles
                      </Link>

                      <Link
                        href="/tag"
                        onClick={closeProfileDropdown}
                        className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                      >
                        Browse Tags
                      </Link>

                      <Link
                        href="/timeline"
                        onClick={closeProfileDropdown}
                        className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                      >
                        Timelines
                      </Link>
                    </div>

                    {/* Admin / Editor Only */}
                    {(isAdmin || isEditor) && (
                      <div className="mt-4 border-t border-slate-100 pt-4">
                        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Management
                        </p>

                        <Link
                          href="/admin"
                          onClick={closeProfileDropdown}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
                        >
                          Admin Dashboard
                        </Link>

                        <Link
                          href="/admin/articles"
                          onClick={closeProfileDropdown}
                          className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                        >
                          Manage Articles
                        </Link>

                        <Link
                          href="/admin/polls"
                          onClick={closeProfileDropdown}
                          className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                        >
                          Manage Polls
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
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-xl md:hidden"
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