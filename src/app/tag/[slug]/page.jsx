import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchAllArticles } from "@/services/articleService";
import ArticleCard from "@/components/article/ArticleCard";
import { generateSEO } from "@/lib/seo";

function formatTagName(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function normalizeText(text = "") {
  return text.toLowerCase().replace(/\s+/g, "-").trim();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tagName = formatTagName(slug);

  return generateSEO({
    title: `${tagName} Articles | Contextra`,
    description: `Explore articles, insights, and discussions related to ${tagName.toLowerCase()} on Contextra.`,
    url: `https://your-domain.com/tag/${slug}`,
  });
}

export default async function TagPage({ params }) {
  const { slug } = await params;
  const tagName = formatTagName(slug);

  const articles = await fetchAllArticles();

  const filteredArticles = articles.filter((article) => {
    if (!article.tags || !Array.isArray(article.tags)) return false;

    return article.tags.some(
      (tag) => normalizeText(tag) === slug
    );
  });

  if (!filteredArticles.length) {
    notFound();
  }

  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Tag
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">
            #{tagName}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Explore all articles and discussions connected to {tagName.toLowerCase()}.
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
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              {filteredArticles.length} Article
              {filteredArticles.length > 1 ? "s" : ""}
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