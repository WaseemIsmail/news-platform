import Link from "next/link";
import Image from "next/image";
import { generateSEO } from "@/lib/seo";
import { getOpinionArticles } from "@/lib/firestore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  return generateSEO({
    title: "Opinion | Contextra",
    description:
      "Read expert opinions, editorials, and public perspectives on politics, business, technology, and global affairs.",
    image: "/images/default-og.jpg",
    url: "https://contextra.vercel.app/opinion",
  });
}

function formatDate(dateValue) {
  if (!dateValue) return "";

  try {
    if (dateValue?.toDate) {
      return dateValue.toDate().toLocaleDateString();
    }

    return new Date(dateValue).toLocaleDateString();
  } catch {
    return "";
  }
}

export default async function OpinionPage() {
  const articles = await getOpinionArticles();

  const featuredArticle = articles?.[0] || null;
  const otherArticles = articles?.slice(1) || [];

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-4 py-14">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Editorial & Analysis
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Opinion & Editorials
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Explore deep analysis, expert perspectives, and thoughtful
            commentary on the issues shaping our world today.
          </p>
        </div>

        {/* Featured Section */}
        {featuredArticle && (
          <div className="mb-14 grid gap-8 lg:grid-cols-2">
            <Link href={`/article/${featuredArticle.slug}`} className="group">
              <div className="relative h-[320px] overflow-hidden rounded-3xl bg-slate-100">
                <Image
                  src={featuredArticle.image || "/images/default-og.jpg"}
                  alt={featuredArticle.title || "Opinion article image"}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  priority
                />
              </div>
            </Link>

            <div className="flex flex-col justify-center">
              <p className="mb-2 text-sm font-medium text-amber-700">
                Featured Opinion
              </p>

              <Link href={`/article/${featuredArticle.slug}`} className="group">
                <h2 className="text-3xl font-bold leading-tight text-slate-900 group-hover:text-black">
                  {featuredArticle.title || "Untitled Opinion"}
                </h2>
              </Link>

              <p className="mt-4 text-base leading-7 text-slate-600">
                {featuredArticle.summary ||
                  featuredArticle.ourView ||
                  "Read the full editorial analysis and understand the broader perspective behind today’s major headlines."}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                {featuredArticle.author && (
                  <span>By {featuredArticle.author}</span>
                )}

                {formatDate(
                  featuredArticle.publishedAt || featuredArticle.createdAt
                ) && (
                  <span>
                    •{" "}
                    {formatDate(
                      featuredArticle.publishedAt || featuredArticle.createdAt
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Opinion Grid */}
        {otherArticles.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {otherArticles.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="group rounded-3xl border border-slate-200 bg-white p-4 transition hover:shadow-md"
              >
                <div className="relative mb-4 h-52 overflow-hidden rounded-2xl bg-slate-100">
                  <Image
                    src={article.image || "/images/default-og.jpg"}
                    alt={article.title || "Opinion article image"}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-amber-700">
                  Opinion
                </p>

                <h3 className="text-lg font-semibold leading-7 text-slate-900 group-hover:text-black">
                  {article.title || "Untitled Opinion"}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3">
                  {article.summary ||
                    article.ourView ||
                    "Read the full perspective and analysis behind this story."}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  {article.author && <span>By {article.author}</span>}

                  {formatDate(article.publishedAt || article.createdAt) && (
                    <span>
                      • {formatDate(article.publishedAt || article.createdAt)}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {(!articles || articles.length === 0) && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-20 text-center">
            <h3 className="text-xl font-semibold text-slate-800">
              No Opinion Articles Available
            </h3>

            <p className="mt-2 text-slate-600">
              Editorial content will appear here once new opinion articles are
              published.
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-slate-900">
            Want More Insights?
          </h3>

          <p className="mt-3 text-slate-600">
            Explore our latest fact-check reports and timeline analysis.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/fact-check"
              className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Fact Check
            </Link>

            <Link
              href="/timeline"
              className="rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Timelines
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}