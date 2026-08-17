import Image from "next/image";
import Link from "next/link";
import {
  formatArticleDate,
  getArticleDate,
  getArticleExcerpt,
  getArticleImage,
  getReadingTime,
  toDate,
} from "@/lib/articlePresentation";

export default function FeaturedArticleCard({ article }) {
  const image = getArticleImage(article);
  const publishedDate = toDate(getArticleDate(article));

  return (
    <article className="group grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:rounded-[2rem] lg:grid-cols-[1.25fr_1fr]">
      <Link href={`/article/${article.slug}`} className="relative min-h-52 overflow-hidden bg-slate-900 sm:min-h-72 lg:min-h-[440px]" aria-label={`Read ${article.title}`}>
        {image ? (
          <Image
            src={image}
            alt={article.imageAltText || article.title || ""}
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover transition duration-700 group-hover:scale-[1.03]"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(245,158,11,0.55),_transparent_35%),linear-gradient(135deg,#020617,#334155)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent lg:hidden" />
      </Link>

      <div className="flex flex-col justify-center p-5 sm:p-6 md:p-10">
        <div className="mb-4">
          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-900 dark:bg-amber-500/15 dark:text-amber-300">
            {article.category || "Featured"}
          </span>
        </div>

        <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-3xl md:text-4xl dark:text-white">
          <Link href={`/article/${article.slug}`} className="transition hover:text-amber-700 dark:hover:text-amber-400">
            {article.title || "Untitled article"}
          </Link>
        </h2>

        <p className="mt-4 line-clamp-3 text-[0.95rem] leading-6 text-slate-600 dark:text-slate-300 sm:mt-5 sm:line-clamp-4 sm:text-base sm:leading-7">
          {getArticleExcerpt(article)}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span>{article.author || "Contextra Editorial"}</span>
          <span aria-hidden="true">•</span>
          <time dateTime={publishedDate?.toISOString()}>{formatArticleDate(publishedDate)}</time>
          <span aria-hidden="true">•</span>
          <span>{getReadingTime(article)}</span>
        </div>

        <div className="mt-6 sm:mt-8">
          <Link href={`/article/${article.slug}`} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-600 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400 sm:w-auto">
            Read full story <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
