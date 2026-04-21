import Link from "next/link";

export const metadata = {
  title: "About Us | Contextra",
  description:
    "Learn about Contextra — a platform built to explain current events through history, context, and deeper understanding.",
};

export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            About Contextra
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">
            News With Context, Not Just Headlines
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Contextra is built to help readers understand the deeper meaning
            behind today’s biggest stories by connecting current events with
            history, analysis, and real public discussion.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Why We Built Contextra
              </h2>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                Modern news often focuses only on breaking headlines.
                Readers see what happened today, but rarely understand
                why it happened, how it connects to the past, or what may
                happen next.
              </p>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                Contextra solves that problem by creating structured article
                timelines, deeper analysis, and meaningful discussions that
                help readers make better sense of complex global events.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Our Core Mission
              </h2>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                Our mission is simple:
                deliver clarity, not noise.
              </p>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                We aim to create a platform where information is not just fast,
                but also meaningful, reliable, and easier to understand.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                What Makes Contextra Different
              </h2>

              <div className="mt-6 grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 p-6">
                  <h3 className="font-semibold text-slate-900">
                    Historical Timelines
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Every major story includes background and timeline context.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-6">
                  <h3 className="font-semibold text-slate-900">
                    Public Discussion
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Readers can react, comment, and participate in meaningful conversations.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-6">
                  <h3 className="font-semibold text-slate-900">
                    Clear Explanations
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Complex political, economic, and global topics explained simply.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
              <h2 className="text-2xl font-bold text-slate-900">
                Start Exploring
              </h2>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                Explore the latest stories, trending debates, and contextual timelines
                built to help you understand the world more clearly.
              </p>

              <div className="mt-6">
                <Link
                  href="/latest"
                  className="inline-block rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Explore Latest Articles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}