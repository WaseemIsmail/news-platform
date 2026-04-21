import Link from "next/link";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Contextra | Through Context, Not Just Headlines",
  description:
    "Contextra helps readers understand current events through deeper analysis, historical context, opinion, fact checks, and public discussion.",
  image: "/images/default-og.jpg",
  url: "https://contextra.vercel.app",
});

const articles = [
  {
    id: 1,
    title: "Fuel Price Increase in Sri Lanka",
    slug: "fuel-price-increase-sri-lanka",
    category: "Economy",
    summary:
      "Fuel prices continue to rise, affecting transport and daily life across the country.",
    date: "April 20, 2026",
  },
  {
    id: 2,
    title: "Why Global Wars Affect Economies",
    slug: "global-wars-economy",
    category: "World",
    summary:
      "Conflicts create ripple effects across inflation, oil prices, and global supply chains.",
    date: "April 18, 2026",
  },
  {
    id: 3,
    title: "AI Is Changing Jobs Faster",
    slug: "ai-changing-jobs",
    category: "Technology",
    summary:
      "Automation and AI are reshaping industries faster than many expected.",
    date: "April 15, 2026",
  },
];

const quickLinks = [
  {
    title: "Opinion",
    href: "/opinion",
    description: "Read perspectives, editorials, and deeper commentary.",
  },
  {
    title: "Fact Check",
    href: "/fact-check",
    description: "Verify public claims and separate fact from misinformation.",
  },
  {
    title: "Timeline",
    href: "/timeline",
    description: "Follow major events in a clear chronological format.",
  },
];

export default function HomePage() {
  return (
    <main className="bg-white">
      {/* HERO SECTION */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
            Smart News • Better Understanding
          </p>

          <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
            Through Context, <br /> Not Just Headlines
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Contextra helps you understand current events through
            historical context, deeper analysis, and real public discussion.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/latest"
              className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Explore Articles
            </Link>

            <Link
              href="/trending"
              className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-white"
            >
              Trending Topics
            </Link>
          </div>
        </div>
      </section>

      {/* TOP STORIES */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                Top Stories
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Most Discussed Today
              </h2>
            </div>

            <Link
              href="/latest"
              className="text-sm font-semibold text-slate-900 hover:text-amber-700"
            >
              View All →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <div
                key={article.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                  {article.category}
                </span>

                <h3 className="mt-4 text-xl font-semibold leading-8 text-slate-900">
                  {article.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {article.summary}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    {article.date}
                  </span>

                  <Link
                    href={`/article/${article.slug}`}
                    className="text-sm font-semibold text-slate-900 hover:text-amber-700"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPLORE SECTIONS */}
      <section className="border-t border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              Explore Contextra
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              More Than Just News
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              Go beyond daily headlines with opinion pieces, fact checks,
              and timeline-based storytelling.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>

                <div className="mt-6 text-sm font-semibold text-slate-900">
                  Explore →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CONTEXTRA */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              Why Contextra
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              News That Helps You Think
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Historical Context
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                We connect today’s events with past patterns so you understand
                why things happen, not just what happened.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Real Discussion
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Readers can react, discuss, and share opinions beyond simple
                headlines and short social media posts.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Clear Analysis
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Complex world events are simplified into understandable insights
                for everyday readers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}