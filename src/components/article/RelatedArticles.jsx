import ArticleCard from "@/components/article/ArticleCard";

export default function RelatedArticles({ articles = [] }) {
  if (!articles.length) return null;

  return (
    <section className="mt-16 border-t border-slate-200 pt-10 dark:border-slate-800">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">Continue exploring</p>
      <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">Related reporting</h2>

      <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} compact />
        ))}
      </div>
    </section>
  );
}
