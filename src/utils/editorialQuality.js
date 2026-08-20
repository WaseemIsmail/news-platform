export const OUR_VIEW_WORD_RANGES = {
  attributed_brief: { minimum: 130, maximum: 200, minimumParagraphs: 4, maximumParagraphs: 4 },
  explainer: { minimum: 220, maximum: 360, minimumParagraphs: 4, maximumParagraphs: 4 },
  default: { minimum: 160, maximum: 300, minimumParagraphs: 4, maximumParagraphs: 4 },
};

export function getEditorialMode(articleOrMode = {}) {
  if (typeof articleOrMode === "string") return articleOrMode.trim().toLowerCase();
  return String(
    articleOrMode?.editorialMode || articleOrMode?.articleType || "explainer",
  ).trim().toLowerCase();
}

export function countWords(value = "") {
  return (String(value).match(/[\p{L}\p{N}_'-]+/gu) || []).length;
}

export function getOurViewWordRange(articleOrMode = {}) {
  const mode = getEditorialMode(articleOrMode);
  return OUR_VIEW_WORD_RANGES[mode] || OUR_VIEW_WORD_RANGES.default;
}

export function validateOurViewQuality(value, articleOrMode = {}) {
  const text = String(value || "").trim();
  if (!text) return "Why this story matters is required.";

  const words = countWords(text);
  const { minimum, maximum } = getOurViewWordRange(articleOrMode);
  if (words < minimum) {
    return `Why this story matters needs at least ${minimum} words for this editorial format; it currently has ${words}.`;
  }
  if (words > maximum) {
    return `Why this story matters should be no more than ${maximum} words for this editorial format; it currently has ${words}.`;
  }
  const paragraphs = text.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
  const { minimumParagraphs, maximumParagraphs } = getOurViewWordRange(articleOrMode);
  if (paragraphs.length < minimumParagraphs || paragraphs.length > maximumParagraphs) {
    if (minimumParagraphs === maximumParagraphs) {
      return `Why this story matters needs exactly ${minimumParagraphs} focused paragraphs for this editorial format; it currently has ${paragraphs.length}.`;
    }
    return `Why this story matters needs ${minimumParagraphs} to ${maximumParagraphs} focused paragraphs for this editorial format; it currently has ${paragraphs.length}.`;
  }
  return "";
}
