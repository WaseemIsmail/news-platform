import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticlesByCategory } from "@/lib/firestore";
import { generateSEO } from "@/lib/seo";
import ArticleCard from "@/components/article/ArticleCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatCategoryName(slug = "") {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const categoryName = formatCategoryName(slug);

  return generateSEO({
    title: `${categoryName} News | Contextra`,
    description: `Read the latest ${categoryName.toLowerCase()} articles, analysis, opinions, and public discussions on Contextra.`,
    image: "/images/default-og.jpg",
    url: `https://contextra.vercel.app/category/${slug}`,
  });
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const categoryName = formatCategoryName(slug);

  const articles = await getArticlesByCategory(slug);

  const publishedArticles = (articles || []).filter(
    (article) => article.status === "published"
  );

  return (
    <main className="bg-white">
      {/* Header */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Category
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">
            {categoryName}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Explore the latest articles, analysis, and public discussions under{" "}
            {categoryName.toLowerCase()}.
          </p>

          <div className="mt-6">
            <Link
              href="/"
              className="text-sm font-medium text-slate-700 transition hover:text-slate-900 hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Article List */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          {publishedArticles.length > 0 ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  {publishedArticles.length} Article
                  {publishedArticles.length > 1 ? "s" : ""}
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {publishedArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-20 text-center">
              <h3 className="text-xl font-semibold text-slate-800">
                No Articles Available
              </h3>

              <p className="mt-2 text-slate-600">
                Published articles for {categoryName.toLowerCase()} will appear
                here.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}