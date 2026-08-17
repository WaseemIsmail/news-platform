import Link from "next/link";
import ArticleCard from "@/components/article/ArticleCard";
import FeaturedArticleCard from "@/components/article/FeaturedArticleCard";
import { getHomepageArticles } from "@/lib/firestore";
import { generateSEO } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = generateSEO({
  title: "Contextra | News with context",
  description:
    "Understand current events through sourced reporting, historical context, clear analysis, opinion, fact checks, and timelines.",
  image: "/opengraph-image",
  url: "/",
});

const quickLinks = [
  {
    eyebrow: "Perspectives",
    title: "Opinion",
    href: "/opinion",
    description: "Arguments and commentary that make their point of view clear.",
  },
  {
    eyebrow: "Verification",
    title: "Fact Check",
    href: "/fact-check",
    description: "Evidence-led checks on public claims and misleading narratives.",
  },
  {
    eyebrow: "Follow the story",
    title: "Timelines",
    href: "/timeline",
    description: "Major events placed in order so the full story is easier to follow.",
  },
];

const trustPoints = [
  {
    number: "01",
    title: "Sources you can inspect",
    description: "Source links stay attached to the story so you can check the reporting yourself.",
  },
  {
    number: "02",
    title: "Analysis clearly labelled",
    description: "Reporting, context, and editorial interpretation are separated instead of blended together.",
  },
  {
    number: "03",
    title: "More than the moment",
    description: "Timelines and background explain how today’s headline connects to what came before.",
  },
];

export default async function HomePage() {
  const articles = await getHomepageArticles();
  const [leadArticle, ...secondaryArticles] = articles;

  return (
    <main className="bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="border-b border-slate-200 bg-slate-950 text-white dark:border-slate-800">
        <div className="mx-auto grid max-w-7xl gap-7 px-4 py-9 sm:px-6 sm:py-12 md:py-16 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-400">
              News with context
            </p>
            <h1 className="mt-4 max-w-4xl text-[2.4rem] font-black leading-[1.04] tracking-[-0.04em] min-[420px]:text-5xl lg:text-7xl">
              Understand the story, not just the headline.
            </h1>
          </div>

          <div className="lg:pb-2">
            <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Sourced reporting, useful background, and clearly labelled analysis—built for readers who want to know why a story matters.
            </p>
            <div className="mt-6 grid gap-3 min-[420px]:flex min-[420px]:flex-wrap">
              <Link href="/latest" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300">
                Read latest
              </Link>
              <Link href="/about" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-700 px-5 py-3 text-sm font-bold text-white transition hover:border-slate-500 hover:bg-slate-900">
                How Contextra works
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-400">
                Editor’s selection
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">
                Start with these stories
              </h2>
            </div>
            <Link href="/latest" className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 transition hover:text-amber-700 dark:text-slate-200 dark:hover:text-amber-400">
              View all reporting <span aria-hidden="true">→</span>
            </Link>
          </div>

          {leadArticle ? (
            <div className="space-y-6">
              <FeaturedArticleCard article={leadArticle} />

              {secondaryArticles.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2">
                  {secondaryArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} compact />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-xl font-bold">The daily selection is being prepared</h3>
              <p className="mx-auto mt-2 max-w-lg text-slate-600 dark:text-slate-300">
                Visit Latest for all published reporting while editors prepare the homepage selection.
              </p>
              <Link href="/latest" className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white dark:bg-amber-500 dark:text-slate-950">
                Browse latest
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-10 dark:border-slate-800 dark:bg-slate-900/50 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-4 md:grid-cols-3 md:gap-5">
            {quickLinks.map((item) => (
              <Link key={item.href} href={item.href} className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-amber-500/50 sm:rounded-3xl sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">{item.eyebrow}</p>
                <div className="mt-3 flex items-start justify-between gap-4">
                  <h2 className="text-2xl font-black tracking-tight">{item.title}</h2>
                  <span aria-hidden="true" className="text-xl transition-transform group-hover:translate-x-1">→</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-400">The Contextra standard</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-4xl">Designed for informed reading</h2>
              <p className="mt-5 max-w-lg leading-7 text-slate-600 dark:text-slate-300">
                A calmer news experience with enough evidence to verify a story and enough context to understand it.
              </p>
            </div>

            <div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {trustPoints.map((point) => (
                <div key={point.number} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 gap-y-2 py-5 sm:grid-cols-[3rem_0.7fr_1fr] sm:items-start sm:py-6">
                  <span className="text-sm font-black text-amber-700 dark:text-amber-400">{point.number}</span>
                  <h3 className="font-bold text-slate-950 dark:text-white">{point.title}</h3>
                  <p className="col-start-2 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:col-start-auto">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
