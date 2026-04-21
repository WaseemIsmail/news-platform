import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticlesByCategory } from "@/lib/firestore";
import { generateSEO } from "@/lib/seo";
import formatDate from "@/utils/formatDate";

export async function generateMetadata({ params }) {
  const { slug } = params;

  const categoryName =
    slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");

  return generateSEO({
    title: `${categoryName} News | Contextra`,
    description: `Explore the latest ${categoryName} news, analysis, and stories on Contextra.`,
    image: "/images/default-og.jpg",
    url: `https://contextra.vercel.app/category/${slug}`,
  });
}

export default async function CategoryPage({ params }) {
  const { slug } = params;

  const categoryName =
    slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");

  const articles = await getArticlesByCategory(categoryName);

  if (!articles || articles.length === 0) {
    notFound();
  }

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="mb-6">
            <Link
              href="/category"
              className="text-sm font-medium text-amber-700 hover:underline"
            >
              ← Back to Categories
            </Link>
          </div>

          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
            Category
          </span>

          <h1 className="mt-5 text-4xl font-bold text-slate-900 md:text-5xl">
            {categoryName}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Explore the latest reporting, analysis, and editorial
            coverage in {categoryName}.
          </p>

          <div className="mt-6 text-sm text-slate-500">
            {articles.length} article{articles.length > 1 ? "s" : ""}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {article.category || categoryName}
                  </span>

                  <span className="text-sm text-slate-400">
                    {article.createdAt
                      ? formatDate(article.createdAt)
                      : "Recently"}
                  </span>
                </div>

                <h2 className="mt-5 text-xl font-bold leading-8 text-slate-900">
                  {article.title}
                </h2>

                {(article.summary || article.ourView) && (
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {article.summary || article.ourView}
                  </p>
                )}

                <div className="mt-6 flex items-center justify-between">
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
            ))}
          </div>

          {/* Continue Exploring */}
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
                href="/trending"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
              >
                Trending Topics
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