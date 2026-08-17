import Link from "next/link";

export default function AccountState({ loading = false, title = "Sign in to continue", description = "Your reader account keeps personal activity private and available only after you sign in." }) {
  return (
    <main className="min-h-[70vh] bg-slate-50 px-5 py-20 text-center text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-12">
        {loading ? (
          <div aria-busy="true" aria-label="Loading account"><div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-amber-500 dark:border-slate-700" /><p className="mt-5 font-semibold text-slate-600 dark:text-slate-300">Loading your account…</p></div>
        ) : (
          <><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-xl font-black text-amber-800 dark:bg-amber-500/15 dark:text-amber-300" aria-hidden="true">C</div><h1 className="mt-5 text-3xl font-black tracking-tight">{title}</h1><p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{description}</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Link href="/login" className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white dark:bg-amber-400 dark:text-slate-950">Sign in</Link><Link href="/signup" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold dark:border-slate-700">Create account</Link></div></>
        )}
      </div>
    </main>
  );
}
