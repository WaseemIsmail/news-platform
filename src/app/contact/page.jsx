export const metadata = {
  title: "Contact Us | Contextra",
  description:
    "Get in touch with Contextra for feedback, inquiries, partnerships, or support.",
};

export default function ContactPage() {
  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Contact Us
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">
            Let’s Talk
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Reach out to Contextra for support, suggestions, partnerships, or general inquiries.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">
                General Inquiries
              </h2>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                For questions about Contextra, editorial feedback, platform issues,
                or collaboration opportunities, contact us using the details below.
              </p>

              <div className="mt-8 space-y-5">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Email
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    hello@contextra.com
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Support
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    support@contextra.com
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Partnerships
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    partners@contextra.com
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">
                Why Contact Us?
              </h2>

              <ul className="mt-6 space-y-4 text-sm leading-8 text-slate-600">
                <li>• Report a technical issue</li>
                <li>• Share editorial feedback</li>
                <li>• Ask about partnerships or media collaboration</li>
                <li>• Request support for your account</li>
                <li>• Suggest topics you want covered on Contextra</li>
              </ul>

              <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-600">
                  We aim to respond to all important inquiries as soon as possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}