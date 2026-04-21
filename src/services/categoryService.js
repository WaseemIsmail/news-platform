import { fetchAllArticles } from "@/services/articleService";

function normalizeCategory(text = "") {
  return text.toLowerCase().replace(/\s+/g, "-").trim();
}

/*
====================================
Fetch All Categories With Counts
====================================
*/
export const fetchAllCategories = async () => {
  const articles = await fetchAllArticles();

  const categoryMap = {};

  articles.forEach((article) => {
    const categoryName = article.category || "General";
    const slug = normalizeCategory(categoryName);

    if (!categoryMap[slug]) {
      categoryMap[slug] = {
        name: categoryName,
        slug,
        count: 0,
      };
    }

    categoryMap[slug].count += 1;
  });

  return Object.values(categoryMap).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};

/*
====================================
Fetch Articles By Category Slug
====================================
*/
export const fetchArticlesByCategory = async (categorySlug) => {
  const articles = await fetchAllArticles();

  return articles.filter(
    (article) =>
      normalizeCategory(article.category || "General") === categorySlug
  );
};

/*
====================================
Fetch Single Category Details
====================================
*/
export const fetchCategoryDetails = async (categorySlug) => {
  const categories = await fetchAllCategories();

  return categories.find((category) => category.slug === categorySlug) || null;
};