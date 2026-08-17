"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/profile", label: "Overview", description: "Account at a glance" },
  { href: "/bookmarks", label: "Saved stories", description: "Your reading list" },
  { href: "/notifications", label: "Notifications", description: "Replies and updates" },
  { href: "/settings", label: "Settings", description: "Profile and security" },
];

export default function AccountShell({ eyebrow, title, description, actions, children }) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 md:py-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">{eyebrow}</p>
          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div><h1 className="text-3xl font-black tracking-[-0.035em] sm:text-5xl">{title}</h1><p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">{description}</p></div>
            {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-6 md:py-12 lg:grid-cols-[250px_1fr]">
        <aside>
          <nav className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-28 lg:flex-col lg:overflow-visible lg:rounded-3xl lg:border lg:border-slate-200 lg:bg-white lg:p-3 lg:shadow-sm dark:lg:border-slate-800 dark:lg:bg-slate-900" aria-label="Account navigation">
            {navigation.map((item) => {
              const active = pathname === item.href;
              return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`min-w-max rounded-2xl px-4 py-3 transition ${active ? "bg-slate-950 text-white dark:bg-amber-400 dark:text-slate-950" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 lg:border-0 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"}`}><span className="block text-sm font-bold">{item.label}</span><span className={`mt-0.5 hidden text-xs lg:block ${active ? "text-slate-300 dark:text-slate-700" : "text-slate-500 dark:text-slate-400"}`}>{item.description}</span></Link>;
            })}
          </nav>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </main>
  );
}
