import Link from "next/link";
import { fetchAllCategories } from "@/services/categoryService";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "All Categories | Contextra",
  description:
    "Explore all news categories including politics, economy, world, technology, sports, and more on Contextra.",
  url: "https://your-domain.com/category",
});

export default async function CategoryPage() {
  const categories = await fetchAllCategories();

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Browse Categories
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">
            Explore News by Category
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Discover stories by topic and explore deeper context across politics,
            economy, world events, business, technology, sports, and more.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          {categories.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">
                No categories available
              </h2>

              <p className="mt-4 text-slate-600">
                Categories will appear here after articles are published.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900">
                  {categories.length} Categories
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-700">
                      Category
                    </p>

                    <h3 className="mt-3 text-2xl font-bold text-slate-900">
                      {category.name}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      Explore articles related to {category.name.toLowerCase()}.
                    </p>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        {category.count} Article
                        {category.count > 1 ? "s" : ""}
                      </span>

                      <span className="text-sm font-medium text-slate-900">
                        View →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}