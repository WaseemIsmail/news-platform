import { fetchAllArticles, fetchArticleBySlug } from "@/services/articleService";

/*
====================================
Build Default Timeline
====================================
*/
function buildDefaultTimeline(article) {
  return [
    {
      year: "Background",
      title: "Earlier Developments",
      description:
        "Historical events and background context related to this story can be added here.",
    },
    {
      year: "Current",
      title: article?.title || "Current Situation",
      description:
        article?.summary ||
        "Current event summary and the latest important developments.",
    },
    {
      year: "Next",
      title: "Possible Future Outcome",
      description:
        "Expected next phase, impact, and future developments can be described here.",
    },
  ];
}

/*
====================================
Fetch Timeline By Article Slug
====================================
*/
export const fetchTimelineBySlug = async (slug) => {
  const article = await fetchArticleBySlug(slug);

  if (!article) return null;

  return {
    article,
    timeline:
      Array.isArray(article.timeline) && article.timeline.length > 0
        ? article.timeline
        : buildDefaultTimeline(article),
  };
};

/*
====================================
Fetch All Timeline Supported Articles
====================================
*/
export const fetchAllTimelineArticles = async () => {
  const articles = await fetchAllArticles();

  return articles.map((article) => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    category: article.category || "General",
    hasCustomTimeline:
      Array.isArray(article.timeline) && article.timeline.length > 0,
  }));
};

/*
====================================
Update Timeline (Admin Future Use)
====================================
*/
export const prepareTimelinePayload = (timelineItems = []) => {
  return timelineItems.map((item, index) => ({
    id: index + 1,
    year: item.year || "",
    title: item.title || "",
    description: item.description || "",
  }));
};