"use client";

import { useEffect, useState } from "react";

const options = [
  { value: "compact", label: "Compact text", visual: "A" },
  { value: "comfortable", label: "Comfortable text", visual: "A+" },
  { value: "large", label: "Large text", visual: "A++" },
];

export default function ArticleReader({ children, hasSources = false }) {
  const [size, setSize] = useState("comfortable");

  useEffect(() => {
    let frame;
    try {
      const saved = window.localStorage.getItem("contextra-reader-size");
      if (options.some((option) => option.value === saved)) {
        frame = window.requestAnimationFrame(() => setSize(saved));
      }
    } catch {
      // Reading preferences are optional; the default remains available.
    }
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const updateSize = (value) => {
    setSize(value);
    try {
      window.localStorage.setItem("contextra-reader-size", value);
    } catch {
      // Ignore storage restrictions without interrupting reading.
    }
  };

  return (
    <section className={`reader-shell reader-size-${size}`} aria-label="Reading view">
      <div className="sticky top-[4.5rem] z-20 mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-2.5 shadow-lg shadow-slate-950/5 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95 sm:top-20">
        <div className="flex min-w-0 items-center gap-2 pl-2">
          <span className="hidden text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 sm:inline">Reading size</span>
          <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-950" role="group" aria-label="Article text size">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateSize(option.value)}
                aria-label={option.label}
                aria-pressed={size === option.value}
                className={`min-h-9 rounded-lg px-3 py-1.5 text-xs font-black transition ${size === option.value ? "bg-white text-slate-950 shadow-sm dark:bg-amber-400 dark:text-slate-950" : "text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"}`}
              >
                {option.visual}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold">
          {hasSources && <a href="#sources" className="inline-flex min-h-9 items-center rounded-xl px-3 text-amber-700 transition hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-slate-800">Sources</a>}
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="inline-flex min-h-9 items-center rounded-xl px-3 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
            Back to top ↑
          </button>
        </div>
      </div>
      {children}
    </section>
  );
}
