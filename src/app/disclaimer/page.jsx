import Link from "next/link";
import { generateSEO } from "@/lib/seo";

export async function generateMetadata() {
  return generateSEO({
    title: "Disclaimer | Contextra",
    description:
      "Read the Contextra disclaimer regarding editorial opinions, fact-check reports, third-party sources, and general website usage.",
    image: "/images/default-og.jpg",
    url: "https://contextra.vercel.app/disclaimer",
  });
}

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-5xl px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Legal Information
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Disclaimer
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Please read this disclaimer carefully before using Contextra.
            By accessing this platform, you acknowledge and agree to the
            statements outlined below.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <section>
            <h2 className="text-2xl font-bold text-slate-900">
              General Information
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              All content published on Contextra is provided for general
              informational and editorial purposes only. While we strive to
              ensure accuracy, completeness, and relevance, we do not make
              guarantees regarding the reliability of any information
              published on this platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">
              Editorial Opinions
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              Opinion articles, editorials, and public commentary reflect
              the views of individual authors and contributors and do not
              necessarily represent the official position of Contextra.
              Readers are encouraged to evaluate multiple perspectives
              before forming conclusions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">
              Fact-Check Reports
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              Our fact-check reports are based on available public
              information, source verification, and editorial analysis at
              the time of publication. New evidence or developments may
              change conclusions over time. Contextra does not guarantee
              permanent accuracy as information evolves.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">
              External Links & Third-Party Sources
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              Contextra may reference third-party websites, external
              sources, and public documents for reporting purposes. We are
              not responsible for the content, availability, or reliability
              of external platforms and do not endorse third-party views
              unless explicitly stated.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">
              No Professional Advice
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              Content on Contextra should not be considered legal,
              financial, political, medical, or professional advice.
              Readers should seek qualified professional guidance before
              making decisions based on information published here.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">
              Limitation of Liability
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              Contextra shall not be held liable for any direct, indirect,
              incidental, or consequential damages resulting from the use
              of this website, including reliance on published content,
              editorial interpretation, or third-party references.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">
              Updates to This Disclaimer
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              We may update this Disclaimer periodically to reflect
              editorial policy changes, legal requirements, or platform
              improvements. Continued use of the website indicates your
              acceptance of the latest version.
            </p>
          </section>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-600">
            Questions regarding this Disclaimer?
          </p>

          <Link
            href="/contact"
            className="mt-4 inline-flex rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}