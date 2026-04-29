"use client";

import { useEffect, useState } from "react";

export default function ShareBar({ article }) {
  const [articleUrl, setArticleUrl] = useState(
    `https://contextra.netlify.app/article/${article?.slug || ""}`
  );

  const [isBookmarked, setIsBookmarked] = useState(false);

  const shareText =
    article?.title || "Check out this article on Contextra";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setArticleUrl(window.location.href);

      // Load bookmark state from localStorage
      const savedBookmarks = JSON.parse(
        localStorage.getItem("bookmarkedArticles") || "[]"
      );

      if (savedBookmarks.includes(article?.id)) {
        setIsBookmarked(true);
      }
    }
  }, [article?.id]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      alert("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleBookmark = () => {
    try {
      const savedBookmarks = JSON.parse(
        localStorage.getItem("bookmarkedArticles") || "[]"
      );

      let updatedBookmarks = [];

      if (savedBookmarks.includes(article?.id)) {
        // Remove bookmark
        updatedBookmarks = savedBookmarks.filter(
          (id) => id !== article?.id
        );
        setIsBookmarked(false);
      } else {
        // Add bookmark
        updatedBookmarks = [...savedBookmarks, article?.id];
        setIsBookmarked(true);
      }

      localStorage.setItem(
        "bookmarkedArticles",
        JSON.stringify(updatedBookmarks)
      );
    } catch (error) {
      console.error("Bookmark error:", error);
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

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `${shareText} ${articleUrl}`
  )}`;

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Share Article
          </p>

          <h3 className="mt-2 text-xl font-semibold text-slate-900">
            Share this story with others
          </h3>

          <p className="mt-2 text-sm leading-7 text-slate-600">
            Spread the discussion across your network.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {/* Bookmark Button */}
          <button
            type="button"
            onClick={handleBookmark}
            className={`rounded-xl border px-4 py-4 text-center text-sm font-medium transition ${
              isBookmarked
                ? "border-amber-300 bg-amber-100 text-amber-800"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {isBookmarked ? "🔖 Saved" : "🔖 Bookmark"}
          </button>

          {/* Copy Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="rounded-xl border border-slate-200 px-4 py-4 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Copy Link
          </button>

          {/* Twitter */}
          <a
            href={twitterShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-slate-200 px-4 py-4 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            𝕏 Twitter
          </a>

          {/* LinkedIn */}
          <a
            href={linkedInShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-slate-200 px-4 py-4 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            LinkedIn
          </a>

          {/* Facebook */}
          <a
            href={facebookShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-slate-200 px-4 py-4 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Facebook
          </a>

          {/* WhatsApp */}
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-slate-200 px-4 py-4 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}