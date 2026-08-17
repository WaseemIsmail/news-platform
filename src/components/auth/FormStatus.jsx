export default function FormStatus({ error, success }) {
  if (!error && !success) return null;

  return (
    <div className={`mb-5 rounded-2xl border px-4 py-3 text-sm leading-6 ${error ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300" : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"}`} role={error ? "alert" : "status"} aria-live="polite">
      {error || success}
    </div>
  );
}
