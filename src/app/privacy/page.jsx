import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Contextra",
  description:
    "Read the Contextra Privacy Policy to understand how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Privacy Policy
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">
            Your Privacy Matters
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            This Privacy Policy explains how Contextra collects, uses, and protects
            your information when you use our platform.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Information We Collect
              </h2>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                We may collect information you provide directly, such as your name,
                email address, profile details, comments, and account information.
                We may also collect basic usage information such as pages visited,
                interactions, and device-related data.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                How We Use Information
              </h2>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                We use collected information to operate Contextra, improve user
                experience, provide account functionality, personalize content,
                manage discussions, and analyze platform performance.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Comments and Public Content
              </h2>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                Comments, replies, and other content you submit may be visible to
                other users. Please avoid posting personal or confidential information
                in public discussion areas.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Cookies and Analytics
              </h2>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                Contextra may use cookies, analytics tools, and similar technologies
                to understand traffic, improve content performance, and enhance
                functionality. These tools help us understand how users interact with
                the platform.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Data Security
              </h2>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                We take reasonable steps to protect your information, but no method
                of online storage or transmission can be guaranteed as completely
                secure. Users should also take care to protect their own account
                credentials.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Third-Party Services
              </h2>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                Contextra may use third-party services such as analytics, hosting,
                authentication, advertising, and database providers. These services
                may process information according to their own privacy policies.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Changes to This Policy
              </h2>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                We may update this Privacy Policy from time to time. Any changes
                will be reflected on this page with the latest version of the policy.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
              <h2 className="text-2xl font-bold text-slate-900">
                Contact Us
              </h2>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                If you have questions about this Privacy Policy or how your data is
                handled, please contact us through our contact page.
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