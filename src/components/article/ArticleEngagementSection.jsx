"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createCommentDoc,
  deleteCommentDoc,
  getCommentsByArticleId,
} from "@/lib/firestore";

import ReactionBar from "./ReactionBar";
import ShareBar from "./ShareBar";
import TopCommentCard from "@/components/comments/TopCommentCard";
import CommentBox from "@/components/comments/CommentBox";
import CommentList from "@/components/comments/CommentList";

export default function ArticleEngagementSection({ article }) {
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    if (!article?.id) return;
    fetchComments();
  }, [article?.id]);

  const fetchComments = async () => {
    try {
      setLoadingComments(true);

      const data = await getCommentsByArticleId(article.id);

      const rootComments = [];
      const repliesMap = {};

      (data || []).forEach((item) => {
        if (item.parentId) {
          if (!repliesMap[item.parentId]) {
            repliesMap[item.parentId] = [];
          }
          repliesMap[item.parentId].push(item);
        } else {
          rootComments.push(item);
        }
      });

      const nestedComments = rootComments.map((comment) => ({
        ...comment,
        replies: repliesMap[comment.id] || [],
      }));

      setComments(nestedComments);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCommentSubmit = async (payload) => {
    await createCommentDoc({
      articleId: article.id,
      articleSlug: article.slug || "",
      articleTitle: article.title || "",
      name: payload.name,
      comment: payload.comment,
      parentId: payload.parentId || null,
      likes: 0,
    });

    await fetchComments();
  };

  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirmed) return;

    try {
      await deleteCommentDoc(commentId);
      await fetchComments();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const topComment = useMemo(() => {
    if (!comments.length) return null;

    return [...comments].sort((a, b) => (b.likes || 0) - (a.likes || 0))[0];
  }, [comments]);

  return (
    <>
      <ReactionBar articleId={article.id} />
      <ShareBar article={article} />
      <TopCommentCard comment={topComment} />
      <CommentBox articleId={article.id} onSubmit={handleCommentSubmit} />

      {loadingComments ? (
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">Loading comments...</p>
        </section>
      ) : (
        <CommentList
          comments={comments}
          onReply={handleCommentSubmit}
          onDelete={handleDeleteComment}
        />
      )}
    </>
  );
}