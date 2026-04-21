"use client";

export default function ShareBar({ article }) {
  const articleUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://your-domain.com/article/${article?.slug || ""}`;

  const shareText = article?.title || "Check out this article on Contextra";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      alert("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(articleUrl)}`;

  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    articleUrl
  )}`;

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    articleUrl
  )}`;

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Share Article
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">
            Share this story with others
          </h3>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCopyLink}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Copy Link
          </button>

          <a
            href={twitterShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            X / Twitter
          </a>

          <a
            href={linkedInShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            LinkedIn
          </a>

          <a
            href={facebookShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Facebook
          </a>
        </div>
      </div>
    </section>
  );
}