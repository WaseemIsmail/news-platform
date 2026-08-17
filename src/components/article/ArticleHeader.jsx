import Link from "next/link";

export default function ArticleHeader({ article }) {
  return (
    <header>
      <Link href={`/category/${article.category || "general"}`} className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-amber-900 transition hover:bg-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:hover:bg-amber-500/25">
        {article.category || "General"}
      </Link>

      <h1 className="mt-5 max-w-5xl text-4xl font-black leading-[1.08] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
        {article.title}
      </h1>

      {(article.summary || article.ourView) && (
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9 dark:text-slate-300">
          {article.summary || article.ourView}
        </p>
      )}
    </header>
  );
}
