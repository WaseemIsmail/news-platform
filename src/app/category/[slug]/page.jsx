import Link from "next/link";
import { fetchAllArticles } from "@/services/articleService";
import ArticleCard from "@/components/article/ArticleCard";
import { generateSEO } from "@/lib/seo";
import { notFound } from "next/navigation";

function formatCategoryName(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const categoryName = formatCategoryName(slug);

  return generateSEO({
    title: `${categoryName} News | Contextra`,
    description: `Explore ${categoryName.toLowerCase()} news, analysis, and discussion on Contextra.`,
    url: `https://your-domain.com/category/${slug}`,
  });
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const categoryName = formatCategoryName(slug);

  const articles = await fetchAllArticles();

  const filteredArticles = articles.filter(
    (article) =>
      article.category &&
      article.category.toLowerCase().replace(/\s+/g, "-") === slug
  );

  if (!filteredArticles.length) {
    notFound();
  }

  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Category
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">
            {categoryName}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Explore the latest stories, analysis, and public discussion in {categoryName.toLowerCase()}.
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

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              {filteredArticles.length} Article{filteredArticles.length > 1 ? "s" : ""}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}