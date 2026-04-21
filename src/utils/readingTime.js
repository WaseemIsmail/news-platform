export function readingTime(text = "") {
  const wordsPerMinute = 200;

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  return `${minutes} min read`;
}