"use client";

import { useEffect, useState } from "react";
import {
  createComment,
  fetchCommentsByArticle,
  removeComment,
} from "@/services/commentService";

export default function useComments(articleId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadComments = async () => {
    if (!articleId) return;

    try {
      setLoading(true);
      setError("");

      const data = await fetchCommentsByArticle(articleId);
      setComments(data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (commentData) => {
    try {
      await createComment(commentData);
      await loadComments();
    } catch (err) {
      console.error("Failed to create comment:", err);
      throw err;
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await removeComment(commentId);
      await loadComments();
    } catch (err) {
      console.error("Failed to delete comment:", err);
      throw err;
    }
  };

  useEffect(() => {
    loadComments();
  }, [articleId]);

  return {
    comments,
    loading,
    error,
    addComment,
    deleteComment,
    refreshComments: loadComments,
  };
}