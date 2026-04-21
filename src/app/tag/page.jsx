import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { getAllTags } from "@/lib/firestore";

export async function generateMetadata() {
  return generateSEO({
    title: "Browse Tags | Contextra",
    description:
      "Explore all news topics, trending discussions, and editorial perspectives through tags on Contextra.",
    image: "/images/default-og.jpg",
    url: "https://contextra.vercel.app/tag",
  });
}

export default async function TagsPage() {
  const tags = await getAllTags();

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-4 py-14">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-gray-500">
            Explore Topics
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Browse All Tags
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600">
            Discover stories by topic, trend, and public conversation.
            Follow the subjects that matter most to you.
          </p>
        </div>

        {/* Tags Grid */}
        {tags?.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.slug}`}
                className="group rounded-2xl border border-gray-200 bg-white p-5 transition duration-300 hover:border-black hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-black">
                    #{tag.name}
                  </h2>

                  {tag.count && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      {tag.count}
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Explore articles, opinions, and analysis related to{" "}
                  <span className="font-medium text-gray-800">
                    #{tag.name}
                  </span>
                  .
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 py-20 text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              No Tags Available
            </h3>
            <p className="mt-2 text-gray-600">
              Tags will appear here once articles are published.
            </p>
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900">
            Looking for something specific?
          </h3>

          <p className="mt-3 text-gray-600">
            Use search to quickly find articles, timelines, and opinions.
          </p>

          <Link
            href="/search"
            className="mt-6 inline-flex rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Go to Search
          </Link>
        </div>
      </section>
    </main>
  );
}