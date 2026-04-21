"use client";

import { useEffect, useState } from "react";
import { fetchAllArticles } from "@/services/articleService";

export default function useArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await fetchAllArticles();
      setArticles(data);
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError("Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  return {
    articles,
    loading,
    error,
    refresh: loadArticles,
  };
}