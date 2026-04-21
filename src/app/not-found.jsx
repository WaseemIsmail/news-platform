import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-white px-6">
      <div className="max-w-2xl text-center">
        {/* Error Code */}
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
          404 Error
        </p>

        {/* Title */}
        <h1 className="mt-4 text-4xl font-bold text-slate-900 md:text-6xl">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="mt-6 text-lg leading-8 text-gray-600">
          The page you are looking for may have been removed,
          renamed, or is temporarily unavailable.
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Back to Home
          </Link>

          <Link
            href="/latest"
            className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-gray-50"
          >
            Explore Articles
          </Link>
        </div>
      </div>
    </main>
  );
}