"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

function buildNestedComments(data) {
  const visibleComments = (data || []).filter((item) => item.status !== "rejected");
  const commentsMap = {};
  const rootComments = [];

  visibleComments.forEach((item) => {
    commentsMap[item.id] = { ...item, replies: [] };
  });

  visibleComments.forEach((item) => {
    if (item.parentId && commentsMap[item.parentId]) commentsMap[item.parentId].replies.push(commentsMap[item.id]);
    else if (!item.parentId) rootComments.push(commentsMap[item.id]);
  });

  return rootComments;
}

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

  const fetchComments = useCallback(async () => {
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
  }, [article.id]);

  const fetchReactions = useCallback(async () => {
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
  }, [article.id, user?.uid]);

  useEffect(() => {
    if (!article?.id) return;
    fetchComments();
    fetchReactions();
  }, [article?.id, fetchComments, fetchReactions]);

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
    if (!user?.uid) return;

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

  const totalComments = useMemo(() => flattenComments(comments).length, [comments]);

  return (
    <section id="conversation" className="mt-16 scroll-mt-28 border-t border-slate-200 pt-10 dark:border-slate-800" aria-labelledby="conversation-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-700 dark:text-amber-400">Reader community</p>
          <h2 id="conversation-title" className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">Join the conversation</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">React quickly or contribute a considered response to the reporting.</p>
        </div>
        <a href="#reader-comments-title" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900">
          Read {commentsLoading ? "comments" : `${totalComments} ${totalComments === 1 ? "comment" : "comments"}`}
        </a>
      </div>

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
        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-600 dark:text-slate-300">Loading comments...</p>
        </section>
      ) : (
        <CommentList
          comments={comments}
          totalCount={totalComments}
          user={user}
          onReply={handleCommentSubmit}
          onDelete={handleDeleteComment}
          onLike={handleLikeComment}
        />
      )}
    </section>
  );
}
