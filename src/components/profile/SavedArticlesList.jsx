import Link from "next/link";
import Image from "next/image";

export default function SavedArticlesList({ articles = [] }) {
  const formatDate = (value) => {
    if (!value) return "";

    if (typeof value?.toDate === "function") {
      return value.toDate().toLocaleDateString();
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString();
  };

  if (!articles || articles.length === 0) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Saved Articles
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Your Bookmarks
          </h2>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
          <p className="text-sm text-slate-600">
            You have not saved any articles yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Saved Articles
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Your Bookmarks
          </h2>
        </div>

        <Link
          href="/bookmarks"
          className="text-sm font-medium text-slate-700 transition hover:text-amber-700"
        >
          View all
        </Link>
      </div>

      <div className="space-y-5">
        {articles.map((article, index) => (
          <Link
            key={article.id || article.slug || index}
            href={`/article/${article.slug}`}
            className="group block rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50"
          >
            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Image */}
              <div className="relative h-28 w-full overflow-hidden rounded-2xl sm:w-44 sm:min-w-[176px]">
                <Image
                  src={article.image || "/images/default-og.jpg"}
                  alt={article.title || "Saved article"}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                {article.category && (
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-700">
                    {article.category}
                  </p>
                )}

                <h3 className="text-lg font-semibold leading-7 text-slate-900 transition group-hover:text-amber-700">
                  {article.title || "Untitled Article"}
                </h3>

                {article.summary && (
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                    {article.summary}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  {article.author && (
                    <span>By {article.author}</span>
                  )}

                  {formatDate(article.publishedAt) && (
                    <span>
                      • {formatDate(article.publishedAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}