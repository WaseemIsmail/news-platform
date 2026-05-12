import { fetchAllArticles } from "@/services/articleService";

function normalizeCategory(text = "") {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatCategoryName(slug = "") {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getDateValue(dateValue) {
  if (!dateValue) return 0;

  // Firestore Timestamp format
  if (dateValue?.seconds) {
    return dateValue.seconds;
  }

  // Firestore Timestamp object with toDate()
  if (dateValue?.toDate) {
    return Math.floor(dateValue.toDate().getTime() / 1000);
  }

  // ISO string / normal date
  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return 0;
  }

  return Math.floor(parsedDate.getTime() / 1000);
}

function getArticleDateValue(article) {
  return (
    getDateValue(article?.publishedAt) ||
    getDateValue(article?.createdAt) ||
    getDateValue(article?.updatedAt) ||
    0
  );
}

function isValidPublishedArticle(article) {
  const hasTitle = article?.title && article.title.trim() !== "";
  const hasSlug = article?.slug && article.slug.trim() !== "";
  const isPublished = article?.status === "published";

  return hasTitle && hasSlug && isPublished;
}

/*
====================================
Fetch All Categories With Counts
Newest updated category comes first
====================================
*/
export const fetchAllCategories = async () => {
  const articles = await fetchAllArticles();

  const categoryMap = {};

  articles.forEach((article) => {
    // Only count valid published articles
    if (!isValidPublishedArticle(article)) return;

    const categorySlug = normalizeCategory(article.category || "general");

    if (!categorySlug) return;

    const categoryName = formatCategoryName(categorySlug);
    const articleDateValue = getArticleDateValue(article);

    if (!categoryMap[categorySlug]) {
      categoryMap[categorySlug] = {
        name: categoryName,
        slug: categorySlug,
        count: 0,
        latestArticleValue: 0,
        latestArticleAt: null,
      };
    }

    categoryMap[categorySlug].count += 1;

    // Store latest article date for sorting
    if (articleDateValue > categoryMap[categorySlug].latestArticleValue) {
      categoryMap[categorySlug].latestArticleValue = articleDateValue;
      categoryMap[categorySlug].latestArticleAt =
        article.publishedAt || article.createdAt || article.updatedAt || null;
    }
  });

  return Object.values(categoryMap).sort((a, b) => {
    // Newest updated category first
    if (b.latestArticleValue !== a.latestArticleValue) {
      return b.latestArticleValue - a.latestArticleValue;
    }

    // If same date, sort alphabetically
    return a.name.localeCompare(b.name);
  });
};

/*
====================================
Fetch Articles By Category Slug
Only published articles
Newest articles first
====================================
*/
export const fetchArticlesByCategory = async (categorySlug) => {
  const articles = await fetchAllArticles();
  const normalizedCategorySlug = normalizeCategory(categorySlug);

  return articles
    .filter((article) => {
      if (!isValidPublishedArticle(article)) return false;

      return (
        normalizeCategory(article.category || "general") ===
        normalizedCategorySlug
      );
    })
    .sort((a, b) => getArticleDateValue(b) - getArticleDateValue(a));
};

/*
====================================
Fetch Single Category Details
====================================
*/
export const fetchCategoryDetails = async (categorySlug) => {
  const categories = await fetchAllCategories();
  const normalizedCategorySlug = normalizeCategory(categorySlug);

  return (
    categories.find((category) => category.slug === normalizedCategorySlug) ||
    null
  );
};