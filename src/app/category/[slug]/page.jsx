import Link from "next/link";
import { getArticlesByCategory } from "@/lib/firestore";
import { generateSEO } from "@/lib/seo";
import formatDate from "@/utils/formatDate";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatCategoryName(slug = "") {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function isPublishedArticle(article) {
  return article?.status?.toString().trim().toLowerCase() === "published";
}

function getArticleDate(article) {
  if (article?.publishedAt?.toDate) {
    return article.publishedAt.toDate();
  }

  if (article?.createdAt?.toDate) {
    return article.createdAt.toDate();
  }

  if (article?.updatedAt?.toDate) {
    return article.updatedAt.toDate();
  }

  if (article?.publishedAt?.seconds) {
    return new Date(article.publishedAt.seconds * 1000);
  }

  if (article?.createdAt?.seconds) {
    return new Date(article.createdAt.seconds * 1000);
  }

  if (article?.updatedAt?.seconds) {
    return new Date(article.updatedAt.seconds * 1000);
  }

  if (article?.publishedAt) {
    const date = new Date(article.publishedAt);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (article?.createdAt) {
    const date = new Date(article.createdAt);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (article?.updatedAt) {
    const date = new Date(article.updatedAt);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

function getArticleDateValue(article) {
  const date = getArticleDate(article);

  if (!date || Number.isNaN(date.getTime())) {
    return 0;
  }

  return date.getTime();
}

function getDisplayDate(article) {
  return article?.publishedAt || article?.createdAt || article?.updatedAt || null;
}

function getValidPublishedArticles(articles = []) {
  return articles
    .filter((article) => {
      const hasTitle = article?.title?.toString().trim() !== "";
      const hasSlug = article?.slug?.toString().trim() !== "";
      const isPublished = isPublishedArticle(article);

      return hasTitle && hasSlug && isPublished;
    })
    .sort((a, b) => getArticleDateValue(b) - getArticleDateValue(a));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || "";

  const categoryName = formatCategoryName(slug);

  return generateSEO({
    title: `${categoryName || "Category"} News | Contextra`,
    description: `Explore the latest ${
      categoryName || "category"
    } news, analysis, and stories on Contextra.`,
    image: "/images/default-og.jpg",
    url: `https://contextra.vercel.app/category/${slug}`,
  });
}

export default async function CategoryPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || "";

  const categoryName = formatCategoryName(slug);

  const articles = await getArticlesByCategory(slug);
  const validArticles = getValidPublishedArticles(articles);

  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="mb-6">
            <Link
              href="/"
              className="text-sm font-medium text-amber-700 hover:underline"
            >
              ← Back to Home
            </Link>
          </div>

          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
            Category
          </span>

          <h1 className="mt-5 text-4xl font-bold text-slate-900 md:text-5xl">
            {categoryName}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Explore the latest reporting, analysis, and editorial coverage in{" "}
            {categoryName}.
          </p>

          <div className="mt-6 text-sm text-slate-500">
            {validArticles.length} published article
            {validArticles.length !== 1 ? "s" : ""}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-6xl px-6">
          {validArticles.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">
                No published articles found
              </h2>

              <p className="mt-3 text-slate-600">
                Published articles for this category will appear here.
              </p>

              <Link
                href="/latest"
                className="mt-6 inline-flex rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                View Latest Articles
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {validArticles.map((article) => {
                const displayDate = getDisplayDate(article);

                return (
                  <article
                    key={article.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {article.category || slug}
                      </span>

                      <span className="text-sm text-slate-400">
                        {displayDate ? formatDate(displayDate) : "Recently"}
                      </span>
                    </div>

                    <h2 className="mt-5 text-xl font-bold leading-8 text-slate-900">
                      {article.title}
                    </h2>

                    {(article.summary || article.ourView) && (
                      <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-600">
                        {article.summary || article.ourView}
                      </p>
                    )}

                    <div className="mt-6 flex items-center justify-between gap-4">
                      <span className="text-sm text-slate-500">
                        {article.author || "Contextra Editorial"}
                      </span>

                      <Link
                        href={`/article/${article.slug}`}
                        className="text-sm font-semibold text-slate-900 hover:text-amber-700"
                      >
                        Read More →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <section className="mt-16 border-t border-slate-200 pt-8">
            <h2 className="text-xl font-semibold text-slate-900">
              Continue Exploring
            </h2>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/latest"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
              >
                Latest Articles
              </Link>

              <Link
                href="/opinion"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
              >
                Opinion
              </Link>

              <Link
                href="/timeline"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
              >
                Explore Timelines
              </Link>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}