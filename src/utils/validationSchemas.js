export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateRequired(value, fieldName = "This field") {
  if (value === null || value === undefined || String(value).trim() === "") {
    return `${fieldName} is required.`;
  }

  return "";
}

export function validateEmail(email) {
  if (!email || !email.trim()) {
    return "Email address is required.";
  }

  if (!emailRegex.test(email.trim())) {
    return "Please enter a valid email address.";
  }

  return "";
}

export function validatePassword(password, minLength = 6) {
  if (!password || !password.trim()) {
    return "Password is required.";
  }

  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters.`;
  }

  return "";
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword || !confirmPassword.trim()) {
    return "Please confirm your password.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return "";
}

export function validateSlug(slug) {
  if (!slug || !slug.trim()) {
    return "Slug is required.";
  }

  if (!slugRegex.test(slug.trim())) {
    return "Slug can only contain lowercase letters, numbers, and hyphens.";
  }

  return "";
}

export function validateMinLength(value, minLength, fieldName = "This field") {
  if (!value || String(value).trim().length < minLength) {
    return `${fieldName} must be at least ${minLength} characters.`;
  }

  return "";
}

export function validateMaxLength(value, maxLength, fieldName = "This field") {
  if (value && String(value).trim().length > maxLength) {
    return `${fieldName} must be less than ${maxLength + 1} characters.`;
  }

  return "";
}

export function validateUrl(url, fieldName = "URL") {
  if (!url || !url.trim()) {
    return "";
  }

  try {
    new URL(url.trim());
    return "";
  } catch {
    return `Please enter a valid ${fieldName.toLowerCase()}.`;
  }
}

export function validateArticle(data = {}) {
  const errors = {};

  const titleError = validateRequired(data.title, "Title");
  if (titleError) errors.title = titleError;

  const slugRequiredError = validateRequired(data.slug, "Slug");
  if (slugRequiredError) {
    errors.slug = slugRequiredError;
  } else {
    const slugError = validateSlug(data.slug);
    if (slugError) errors.slug = slugError;
  }

  const summaryError = validateRequired(data.summary, "Summary");
  if (summaryError) errors.summary = summaryError;

  const contentError = validateRequired(data.content, "Content");
  if (contentError) errors.content = contentError;

  const categoryError = validateRequired(data.category, "Category");
  if (categoryError) errors.category = categoryError;

  const imageError = validateUrl(data.image, "image URL");
  if (imageError) errors.image = imageError;

  return errors;
}

export function validateCategory(data = {}) {
  const errors = {};

  const nameError = validateRequired(data.name, "Category name");
  if (nameError) errors.name = nameError;

  const slugRequiredError = validateRequired(data.slug, "Slug");
  if (slugRequiredError) {
    errors.slug = slugRequiredError;
  } else {
    const slugError = validateSlug(data.slug);
    if (slugError) errors.slug = slugError;
  }

  return errors;
}

export function validateTag(data = {}) {
  const errors = {};

  const nameError = validateRequired(data.name, "Tag name");
  if (nameError) errors.name = nameError;

  const slugRequiredError = validateRequired(data.slug, "Slug");
  if (slugRequiredError) {
    errors.slug = slugRequiredError;
  } else {
    const slugError = validateSlug(data.slug);
    if (slugError) errors.slug = slugError;
  }

  return errors;
}

export function validateComment(data = {}) {
  const errors = {};

  const contentError = validateRequired(data.content, "Comment");
  if (contentError) errors.content = contentError;

  const minError = validateMinLength(data.content, 2, "Comment");
  if (!contentError && minError) errors.content = minError;

  return errors;
}

export function validateNewsletterSubscription(data = {}) {
  const errors = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  return errors;
}

export function validateLogin(data = {}) {
  const errors = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  return errors;
}

export function validateSignup(data = {}) {
  const errors = {};

  const fullNameError = validateRequired(data.fullName, "Full name");
  if (fullNameError) errors.fullName = fullNameError;

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  const confirmPasswordError = validateConfirmPassword(
    data.password,
    data.confirmPassword
  );
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  return errors;
}

export function validateTimeline(data = {}) {
  const errors = {};

  const titleError = validateRequired(data.title, "Timeline title");
  if (titleError) errors.title = titleError;

  const summaryError = validateRequired(data.summary, "Timeline summary");
  if (summaryError) errors.summary = summaryError;

  const slugRequiredError = validateRequired(data.slug, "Slug");
  if (slugRequiredError) {
    errors.slug = slugRequiredError;
  } else {
    const slugError = validateSlug(data.slug);
    if (slugError) errors.slug = slugError;
  }

  return errors;
}

export function validatePoll(data = {}) {
  const errors = {};

  const questionError = validateRequired(data.question, "Poll question");
  if (questionError) errors.question = questionError;

  const cleanedOptions = Array.isArray(data.options)
    ? data.options.filter((option) => {
        if (typeof option === "string") return option.trim();
        if (option?.label) return String(option.label).trim();
        return false;
      })
    : [];

  if (cleanedOptions.length < 2) {
    errors.options = "At least 2 poll options are required.";
  }

  return errors;
}

export function hasValidationErrors(errors = {}) {
  return Object.keys(errors).length > 0;
}