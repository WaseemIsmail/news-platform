export default function formatDate(value, options = {}) {
  if (!value) return "";

  let date;

  if (typeof value?.toDate === "function") {
    date = value.toDate();
  } else if (value instanceof Date) {
    date = value;
  } else if (typeof value === "string" || typeof value === "number") {
    date = new Date(value);
  } else if (
    typeof value === "object" &&
    typeof value.seconds === "number"
  ) {
    date = new Date(value.seconds * 1000);
  } else {
    return "";
  }

  if (Number.isNaN(date.getTime())) return "";

  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString(
    "en-US",
    Object.keys(options).length ? options : defaultOptions
  );
}

export function formatDateTime(value, options = {}) {
  if (!value) return "";

  let date;

  if (typeof value?.toDate === "function") {
    date = value.toDate();
  } else if (value instanceof Date) {
    date = value;
  } else if (typeof value === "string" || typeof value === "number") {
    date = new Date(value);
  } else if (
    typeof value === "object" &&
    typeof value.seconds === "number"
  ) {
    date = new Date(value.seconds * 1000);
  } else {
    return "";
  }

  if (Number.isNaN(date.getTime())) return "";

  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };

  return date.toLocaleString(
    "en-US",
    Object.keys(options).length ? options : defaultOptions
  );
}

export function formatRelativeDate(value) {
  if (!value) return "";

  let date;

  if (typeof value?.toDate === "function") {
    date = value.toDate();
  } else if (value instanceof Date) {
    date = value;
  } else if (typeof value === "string" || typeof value === "number") {
    date = new Date(value);
  } else if (
    typeof value === "object" &&
    typeof value.seconds === "number"
  ) {
    date = new Date(value.seconds * 1000);
  } else {
    return "";
  }

  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  return formatDate(date);
}