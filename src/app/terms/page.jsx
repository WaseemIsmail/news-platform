import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | Contextra",
  description:
    "Read the Contextra Terms & Conditions to understand the rules and responsibilities for using our platform.",
};

export default function TermsPage() {
  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Terms & Conditions
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">
            Terms for Using Contextra
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            These Terms & Conditions explain the rules, responsibilities, and
            expectations for using the Contextra platform.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Acceptance of Terms
              </h2>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                By accessing or using Contextra, you agree to follow these
                Terms & Conditions. If you do not agree, you should not use the
                platform.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Use of the Platform
              </h2>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                Contextra is intended to provide news, historical context,
                analysis, and discussion features. Users must use the platform
                responsibly and lawfully.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                User Accounts
              </h2>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                Some features may require account registration. You are
                responsible for maintaining the confidentiality of your account
                credentials and for activities that occur under your account.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Public Comments and Content
              </h2>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                Users may be able to post comments, replies, and other public
                content. You are responsible for the content you submit and must
                avoid harmful, misleading, abusive, unlawful, or spam-related
                behavior.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Content Ownership
              </h2>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                Contextra and its original content, design, branding, and
                platform materials are protected by applicable intellectual
                property rights. Users may not copy, distribute, or reuse
                protected content without permission.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Platform Availability
              </h2>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                We aim to keep Contextra available and functional, but we do not
                guarantee uninterrupted access. Features may change, be updated,
                or be removed at any time.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Third-Party Services
              </h2>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                Contextra may rely on third-party providers for hosting,
                authentication, analytics, advertising, or other services. Use
                of those services may also be subject to their own terms and
                policies.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Limitation of Liability
              </h2>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                Contextra is provided on an as-available basis. We do not accept
                liability for losses, damages, or disruptions arising from use
                of the platform, to the extent permitted by applicable law.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Changes to These Terms
              </h2>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                We may update these Terms & Conditions from time to time.
                Continued use of the platform after changes are posted means you
                accept the updated terms.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
              <h2 className="text-2xl font-bold text-slate-900">
                Need Help?
              </h2>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                If you have questions about these Terms & Conditions, please
                contact us through the contact page.
              </p>

              <div className="mt-6">
                <Link
                  href="/contact"
                  className="inline-block rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}