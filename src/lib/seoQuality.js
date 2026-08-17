const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "have",
  "how", "in", "is", "it", "its", "of", "on", "or", "that", "the", "this", "to",
  "was", "were", "what", "when", "where", "which", "who", "why", "will", "with",
]);

function cleanText(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[#*_>`~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateAtWord(value, maxLength) {
  const text = cleanText(value);
  if (text.length <= maxLength) return text;

  const shortened = text.slice(0, maxLength + 1);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, lastSpace > maxLength * 0.65 ? lastSpace : maxLength).trim()}…`;
}

function uniqueValues(values = []) {
  const seen = new Set();
  return values
    .map((value) => cleanText(value))
    .filter((value) => {
      const key = value.toLowerCase();
      if (!value || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function headlineKeywords(title = "") {
  return cleanText(title)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word))
    .slice(0, 4);
}

function buildFocusKeyword(article) {
  const supplied = cleanText(article.focusKeyword);
  if (supplied) return truncateAtWord(supplied, 60);

  const keywords = headlineKeywords(article.title);
  if (keywords.length) return keywords.slice(0, 3).join(" ");
  return cleanText(article.category) || "current news";
}

/**
 * Fill missing reach fields without changing the editorial title or article body.
 * This gives both automated and manually-created articles a dependable SEO baseline.
 */
export function enrichArticleSeo(article = {}) {
  const title = cleanText(article.title);
  const summary = cleanText(article.summary);
  const content = cleanText(article.content);
  const focusKeyword = buildFocusKeyword(article);
  const relatedKeywords = uniqueValues(
    Array.isArray(article.relatedKeywords) ? article.relatedKeywords : [],
  ).slice(0, 8);
  const generatedTags = headlineKeywords(title).slice(0, 3);
  const tags = uniqueValues([
    ...(Array.isArray(article.tags) ? article.tags : []),
    ...relatedKeywords,
    article.category,
    focusKeyword,
    ...generatedTags,
  ]).slice(0, 8);

  return {
    ...article,
    seoTitle: truncateAtWord(article.seoTitle || title, 60),
    metaDescription: truncateAtWord(article.metaDescription || summary || content, 160),
    focusKeyword,
    relatedKeywords,
    tags,
    imageAltText: cleanText(article.imageAltText || (article.image ? title : "")),
    socialCaption: truncateAtWord(
      article.socialCaption || [title, summary].filter(Boolean).join(" — "),
      240,
    ),
  };
}

function wordCount(value = "") {
  const text = cleanText(value);
  return text ? text.split(/\s+/).length : 0;
}

function addCheck(checks, id, label, passed, score, maxScore, message) {
  checks.push({ id, label, passed, score, maxScore, message });
}

/**
 * A transparent, deterministic readiness score. It is advisory: copyright,
 * factual verification, and publication-safety checks remain separate gates.
 */
export function calculateSeoQuality(article = {}) {
  const checks = [];
  const title = cleanText(article.title);
  const summary = cleanText(article.summary);
  const content = cleanText(article.content);
  const seoTitle = cleanText(article.seoTitle);
  const metaDescription = cleanText(article.metaDescription);
  const focusKeyword = cleanText(article.focusKeyword);
  const tags = uniqueValues(Array.isArray(article.tags) ? article.tags : []);
  const articleWords = wordCount(content);
  const isBrief = [article.articleType, article.editorialMode].includes("attributed_brief");
  const targetWords = isBrief ? 120 : 300;

  const titleIdeal = title.length >= 30 && title.length <= 90;
  addCheck(checks, "headline", "Clear headline", titleIdeal, titleIdeal ? 12 : title ? 7 : 0, 12,
    titleIdeal ? "Headline length is search-friendly." : "Use a descriptive headline between 30 and 90 characters.");

  const summaryIdeal = summary.length >= 70 && summary.length <= 220;
  addCheck(checks, "summary", "Useful summary", summaryIdeal, summaryIdeal ? 8 : summary ? 4 : 0, 8,
    summaryIdeal ? "Summary gives readers and discovery surfaces useful context." : "Aim for a 70–220 character summary.");

  const contentIdeal = articleWords >= targetWords;
  const contentScore = contentIdeal ? 20 : articleWords >= Math.round(targetWords * 0.65) ? 13 : articleWords ? 6 : 0;
  addCheck(checks, "content", "Content depth", contentIdeal, contentScore, 20,
    contentIdeal ? `${articleWords} words meets the ${targetWords}-word target.` : `Use at least ${targetWords} original words for this article type.`);

  const seoTitleIdeal = seoTitle.length >= 30 && seoTitle.length <= 60;
  addCheck(checks, "seo_title", "SEO title", seoTitleIdeal, seoTitleIdeal ? 12 : seoTitle ? 7 : 0, 12,
    seoTitleIdeal ? "SEO title fits common result layouts." : "Keep the SEO title between 30 and 60 characters.");

  const descriptionIdeal = metaDescription.length >= 110 && metaDescription.length <= 160;
  addCheck(checks, "meta_description", "Meta description", descriptionIdeal, descriptionIdeal ? 16 : metaDescription ? 9 : 0, 16,
    descriptionIdeal ? "Meta description is ready for search and social previews." : "Use a specific 110–160 character meta description.");

  const keywordText = `${title} ${summary} ${seoTitle}`.toLowerCase();
  const keywordTokens = headlineKeywords(focusKeyword);
  const keywordUsed = Boolean(focusKeyword) && (
    keywordText.includes(focusKeyword.toLowerCase())
    || (keywordTokens.length > 0 && keywordTokens.every((token) => keywordText.includes(token)))
  );
  addCheck(checks, "focus_keyword", "Focus phrase", keywordUsed, keywordUsed ? 10 : focusKeyword ? 6 : 0, 10,
    keywordUsed ? "The focus phrase appears naturally in prominent copy." : "Use one relevant focus phrase in the headline, SEO title, or summary.");

  const tagsIdeal = tags.length >= 3 && tags.length <= 8;
  addCheck(checks, "tags", "Topic links", tagsIdeal, tagsIdeal ? 8 : tags.length ? 4 : 0, 8,
    tagsIdeal ? `${tags.length} tags support internal discovery.` : "Add 3–8 accurate topic tags.");

  const imageReady = Boolean(article.image && cleanText(article.imageAltText));
  addCheck(checks, "image", "Share image", imageReady, imageReady ? 7 : article.image ? 3 : 0, 7,
    imageReady ? "Image and alt text are ready for large previews." : "Add a rights-cleared image and meaningful alt text for stronger previews.");

  const categoryReady = Boolean(cleanText(article.category));
  addCheck(checks, "category", "Category", categoryReady, categoryReady ? 5 : 0, 5,
    categoryReady ? "Category supports navigation and internal linking." : "Assign a relevant category.");

  const sourceReady = Boolean(cleanText(article.sourceName)) && Array.isArray(article.sourceUrls) && article.sourceUrls.length > 0;
  addCheck(checks, "sources", "Transparent sources", sourceReady, sourceReady ? 2 : 0, 2,
    sourceReady ? "Source attribution supports reader trust." : "Include a source name and source URL.");

  const score = checks.reduce((total, check) => total + check.score, 0);
  const grade = score >= 90 ? "excellent" : score >= 75 ? "good" : score >= 60 ? "needs_improvement" : "weak";

  return {
    score,
    grade,
    passed: score >= 70,
    wordCount: articleWords,
    checkedAt: new Date().toISOString(),
    recommendations: checks.filter((check) => !check.passed).map((check) => check.message),
    checks,
  };
}
