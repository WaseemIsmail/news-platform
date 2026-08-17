const DEFAULT_WORDS_PER_MINUTE = 220;

export function toDate(value) {
  if (!value) return null;

  try {
    if (typeof value.toDate === "function") return value.toDate();
    if (typeof value.seconds === "number") {
      return new Date(value.seconds * 1000);
    }

    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

export function getArticleDate(article) {
  return article?.publishedAt || article?.createdAt || article?.updatedAt || null;
}

export function formatArticleDate(value, fallback = "Recently published") {
  const date = toDate(value);
  if (!date) return fallback;

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getReadingTime(article) {
  const supplied = article?.readingTime;
  if (supplied) {
    const text = String(supplied).trim();
    return /read$/i.test(text) ? text : `${text} read`;
  }

  const body = [article?.content, article?.summary, article?.ourView]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (!body) return "2 min read";

  const words = body.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / DEFAULT_WORDS_PER_MINUTE))} min read`;
}

export function getArticleImage(article) {
  const image = article?.image || article?.featuredImage || article?.imageUrl;
  if (typeof image !== "string") return "";

  const trimmed = image.trim();
  if (!trimmed) return "";

  return /^(https?:\/\/|\/)/i.test(trimmed) ? trimmed : "";
}

export function getArticleExcerpt(article) {
  return (
    article?.summary ||
    article?.ourView ||
    "Read the full story with clear context, source links, and analysis."
  );
}
