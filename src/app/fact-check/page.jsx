import Link from "next/link";
import Image from "next/image";
import { generateSEO } from "@/lib/seo";
import { getFactCheckArticles } from "@/lib/firestore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  return generateSEO({
    title: "Fact Check | Contextra",
    description:
      "Verify claims, uncover misinformation, and read trusted fact-check reports on politics, business, technology, and global affairs.",
    image: "/images/default-og.jpg",
    url: "https://contextra.vercel.app/fact-check",
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

function getSafeImage(image) {
  if (!image || typeof image !== "string") {
    return "/images/default-og.jpg";
  }

  const trimmedImage = image.trim();

  if (!trimmedImage) {
    return "/images/default-og.jpg";
  }

  // Valid local image from public folder
  // Example: /images/default-og.jpg
  if (trimmedImage.startsWith("/")) {
    return trimmedImage;
  }

  // Valid remote image URL
  // Example: https://example.com/image.jpg
  if (
    trimmedImage.startsWith("https://") ||
    trimmedImage.startsWith("http://")
  ) {
    return trimmedImage;
  }

  // Invalid image value like: test, abc.jpg, www.example.com/image.jpg
  return "/images/default-og.jpg";
}

export default async function FactCheckPage() {
  let articles = [];

  try {
    articles = await getFactCheckArticles();
  } catch (error) {
    console.error("FactCheckPage load error:", error);
    articles = [];
  }

  const featuredArticle = articles?.[0] || null;
  const otherArticles = articles?.slice(1) || [];

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-4 py-14">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Truth & Verification
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Fact Check Reports
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-600">
            We investigate public claims, statements, viral content, and major
            news developments to help readers separate facts from misinformation.
          </p>
        </div>

        {/* Featured Section */}
        {featuredArticle && (
          <div className="mb-14 grid gap-8 lg:grid-cols-2">
            <Link
              href={`/article/${featuredArticle.slug}`}
              className="group"
            >
              <div className="relative h-[320px] overflow-hidden rounded-3xl bg-slate-100">
                <Image
                  src={getSafeImage(featuredArticle.image)}
                  alt={featuredArticle.title || "Fact check article image"}
                  fill
                  priority
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            </Link>

            <div className="flex flex-col justify-center">
              <p className="mb-2 text-sm font-medium text-amber-700">
                Featured Investigation
              </p>

              <Link
                href={`/article/${featuredArticle.slug}`}
                className="group"
              >
                <h2 className="text-3xl font-bold leading-tight text-slate-900 group-hover:text-black">
                  {featuredArticle.title || "Untitled Fact Check"}
                </h2>
              </Link>

              <p className="mt-4 text-base leading-7 text-slate-600">
                {featuredArticle.summary ||
                  featuredArticle.ourView ||
                  "Explore our full investigation and understand what is verified, misleading, or false."}
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

                {featuredArticle.verdict && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {featuredArticle.verdict}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Grid Section */}
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
                    src={getSafeImage(article.image)}
                    alt={article.title || "Fact check article image"}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
                    Fact Check
                  </p>

                  {article.verdict && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {article.verdict}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold leading-7 text-slate-900 group-hover:text-black">
                  {article.title || "Untitled Fact Check"}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3">
                  {article.summary ||
                    article.ourView ||
                    "Read the full verification report and evidence breakdown."}
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
              No Fact Check Reports Available
            </h3>

            <p className="mt-2 text-slate-600">
              Fact-check investigations will appear here once new reports are
              published.
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-slate-900">
            Continue Exploring
          </h3>

          <p className="mt-3 text-slate-600">
            Read opinion editorials and timeline breakdowns for deeper context.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/opinion"
              className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Opinion
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