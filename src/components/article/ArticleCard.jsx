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

export default function ArticleCard({ article, compact = false }) {
  const href = `/article/${article.slug}`;
  const image = getArticleImage(article);
  const publishedDate = toDate(getArticleDate(article));

  return (
    <article className="group h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 sm:rounded-3xl">
      <Link href={href} className="flex h-full flex-col" aria-label={`Read ${article.title}`}>
        <div className={`relative overflow-hidden bg-slate-900 ${compact ? "aspect-video sm:aspect-[16/8]" : "aspect-video sm:aspect-[16/10]"}`}>
          {image ? (
            <Image
              src={image}
              alt={article.imageAltText || article.title || ""}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(245,158,11,0.6),_transparent_36%),linear-gradient(135deg,#172033,#334155)]">
              <div className="absolute -right-14 -top-16 h-48 w-48 rounded-full border border-white/15" />
              <div className="absolute -right-2 -top-3 h-28 w-28 rounded-full border border-amber-300/25" />
              <span className="absolute bottom-4 right-5 text-7xl font-black uppercase leading-none text-white/[0.08]" aria-hidden="true">
                {(article.category || "C").charAt(0)}
              </span>
              <div className="absolute bottom-4 left-4">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-amber-300">Contextra</p>
                <p className="mt-1 text-xs font-semibold text-slate-200">News with context</p>
              </div>
            </div>
          )}

          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-900 shadow-sm backdrop-blur dark:bg-white/95 dark:text-slate-950">
            {article.category || "General"}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <time dateTime={publishedDate?.toISOString()}>{formatArticleDate(publishedDate)}</time>
            <span aria-hidden="true">•</span>
            <span>{getReadingTime(article)}</span>
          </div>

          <h2 className={`${compact ? "text-lg" : "text-xl"} mt-3 font-bold leading-snug text-slate-950 transition group-hover:text-amber-700 dark:text-white dark:group-hover:text-amber-400`}>
            {article.title || "Untitled article"}
          </h2>

          {!compact && (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {getArticleExcerpt(article)}
            </p>
          )}

          <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-slate-900 dark:text-slate-100">
            Read story
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
