export default function truncateText(text, maxLength = 120) {
  if (!text || typeof text !== "string") return "";

  const cleanText = text.trim();

  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  return `${cleanText.slice(0, maxLength).trim()}...`;
}

export function truncateWords(text, maxWords = 20) {
  if (!text || typeof text !== "string") return "";

  const words = text.trim().split(/\s+/);

  if (words.length <= maxWords) {
    return text.trim();
  }

  return `${words.slice(0, maxWords).join(" ")}...`;
}

export function truncateParagraph(text, maxLength = 180) {
  if (!text || typeof text !== "string") return "";

  const cleanText = text.replace(/\s+/g, " ").trim();

  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  const shortened = cleanText.slice(0, maxLength);
  const lastSpace = shortened.lastIndexOf(" ");

  if (lastSpace === -1) {
    return `${shortened}...`;
  }

  return `${shortened.slice(0, lastSpace)}...`;
}