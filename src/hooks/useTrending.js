"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function useTrending(limitCount = 5) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTrendingArticles();
  }, [limitCount]);

  const fetchTrendingArticles = async () => {
    try {
      setLoading(true);
      setError("");

      /**
       * Priority order:
       * 1. trendingScore
       * 2. views
       * 3. createdAt
       */

      let articlesQuery = query(
        collection(db, "articles"),
        orderBy("trendingScore", "desc"),
        limit(limitCount)
      );

      let snapshot;

      try {
        snapshot = await getDocs(articlesQuery);
      } catch {
        try {
          articlesQuery = query(
            collection(db, "articles"),
            orderBy("views", "desc"),
            limit(limitCount)
          );

          snapshot = await getDocs(articlesQuery);
        } catch {
          articlesQuery = query(
            collection(db, "articles"),
            orderBy("createdAt", "desc"),
            limit(limitCount)
          );

          snapshot = await getDocs(articlesQuery);
        }
      }

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setArticles(data);
    } catch (err) {
      console.error("Trending fetch error:", err);
      setError("Failed to load trending articles.");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    articles,
    loading,
    error,
    refreshTrending: fetchTrendingArticles,
  };
}