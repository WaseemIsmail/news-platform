"use client";

import { useEffect, useState } from "react";
import {
  createReaction,
  fetchReactionsByArticle,
} from "@/services/reactionService";

export default function useReactions(articleId) {
  const [reactions, setReactions] = useState({
    support: 0,
    against: 0,
    neutral: 0,
    need_more_info: 0,
    total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReactions = async () => {
    if (!articleId) return;

    try {
      setLoading(true);
      setError("");

      const data = await fetchReactionsByArticle(articleId);
      setReactions(data);
    } catch (err) {
      console.error("Failed to fetch reactions:", err);
      setError("Failed to load reactions.");
    } finally {
      setLoading(false);
    }
  };

  const addReaction = async (reactionType, userName = "Anonymous") => {
    try {
      await createReaction({
        articleId,
        reactionType,
        userName,
      });

      await loadReactions();
    } catch (err) {
      console.error("Failed to save reaction:", err);
      throw err;
    }
  };

  useEffect(() => {
    loadReactions();
  }, [articleId]);

  return {
    reactions,
    loading,
    error,
    addReaction,
    refreshReactions: loadReactions,
  };
}