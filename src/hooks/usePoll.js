"use client";

import { useEffect, useState } from "react";
import {
  createPoll,
  fetchPollByArticle,
  voteOnPoll,
  fetchPollResults,
} from "@/services/pollService";

export default function usePoll(articleId, defaultOptions = []) {
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPoll = async () => {
    if (!articleId) return;

    try {
      setLoading(true);
      setError("");

      let existingPoll = await fetchPollByArticle(articleId);

      if (!existingPoll && defaultOptions.length > 0) {
        existingPoll = await createPoll(articleId, defaultOptions);
      }

      const results = await fetchPollResults(articleId);
      setPoll(results || existingPoll);
    } catch (err) {
      console.error("Failed to load poll:", err);
      setError("Failed to load poll.");
    } finally {
      setLoading(false);
    }
  };

  const submitVote = async (selectedOption) => {
    try {
      await voteOnPoll(articleId, selectedOption);
      await loadPoll();
    } catch (err) {
      console.error("Failed to submit vote:", err);
      throw err;
    }
  };

  useEffect(() => {
    loadPoll();
  }, [articleId]);

  return {
    poll,
    loading,
    error,
    submitVote,
    refreshPoll: loadPoll,
  };
}