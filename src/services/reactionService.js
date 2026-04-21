import {
  createReactionDoc,
  getReactionsByArticleId,
} from "@/lib/firestore";

/*
====================================
Save User Reaction
====================================
*/
export const createReaction = async (reactionData) => {
  const payload = {
    articleId: reactionData.articleId,
    reactionType: reactionData.reactionType || "neutral",
    userName: reactionData.userName || "Anonymous",
    createdAt: new Date(),
  };

  return await createReactionDoc(payload);
};

/*
====================================
Fetch Reactions by Article
====================================
*/
export const fetchReactionsByArticle = async (articleId) => {
  const reactions = await getReactionsByArticleId(articleId);

  const reactionSummary = {
    support: 0,
    against: 0,
    neutral: 0,
    need_more_info: 0,
    total: 0,
  };

  reactions.forEach((reaction) => {
    if (reactionSummary[reaction.reactionType] !== undefined) {
      reactionSummary[reaction.reactionType] += 1;
    }

    reactionSummary.total += 1;
  });

  return reactionSummary;
};