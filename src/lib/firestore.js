import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

/* =========================
   Helpers
========================= */

export const generateSlug = (value = "") => {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .split("-")
    .filter(Boolean)
    .slice(0, 8)
    .join("-");
};

const normalizeCategory = (category = "") => {
  return generateSlug(category);
};

const formatFirestoreDate = (value) => {
  if (!value) return null;

  if (value?.toDate) {
    return value.toDate().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return value;
};

const mapDoc = (item) => {
  const data = item.data();

  return {
    id: item.id,
    ...data,
    createdAt: formatFirestoreDate(data.createdAt),
    updatedAt: formatFirestoreDate(data.updatedAt),
    publishedAt: formatFirestoreDate(data.publishedAt || data.createdAt),
  };
};

const getArticleOrderField = () => {
  return "createdAt";
};

/* =========================
   Articles
========================= */

export const articlesCollection = collection(db, "articles");

export const createArticleDoc = async (data) => {
  const slug = data?.slug?.trim()
    ? generateSlug(data.slug)
    : generateSlug(data?.title || "");

  const category = normalizeCategory(data?.category || "");

  return await addDoc(articlesCollection, {
    ...data,
    slug,
    category,
    status: data?.status || "published",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: data?.publishedAt || serverTimestamp(),
  });
};

export const getArticleById = async (id) => {
  const ref = doc(db, "articles", id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return mapDoc(snapshot);
};

export const getAllArticles = async () => {
  try {
    const q = query(articlesCollection, orderBy(getArticleOrderField(), "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(mapDoc);
  } catch (error) {
    console.error("getAllArticles error:", error);
    return [];
  }
};

export const getPublishedArticles = async () => {
  try {
    const q = query(
      articlesCollection,
      where("status", "==", "published"),
      orderBy(getArticleOrderField(), "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(mapDoc);
  } catch (error) {
    console.error("getPublishedArticles error:", error);
    return [];
  }
};

export const getArticleBySlug = async (slug) => {
  try {
    const normalizedSlug = generateSlug(slug);

    const q = query(
      articlesCollection,
      where("slug", "==", normalizedSlug),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    return mapDoc(snapshot.docs[0]);
  } catch (error) {
    console.error("getArticleBySlug error:", error);
    return null;
  }
};

export const getArticlesByCategory = async (category) => {
  try {
    const q = query(
      articlesCollection,
      where("category", "==", category),
      where("status", "==", "published")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
  } catch (error) {
    console.error("getArticlesByCategory error:", error);
    return [];
  }
};

export const getHomepageArticles = async () => {
  try {
    const q = query(
      articlesCollection,
      where("status", "==", "published"),
      where("showOnHomepage", "==", true)
    );

    const snapshot = await getDocs(q);

    const articles = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    return articles
      .sort((a, b) => (a.homepageOrder || 999) - (b.homepageOrder || 999))
      .slice(0, 3);
  } catch (error) {
    console.error("getHomepageArticles error:", error);
    return [];
  }
};

/* =========================
   Page Specific Article Fetchers
========================= */

export const getOpinionArticles = async () => {
  try {
    const q = query(
      articlesCollection,
      where("category", "==", "opinion"),
      where("status", "==", "published")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
  } catch (error) {
    console.error("getOpinionArticles error:", error);
    return [];
  }
};

export const getSportsArticles = async () => {
  try {
    const q = query(
      articlesCollection,
      where("category", "==", "sports"),
      where("status", "==", "published")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
  } catch (error) {
    console.error("getSportsArticles error:", error);
    return [];
  }
};

export const getFactCheckArticles = async () => {
  try {
    const q = query(
      articlesCollection,
      where("category", "==", "fact-check"),
      where("status", "==", "published")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
  } catch (error) {
    console.error("getFactCheckArticles error:", error);
    return [];
  }
};

export const getLatestArticles = async () => {
  try {
    const q = query(
      articlesCollection,
      where("status", "==", "published"),
      orderBy(getArticleOrderField(), "desc"),
      limit(12)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(mapDoc);
  } catch (error) {
    console.error("getLatestArticles error:", error);
    return [];
  }
};

export const getTrendingArticles = async () => {
  try {
    const q = query(
      articlesCollection,
      where("status", "==", "published"),
      orderBy("views", "desc"),
      limit(12)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(mapDoc);
  } catch (error) {
    console.error("getTrendingArticles error:", error);
    return [];
  }
};

export const updateArticleDoc = async (id, data) => {
  const ref = doc(db, "articles", id);

  const updatedPayload = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  if (data?.title || data?.slug) {
    updatedPayload.slug = data?.slug?.trim()
      ? generateSlug(data.slug)
      : generateSlug(data.title || "");
  }

  if (data?.category) {
    updatedPayload.category = normalizeCategory(data.category);
  }

  await updateDoc(ref, updatedPayload);
};

export const deleteArticleDoc = async (id) => {
  const ref = doc(db, "articles", id);
  await deleteDoc(ref);
};

/* =========================
   Categories
========================= */

export const categoriesCollection = collection(db, "categories");

export const getAllCategories = async () => {
  try {
    const snapshot = await getDocs(categoriesCollection);

    return snapshot.docs
      .map(mapDoc)
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  } catch (error) {
    console.error("getAllCategories error:", error);
    return [];
  }
};

/* =========================
   Tags
========================= */

export const tagsCollection = collection(db, "tags");

export const getAllTags = async () => {
  try {
    const snapshot = await getDocs(collection(db, "tags"));

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
  } catch (error) {
    console.error("getAllTags error:", error);
    return [];
  }
};

export const getArticlesByTag = async (tagSlug) => {
  try {
    const normalizedTag = generateSlug(tagSlug);

    const q = query(
      articlesCollection,
      where("tags", "array-contains", normalizedTag),
      where("status", "==", "published"),
      orderBy(getArticleOrderField(), "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(mapDoc);
  } catch (error) {
    console.error("getArticlesByTag error:", error);
    return [];
  }
};

/* =========================
   Timeline
========================= */

export const timelinesCollection = collection(db, "timelines");

export const getTimelineBySlug = async (slug) => {
  try {
    const normalizedSlug = generateSlug(slug);

    const q = query(
      timelinesCollection,
      where("slug", "==", normalizedSlug),
      where("status", "==", "published"),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    return mapDoc(snapshot.docs[0]);
  } catch (error) {
    console.error("getTimelineBySlug error:", error);
    return null;
  }
};

export const getAllTimelines = async () => {
  try {
    const snapshot = await getDocs(timelinesCollection);

    return snapshot.docs
      .map((item) => ({
        id: item.id,
        ...item.data(),
      }))
      .filter((timeline) => timeline.status === "published");
  } catch (error) {
    console.error("getAllTimelines error:", error);
    return [];
  }
};

/* =========================
   Comments
========================= */

export const commentsCollection = collection(db, "comments");

export const createCommentDoc = async (data) => {
  return await addDoc(commentsCollection, {
    articleId: data.articleId || "",
    articleSlug: data.articleSlug || "",
    articleTitle: data.articleTitle || "",

    userId: data.userId || "",
    userEmail: data.userEmail || "",

    name: data.name || "Anonymous",
    comment: data.comment || "",

    parentId: data.parentId || null,

    likes: data.likes || 0,
    likedUsers: data.likedUsers || [],

    status: data.status || "approved",

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const getCommentsByArticleId = async (articleId) => {
  try {
    const q = query(
      commentsCollection,
      where("articleId", "==", articleId),
      orderBy("createdAt", "asc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs
      .map(mapDoc)
      .filter((comment) => comment.status !== "rejected");
  } catch (error) {
    console.error("getCommentsByArticleId error:", error);
    return [];
  }
};

export const getRepliesByParentId = async (parentId) => {
  try {
    const q = query(
      commentsCollection,
      where("parentId", "==", parentId),
      orderBy("createdAt", "asc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs
      .map(mapDoc)
      .filter((reply) => reply.status !== "rejected");
  } catch (error) {
    console.error("getRepliesByParentId error:", error);
    return [];
  }
};

export const getAllComments = async () => {
  try {
    const q = query(commentsCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(mapDoc);
  } catch (error) {
    console.error("getAllComments error:", error);
    return [];
  }
};

export const updateCommentStatus = async (id, status) => {
  try {
    const ref = doc(db, "comments", id);

    await updateDoc(ref, {
      status,
      updatedAt: serverTimestamp(),
      moderatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("updateCommentStatus error:", error);
    throw error;
  }
};

export const updateCommentLikes = async (commentId, likes, likedUsers = []) => {
  try {
    if (!commentId) {
      throw new Error("Comment ID is required.");
    }

    const ref = doc(db, "comments", commentId);

    await updateDoc(ref, {
      likes: Number(likes || 0),
      likedUsers: Array.isArray(likedUsers) ? likedUsers : [],
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("updateCommentLikes error:", error);
    throw error;
  }
};

export const deleteCommentDoc = async (id) => {
  try {
    const ref = doc(db, "comments", id);
    await deleteDoc(ref);
  } catch (error) {
    console.error("deleteCommentDoc error:", error);
    throw error;
  }
};

/* =========================
   Reactions
========================= */

export const reactionsCollection = collection(db, "reactions");

export const createReactionDoc = async (data) => {
  return await addDoc(reactionsCollection, {
    articleId: data.articleId || "",
    userId: data.userId || "",
    reaction: data.reaction || "",

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateReactionDoc = async (id, reaction) => {
  try {
    const ref = doc(db, "reactions", id);

    await updateDoc(ref, {
      reaction,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("updateReactionDoc error:", error);
    throw error;
  }
};

export const deleteReactionDoc = async (id) => {
  try {
    const ref = doc(db, "reactions", id);
    await deleteDoc(ref);
  } catch (error) {
    console.error("deleteReactionDoc error:", error);
    throw error;
  }
};

export const getReactionsByArticleId = async (articleId) => {
  try {
    const q = query(
      reactionsCollection,
      where("articleId", "==", articleId)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(mapDoc);
  } catch (error) {
    console.error("getReactionsByArticleId error:", error);
    return [];
  }
};

/* =========================
   Polls
========================= */

export const pollsCollection = collection(db, "polls");

export const getPollById = async (id) => {
  try {
    if (!id) return null;

    const ref = doc(db, "polls", id);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) return null;

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  } catch (error) {
    console.error("getPollById error:", error);
    return null;
  }
};

export const getActivePolls = async () => {
  try {
    const q = query(
      collection(db, "polls"),
      where("status", "==", "active")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
  } catch (error) {
    console.error("getActivePolls error:", error);
    return [];
  }
};