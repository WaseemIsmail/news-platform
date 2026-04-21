export default function sanitizeHtml(content = "") {
  if (!content || typeof content !== "string") {
    return "";
  }

  return content
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "")
    .trim();
}

export function stripHtmlTags(content = "") {
  if (!content || typeof content !== "string") {
    return "";
  }

  return content
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function sanitizeExcerpt(content = "", maxLength = 180) {
  const plainText = stripHtmlTags(content);

  if (!plainText) return "";

  if (plainText.length <= maxLength) {
    return plainText;
  }

  const shortened = plainText.slice(0, maxLength);
  const lastSpace = shortened.lastIndexOf(" ");

  if (lastSpace === -1) {
    return `${shortened}...`;
  }

  return `${shortened.slice(0, lastSpace)}...`;
}