import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            Contextra
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Home
          </Link>

          <Link
            href="/trending"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Trending
          </Link>

          <Link
            href="/latest"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Latest
          </Link>

          <Link
            href="/category"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Categories
          </Link>

          <Link
            href="/about"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            About
          </Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <Link
            href="/search"
            className="hidden text-sm font-medium text-slate-600 transition hover:text-slate-900 md:block"
          >
            Search
          </Link>

          <Link
            href="/login"
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}