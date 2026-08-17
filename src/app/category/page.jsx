import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { fetchAllCategories } from "@/services/categoryService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = generateSEO({
  title: "Topics | Contextra",
  description: "Explore Contextra reporting by topic, from politics and business to technology, world affairs, sports, and education.",
  url: "/category",
});

const accents = [
  "from-amber-400/35 via-amber-200/10",
  "from-blue-500/30 via-blue-200/10",
  "from-emerald-500/30 via-emerald-200/10",
  "from-violet-500/30 via-violet-200/10",
  "from-rose-500/30 via-rose-200/10",
  "from-cyan-500/30 via-cyan-200/10",
];

export default async function CategoryPage() {
  const categories = await fetchAllCategories();
  const totalArticles = categories.reduce((total, category) => total + Number(category.count || 0), 0);

  return (
    <main className="bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="border-b border-slate-200 bg-slate-950 text-white dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 md:py-20">
          <Link href="/" className="text-sm font-bold text-slate-300 hover:text-amber-400">← Home</Link>
          <div className="mt-9 grid gap-6 lg:grid-cols-[1fr_0.45fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-400">Explore by subject</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-[-0.04em] sm:text-6xl">Find the context that matters to you.</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Choose a subject to follow its newest reporting, background, and analysis in one place.</p>
            </div>
            {categories.length > 0 && (
              <dl className="grid grid-cols-2 gap-3 rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                <div><dt className="text-xs uppercase tracking-wide text-slate-400">Topics</dt><dd className="mt-1 text-3xl font-black">{categories.length}</dd></div>
                <div><dt className="text-xs uppercase tracking-wide text-slate-400">Stories</dt><dd className="mt-1 text-3xl font-black">{totalArticles}</dd></div>
              </dl>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          {categories.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-2xl font-black">Topics are being prepared</h2>
              <p className="mt-3 text-slate-600 dark:text-slate-300">Categories will appear as soon as published stories are available.</p>
              <Link href="/latest" className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white dark:bg-amber-400 dark:text-slate-950">Browse latest</Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category, index) => (
                <Link key={category.slug} href={`/category/${category.slug}`} className={`group relative min-h-72 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br ${accents[index % accents.length]} to-white p-6 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:to-slate-900 dark:hover:border-slate-700`}>
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-white dark:bg-white dark:text-slate-950" aria-hidden="true">{category.name?.charAt(0) || "C"}</span>
                    {category.latestArticleValue > 0 && <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-emerald-700 backdrop-blur dark:bg-slate-950/60 dark:text-emerald-300">Recently updated</span>}
                  </div>
                  <h2 className="mt-9 text-3xl font-black tracking-tight">{category.name}</h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{category.description || `Reporting and analysis covering ${category.name.toLowerCase()}.`}</p>
                  <div className="absolute inset-x-6 bottom-6 flex items-center justify-between border-t border-slate-950/10 pt-4 text-sm dark:border-white/10">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">{category.count} {category.count === 1 ? "story" : "stories"}</span>
                    <span className="font-black transition-transform group-hover:translate-x-1">Explore →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
