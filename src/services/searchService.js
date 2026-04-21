import { fetchAllArticles } from "@/services/articleService";

/*
====================================
Normalize text for search
====================================
*/
function normalizeText(text = "") {
  return text.toLowerCase().trim();
}

/*
====================================
Search Articles
====================================
*/
export const searchArticles = async (query) => {
  const articles = await fetchAllArticles();

  const searchTerm = normalizeText(query);

  if (!searchTerm) {
    return articles;
  }

  return articles.filter((article) => {
    const title = normalizeText(article.title || "");
    const summary = normalizeText(article.summary || "");
    const content = normalizeText(article.content || "");
    const category = normalizeText(article.category || "");
    const author = normalizeText(article.author || "");

    const tags = Array.isArray(article.tags)
      ? article.tags.map((tag) => normalizeText(tag)).join(" ")
      : "";

    return (
      title.includes(searchTerm) ||
      summary.includes(searchTerm) ||
      content.includes(searchTerm) ||
      category.includes(searchTerm) ||
      author.includes(searchTerm) ||
      tags.includes(searchTerm)
    );
  });
};

/*
====================================
Search Suggestions
====================================
*/
export const fetchSearchSuggestions = async (query) => {
  const results = await searchArticles(query);

  return results.slice(0, 5).map((article) => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    category: article.category || "General",
  }));
};