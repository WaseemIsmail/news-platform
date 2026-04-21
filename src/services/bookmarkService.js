import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/*
====================================
Add Bookmark
====================================
*/
export const addBookmark = async (userId, article) => {
  if (!userId || !article?.id) return null;

  const bookmarkRef = doc(
    db,
    "bookmarks",
    `${userId}_${article.id}`
  );

  await setDoc(bookmarkRef, {
    userId,
    articleId: article.id,
    title: article.title || "",
    slug: article.slug || "",
    summary: article.summary || "",
    category: article.category || "General",
    createdAt: serverTimestamp(),
  });

  return true;
};

/*
====================================
Remove Bookmark
====================================
*/
export const removeBookmark = async (userId, articleId) => {
  if (!userId || !articleId) return null;

  const bookmarkRef = doc(
    db,
    "bookmarks",
    `${userId}_${articleId}`
  );

  await deleteDoc(bookmarkRef);

  return true;
};

/*
====================================
Fetch User Bookmarks
====================================
*/
export const fetchUserBookmarks = async (userId) => {
  if (!userId) return [];

  const bookmarksRef = collection(db, "bookmarks");

  const q = query(
    bookmarksRef,
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/*
====================================
Check Bookmark Exists
====================================
*/
export const isBookmarked = async (userId, articleId) => {
  if (!userId || !articleId) return false;

  const bookmarkId = `${userId}_${articleId}`;
  const bookmarkRef = doc(db, "bookmarks", bookmarkId);

  const snapshot = await getDocs(
    query(
      collection(db, "bookmarks"),
      where("__name__", "==", bookmarkId)
    )
  );

  return !snapshot.empty;
};