import {
  createCommentDoc,
  getCommentsByArticleId,
  deleteCommentDoc,
} from "@/lib/firestore";

/*
====================================
Create New Comment / Reply
====================================
*/
export const createComment = async (commentData) => {
  const payload = {
    articleId: commentData.articleId,
    parentId: commentData.parentId || null,
    name: commentData.name || "Anonymous",
    comment: commentData.comment || "",
    likes: 0,
    approved: true,
  };

  return await createCommentDoc(payload);
};

/*
====================================
Fetch Comments by Article
====================================
*/
export const fetchCommentsByArticle = async (articleId) => {
  const comments = await getCommentsByArticleId(articleId);

  const parentComments = comments.filter(
    (comment) => !comment.parentId
  );

  const replies = comments.filter(
    (comment) => comment.parentId
  );

  const structuredComments = parentComments.map((parent) => ({
    ...parent,
    replies: replies.filter(
      (reply) => reply.parentId === parent.id
    ),
  }));

  return structuredComments;
};

/*
====================================
Delete Comment
====================================
*/
export const removeComment = async (commentId) => {
  return await deleteCommentDoc(commentId);
};