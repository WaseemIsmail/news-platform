import Link from "next/link";
import BrandMark from "./BrandMark";

const groups = [
  {
    title: "Read",
    links: [
      { label: "Latest stories", href: "/latest" },
      { label: "Popular stories", href: "/trending" },
      { label: "Opinion", href: "/opinion" },
      { label: "Fact Check", href: "/fact-check" },
      { label: "Timelines", href: "/timeline" },
      { label: "RSS feed", href: "/feed.xml" },
    ],
  },
  {
    title: "Explore topics",
    links: [
      { label: "Politics", href: "/category/politics" },
      { label: "Business", href: "/category/business" },
      { label: "Technology", href: "/category/technology" },
      { label: "World", href: "/category/world" },
      { label: "All topics", href: "/category" },
    ],
  },
  {
    title: "Reader account",
    links: [
      { label: "Profile", href: "/profile" },
      { label: "Saved stories", href: "/bookmarks" },
      { label: "Notifications", href: "/notifications" },
      { label: "Settings", href: "/settings" },
      { label: "Create account", href: "/signup" },
    ],
  },
  {
    title: "About Contextra",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact & corrections", href: "/contact" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms & conditions", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="border-b border-slate-800 bg-amber-400 text-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-7 sm:px-6 sm:py-9 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-950/70">Keep exploring</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] sm:text-3xl">Go beyond the next headline.</h2>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-800">Read the newest reporting or choose a topic and build the context at your own pace.</p>
          </div>
          <div className="grid shrink-0 grid-cols-1 gap-3 min-[390px]:grid-cols-2">
            <Link href="/latest" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800">Read latest</Link>
            <Link href="/category" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-950/30 px-5 py-3 text-sm font-black transition hover:bg-amber-300">Browse topics</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-16">
        <div className="grid gap-10 xl:grid-cols-[1.1fr_1.9fr] xl:gap-12">
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Contextra home"><BrandMark className="h-11 w-11 rounded-xl" /><span><strong className="block text-2xl font-black tracking-[-0.04em]">Contextra</strong><span className="mt-1 block text-[0.62rem] font-bold uppercase tracking-[0.18em] text-slate-400">News with context</span></span></Link>
            <p className="mt-6 max-w-md text-sm leading-7 text-slate-300">Understand current events through sourced reporting, useful background, clearly labelled analysis, and timelines that connect the story.</p>
            <div className="mt-6 flex flex-wrap gap-2" aria-label="Contextra editorial principles"><span className="rounded-full border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-300">Sources linked</span><span className="rounded-full border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-300">Analysis labelled</span><span className="rounded-full border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-300">Corrections welcomed</span></div>
          </div>

          <nav className="divide-y divide-slate-800 border-y border-slate-800 md:hidden" aria-label="Footer navigation">
            {groups.map((group) => <details key={group.title} className="group"><summary className="flex min-h-14 cursor-pointer list-none items-center justify-between py-3 text-sm font-black text-white marker:content-none"><span>{group.title}</span><span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 text-lg font-medium text-amber-400 transition-transform group-open:rotate-45" aria-hidden="true">+</span></summary><ul className="grid grid-cols-2 gap-x-4 gap-y-1 pb-4">{group.links.map((item) => <li key={item.href}><Link href={item.href} className="block min-h-11 py-3 text-sm text-slate-400 transition hover:text-white">{item.label}</Link></li>)}</ul></details>)}
          </nav>

          <nav className="hidden grid-cols-4 gap-x-6 gap-y-10 md:grid" aria-label="Footer navigation">
            {groups.map((group) => <section key={group.title}><h2 className="text-xs font-black uppercase tracking-[0.18em] text-amber-400">{group.title}</h2><ul className="mt-5 space-y-3.5">{group.links.map((item) => <li key={item.href}><Link href={item.href} className="text-sm text-slate-400 transition hover:text-white">{item.label}</Link></li>)}</ul></section>)}
          </nav>
        </div>

        <div className="mt-10 grid gap-5 border-t border-slate-800 pt-6 text-xs leading-5 text-slate-500 sm:mt-14 sm:grid-cols-[1fr_auto] sm:items-center sm:pt-7">
          <div className="flex flex-wrap gap-x-5 gap-y-2"><p>© {new Date().getFullYear()} Contextra. All rights reserved.</p><Link href="/contact" className="transition hover:text-slate-300">Report an error or request a correction</Link></div>
          <p className="text-slate-500">Reporting, context, and analysis—clearly distinguished.</p>
        </div>
      </div>
    </footer>
  );
}
