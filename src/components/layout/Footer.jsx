import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-block text-2xl font-extrabold tracking-tight text-slate-900"
            >
              Contextra
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-600">
              Understand current events with historical context, deeper
              analysis, and real public discussion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
              Quick Links
            </h3>

            <ul
              className="mt-4 space-y-2 text-sm text-gray-600"
              aria-label="Quick links"
            >
              <li>
                <Link href="/" className="transition hover:text-black">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/trending" className="transition hover:text-black">
                  Trending
                </Link>
              </li>
              <li>
                <Link href="/latest" className="transition hover:text-black">
                  Latest
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-black">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
              Legal
            </h3>

            <ul
              className="mt-4 space-y-2 text-sm text-gray-600"
              aria-label="Legal links"
            >
              <li>
                <Link href="/privacy" className="transition hover:text-black">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition hover:text-black">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-black">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Contextra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}