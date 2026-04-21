export default function calculateTrending(article = {}) {
  const views = article.views || 0;
  const reactions = article.reactionsCount || 0;
  const comments = article.commentsCount || 0;
  const shares = article.sharesCount || 0;

  return views + reactions * 2 + comments * 3 + shares * 2;
}