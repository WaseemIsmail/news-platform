"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createCommentDoc,
  deleteCommentDoc,
  getCommentsByArticleId,
  getReactionsByArticleId,
  createReactionDoc,
  updateCommentLikes,
} from "@/lib/firestore";

import { doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

import { db } from "@/lib/firebase";

import ReactionBar from "@/components/article/ReactionBar";
import ShareBar from "@/components/article/ShareBar";
import TopCommentCard from "@/components/comments/TopCommentCard";
import CommentBox from "@/components/comments/CommentBox";
import CommentList from "@/components/comments/CommentList";
import { useAuthContext } from "@/context/AuthContext";

export default function ArticleEngagementSection({ article }) {
  const { user } = useAuthContext();

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);

  const [reactionCounts, setReactionCounts] = useState({
    support: 0,
    against: 0,
    neutral: 0,
    need_more_info: 0,
  });

  const [userReaction, setUserReaction] = useState(null);

  useEffect(() => {
    if (!article?.id) return;

    fetchComments();
    fetchReactions();
  }, [article?.id, user?.uid]);

  const buildNestedComments = (data) => {
    const visibleComments = (data || []).filter(
      (item) => item.status !== "rejected"
    );

    const commentsMap = {};
    const rootComments = [];

    visibleComments.forEach((item) => {
      commentsMap[item.id] = {
        ...item,
        replies: [],
      };
    });

    visibleComments.forEach((item) => {
      if (item.parentId && commentsMap[item.parentId]) {
        commentsMap[item.parentId].replies.push(commentsMap[item.id]);
      } else if (!item.parentId) {
        rootComments.push(commentsMap[item.id]);
      }
    });

    return rootComments;
  };

  const updateNestedCommentLike = (
    commentList,
    commentId,
    updatedLikes,
    updatedLikedUsers
  ) => {
    return commentList.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: updatedLikes,
          likedUsers: updatedLikedUsers,
        };
      }

      if (comment.replies?.length) {
        return {
          ...comment,
          replies: updateNestedCommentLike(
            comment.replies,
            commentId,
            updatedLikes,
            updatedLikedUsers
          ),
        };
      }

      return comment;
    });
  };

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);

      const data = await getCommentsByArticleId(article.id);
      const nestedComments = buildNestedComments(data);

      setComments(nestedComments);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const fetchReactions = async () => {
    try {
      const data = await getReactionsByArticleId(article.id);

      const counts = {
        support: 0,
        against: 0,
        neutral: 0,
        need_more_info: 0,
      };

      let currentUserReaction = null;

      (data || []).forEach((item) => {
        if (counts[item.reaction] !== undefined) {
          counts[item.reaction] += 1;
        }

        if (user?.uid && item.userId === user.uid) {
          currentUserReaction = item.reaction;
        }
      });

      setReactionCounts(counts);
      setUserReaction(currentUserReaction);
    } catch (error) {
      console.error("Failed to fetch reactions:", error);
    }
  };

  const handleCommentSubmit = async (payload) => {
    try {
      await createCommentDoc({
        articleId: article.id,
        articleSlug: article.slug || "",
        articleTitle: article.title || "",
        userId: user?.uid || "",
        userEmail: user?.email || "",
        name:
          payload.name ||
          user?.displayName ||
          user?.fullName ||
          user?.name ||
          user?.email?.split("@")[0] ||
          "Anonymous",
        comment: payload.comment || "",
        parentId: payload.parentId || null,
        likes: 0,
        likedUsers: [],
        status: "approved",
      });

      await fetchComments();
    } catch (error) {
      console.error("Failed to submit comment/reply:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      if (!commentId || typeof commentId !== "string") {
        console.error("Invalid comment ID:", commentId);
        return;
      }

      await deleteCommentDoc(commentId);
      await fetchComments();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleLikeComment = async (comment) => {
    if (!user?.uid) {
      alert("Please login to like comments.");
      return;
    }

    if (!comment?.id || typeof comment.id !== "string") {
      console.error("Invalid comment object:", comment);
      return;
    }

    try {
      const likedUsers = Array.isArray(comment.likedUsers)
        ? comment.likedUsers
        : [];

      const alreadyLiked = likedUsers.includes(user.uid);

      const updatedLikedUsers = alreadyLiked
        ? likedUsers.filter((id) => id !== user.uid)
        : [...likedUsers, user.uid];

      const updatedLikes = alreadyLiked
        ? Math.max(Number(comment.likes || 0) - 1, 0)
        : Number(comment.likes || 0) + 1;

      await updateCommentLikes(
        comment.id,
        updatedLikes,
        updatedLikedUsers
      );

      setComments((prev) =>
        updateNestedCommentLike(
          prev,
          comment.id,
          updatedLikes,
          updatedLikedUsers
        )
      );
    } catch (error) {
      console.error("Failed to like/unlike comment:", error);
      await fetchComments();
    }
  };

  const handleReact = async ({ articleId, reaction, userId }) => {
    if (!userId) return;

    try {
      const existingReactions = await getReactionsByArticleId(articleId);

      const existing = (existingReactions || []).find(
        (item) => item.userId === userId
      );

      if (!existing) {
        await createReactionDoc({
          articleId,
          userId,
          reaction,
        });

        setUserReaction(reaction);
      } else if (existing.reaction === reaction) {
        await deleteDoc(doc(db, "reactions", existing.id));
        setUserReaction(null);
      } else {
        await updateDoc(doc(db, "reactions", existing.id), {
          reaction,
          updatedAt: serverTimestamp(),
        });

        setUserReaction(reaction);
      }

      await fetchReactions();
    } catch (error) {
      console.error("Reaction update failed:", error);
    }
  };

  const flattenComments = (items) => {
    const result = [];

    const walk = (list) => {
      list.forEach((item) => {
        result.push(item);

        if (item.replies?.length) {
          walk(item.replies);
        }
      });
    };

    walk(items);
    return result;
  };

  const topComment = useMemo(() => {
    const allComments = flattenComments(comments);

    if (!allComments.length) return null;

    return [...allComments].sort(
      (a, b) => Number(b.likes || 0) - Number(a.likes || 0)
    )[0];
  }, [comments]);

  return (
    <>
      <ReactionBar
        articleId={article.id}
        reactionCounts={reactionCounts}
        userReaction={userReaction}
        onReact={handleReact}
      />

      <ShareBar article={article} />

      <TopCommentCard comment={topComment} />

      <CommentBox articleId={article.id} onSubmit={handleCommentSubmit} />

      {commentsLoading ? (
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">Loading comments...</p>
        </section>
      ) : (
        <CommentList
          comments={comments}
          user={user}
          onReply={handleCommentSubmit}
          onDelete={handleDeleteComment}
          onLike={handleLikeComment}
        />
      )}
    </>
  );
}