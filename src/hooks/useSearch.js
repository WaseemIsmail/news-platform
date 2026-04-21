"use client";

import { useEffect, useState } from "react";
import {
  searchArticles,
  fetchSearchSuggestions,
} from "@/services/searchService";

export default function useSearch(query = "") {
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runSearch = async () => {
    try {
      setLoading(true);
      setError("");

      const [articles, suggestionList] = await Promise.all([
        searchArticles(query),
        fetchSearchSuggestions(query),
      ]);

      setResults(articles);
      setSuggestions(suggestionList);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to search articles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSearch();
  }, [query]);

  return {
    results,
    suggestions,
    loading,
    error,
    refreshSearch: runSearch,
  };
}