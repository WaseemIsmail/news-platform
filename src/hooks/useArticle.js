"use client";

import { useEffect, useState } from "react";
import { fetchArticleBySlug } from "@/services/articleService";

export default function useArticle(slug) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadArticle = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);

      const data = await fetchArticleBySlug(slug);

      if (!data) {
        setError("Article not found");
        setArticle(null);
      } else {
        setArticle(data);
      }
    } catch (err) {
      console.error("Error fetching article:", err);
      setError("Failed to load article");
      setArticle(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticle();
  }, [slug]);

  return {
    article,
    loading,
    error,
    refresh: loadArticle,
  };
}