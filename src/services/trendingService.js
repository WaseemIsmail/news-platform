import { fetchAllArticles } from "@/services/articleService";

/*
====================================
Calculate Trending Score
====================================
Trending score can be improved later using:
- views
- reactions
- comments
- shares
- recency
====================================
*/
export function calculateTrendingScore(article) {
  const views = article.views || 0;
  const reactions = article.reactionsCount || 0;
  const comments = article.commentsCount || 0;
  const shares = article.sharesCount || 0;

  return views + reactions * 2 + comments * 3 + shares * 2;
}

/*
====================================
Fetch Trending Articles
====================================
*/
export const fetchTrendingArticles = async () => {
  const articles = await fetchAllArticles();

  const sortedArticles = articles
    .filter((article) => article?.status === "published" && article?.slug && article?.title)
    .sort((a, b) => {
    const scoreA = calculateTrendingScore(a);
    const scoreB = calculateTrendingScore(b);

    if (scoreB !== scoreA) return scoreB - scoreA;

    const dateA = a.publishedAt?.seconds || a.createdAt?.seconds || 0;
    const dateB = b.publishedAt?.seconds || b.createdAt?.seconds || 0;
    return dateB - dateA;
  });

  return sortedArticles;
};

/*
====================================
Fetch Top Featured Trending
====================================
*/
export const fetchTopTrendingArticle = async () => {
  const articles = await fetchTrendingArticles();

  return articles.length > 0 ? articles[0] : null;
};
