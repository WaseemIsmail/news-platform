"use client";

import { useEffect, useState } from "react";
import { fetchTimelineBySlug } from "@/services/timelineService";

export default function useTimeline(slug) {
  const [timelineData, setTimelineData] = useState(null);
  const [timelineItems, setTimelineItems] = useState([]);
  const [article, setArticle] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTimeline = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError("");

      const data = await fetchTimelineBySlug(slug);

      if (!data) {
        setError("Timeline not found.");
        setTimelineData(null);
        setTimelineItems([]);
        setArticle(null);
        return;
      }

      setTimelineData(data);
      setTimelineItems(data.timeline || []);
      setArticle(data.article || null);
    } catch (err) {
      console.error("Failed to load timeline:", err);
      setError("Failed to load timeline.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimeline();
  }, [slug]);

  return {
    timelineData,
    timelineItems,
    article,
    loading,
    error,
    refreshTimeline: loadTimeline,
  };
}