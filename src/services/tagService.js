import { fetchAllArticles } from "@/services/articleService";

function normalizeTag(text = "") {
  return text.toLowerCase().replace(/\s+/g, "-").trim();
}

/*
====================================
Fetch All Tags With Counts
====================================
*/
export const fetchAllTags = async () => {
  const articles = await fetchAllArticles();

  const tagMap = {};

  articles.forEach((article) => {
    if (!Array.isArray(article.tags)) return;

    article.tags.forEach((tag) => {
      const tagName = tag.trim();
      if (!tagName) return;

      const slug = normalizeTag(tagName);

      if (!tagMap[slug]) {
        tagMap[slug] = {
          name: tagName,
          slug,
          count: 0,
        };
      }

      tagMap[slug].count += 1;
    });
  });

  return Object.values(tagMap).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};

/*
====================================
Fetch Articles By Tag Slug
====================================
*/
export const fetchArticlesByTag = async (tagSlug) => {
  const articles = await fetchAllArticles();

  return articles.filter((article) => {
    if (!Array.isArray(article.tags)) return false;

    return article.tags.some(
      (tag) => normalizeTag(tag) === tagSlug
    );
  });
};

/*
====================================
Fetch Single Tag Details
====================================
*/
export const fetchTagDetails = async (tagSlug) => {
  const tags = await fetchAllTags();

  return tags.find((tag) => tag.slug === tagSlug) || null;
};