"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import useAuth from "@/hooks/useAuth";

export default function useBookmarks() {
  const { user, loading: authLoading } = useAuth();

  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkIds, setBookmarkIds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!user?.uid) {
      setBookmarks([]);
      setBookmarkIds([]);
      setLoading(false);
      return;
    }

    fetchBookmarks();
  }, [user?.uid, authLoading]);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      setError("");

      const bookmarksQuery = query(
        collection(db, "bookmarks"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(bookmarksQuery);

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setBookmarks(data);
      setBookmarkIds(data.map((item) => item.articleId));
    } catch (err) {
      console.error("Bookmarks fetch error:", err);
      setError("Failed to load bookmarks.");
    } finally {
      setLoading(false);
    }
  };

  const isBookmarked = (articleId) => {
    return bookmarkIds.includes(articleId);
  };

  const addBookmark = async (article) => {
    if (!user?.uid || !article?.id) return;

    try {
      setError("");

      if (isBookmarked(article.id)) return;

      const payload = {
        userId: user.uid,
        articleId: article.id,
        articleSlug: article.slug || "",
        articleTitle: article.title || "",
        articleImage: article.image || "",
        category: article.category || "",
        author: article.author || "",
        publishedAt: article.publishedAt || null,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, "bookmarks"),
        payload
      );

      setBookmarks((prev) => [
        {
          id: docRef.id,
          ...payload,
        },
        ...prev,
      ]);

      setBookmarkIds((prev) => [...prev, article.id]);
    } catch (err) {
      console.error("Add bookmark error:", err);
      setError("Failed to save bookmark.");
    }
  };

  const removeBookmark = async (articleId) => {
    if (!user?.uid || !articleId) return;

    try {
      setError("");

      const target = bookmarks.find(
        (item) => item.articleId === articleId
      );

      if (!target?.id) return;

      await deleteDoc(doc(db, "bookmarks", target.id));

      setBookmarks((prev) =>
        prev.filter((item) => item.articleId !== articleId)
      );

      setBookmarkIds((prev) =>
        prev.filter((id) => id !== articleId)
      );
    } catch (err) {
      console.error("Remove bookmark error:", err);
      setError("Failed to remove bookmark.");
    }
  };

  const toggleBookmark = async (article) => {
    if (!article?.id) return;

    if (isBookmarked(article.id)) {
      await removeBookmark(article.id);
    } else {
      await addBookmark(article);
    }
  };

  return {
    bookmarks,
    bookmarkIds,
    loading,
    error,

    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    refreshBookmarks: fetchBookmarks,
  };
}