import Link from "next/link";

const benefits = [
  "Save stories and build a personal reading list",
  "Join thoughtful discussions and reactions",
  "Keep notifications and account controls in one place",
];

export default function AuthShell({ eyebrow, title, description, children, footer }) {
  return (
    <main className="bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.28),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),_transparent_30%)]" />
          <div className="relative">
            <Link href="/" className="text-2xl font-black tracking-tight">Contextra</Link>
            <p className="mt-20 text-xs font-bold uppercase tracking-[0.22em] text-amber-400">Your reader account</p>
            <h2 className="mt-4 max-w-lg text-4xl font-black leading-tight tracking-[-0.035em] xl:text-5xl">Keep the stories that help you understand the world.</h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">A focused account experience built around reading—not noise, streaks, or endless scrolling.</p>
          </div>
          <ul className="relative mt-12 space-y-4 border-t border-slate-800 pt-8">
            {benefits.map((benefit) => <li key={benefit} className="flex gap-3 text-sm text-slate-300"><span className="font-black text-amber-400" aria-hidden="true">✓</span><span>{benefit}</span></li>)}
          </ul>
        </aside>

        <div className="flex items-center justify-center px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <div className="w-full max-w-lg">
            <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-amber-700 dark:text-slate-300 dark:hover:text-amber-400 lg:hidden">← Contextra</Link>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:p-9">
              <header>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">{eyebrow}</p>
                <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] sm:text-4xl">{title}</h1>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
              </header>
              <div className="mt-7">{children}</div>
              {footer && <div className="mt-7 border-t border-slate-200 pt-6 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">{footer}</div>}
            </div>
            <p className="mt-5 text-center text-xs leading-5 text-slate-500 dark:text-slate-400">By continuing, you agree to Contextra’s <Link href="/terms" className="font-semibold underline">Terms</Link> and acknowledge the <Link href="/privacy" className="font-semibold underline">Privacy Policy</Link>.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
