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
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .split("-")
    .filter(Boolean)
    .slice(0, 6)
    .join("-");
};

/* =========================
   Articles
========================= */

export const articlesCollection = collection(db, "articles");

export const createArticleDoc = async (data) => {
  const slug =
    data?.slug?.trim()
      ? generateSlug(data.slug)
      : generateSlug(data?.title || "");

  return await addDoc(articlesCollection, {
    ...data,
    slug,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const getArticleById = async (id) => {
  const ref = doc(db, "articles", id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

export const getAllArticles = async () => {
  const q = query(
    articlesCollection,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
};

export const getArticleBySlug = async (slug) => {
  const normalizedSlug = generateSlug(slug);

  const q = query(
    articlesCollection,
    where("slug", "==", normalizedSlug),
    limit(1)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const docItem = snapshot.docs[0];

  return {
    id: docItem.id,
    ...docItem.data(),
  };
};

export const getArticlesByCategory = async (category) => {
  try {
    const q = query(
      articlesCollection,
      where("category", "==", category),
      orderBy("createdAt", "desc")
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

export const getOpinionArticles = async () => {
  try {
    const q = query(
      articlesCollection,
      where("category", "==", "Opinion"),
      orderBy("createdAt", "desc")
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

export const getFactCheckArticles = async () => {
  try {
    const q = query(
      articlesCollection,
      where("category", "==", "Fact Check"),
      orderBy("createdAt", "desc")
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

  await updateDoc(ref, updatedPayload);
};

export const deleteArticleDoc = async (id) => {
  const ref = doc(db, "articles", id);
  await deleteDoc(ref);
};

/* =========================
   Tags
========================= */

export const tagsCollection = collection(db, "tags");

export const getAllTags = async () => {
  try {
    const snapshot = await getDocs(tagsCollection);

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
  } catch (error) {
    console.error("getAllTags error:", error);
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
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const docItem = snapshot.docs[0];

    return {
      id: docItem.id,
      ...docItem.data(),
    };
  } catch (error) {
    console.error("getTimelineBySlug error:", error);
    return null;
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
    name: data.name || "Anonymous",
    comment: data.comment || "",
    parentId: data.parentId || null,
    likes: data.likes || 0,
    createdAt: serverTimestamp(),
  });
};

export const getCommentsByArticleId = async (articleId) => {
  const q = query(
    commentsCollection,
    where("articleId", "==", articleId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
};

export const deleteCommentDoc = async (id) => {
  const ref = doc(db, "comments", id);
  await deleteDoc(ref);
};

/* =========================
   Reactions
========================= */

export const reactionsCollection = collection(db, "reactions");

export const createReactionDoc = async (data) => {
  return await addDoc(reactionsCollection, {
    ...data,
    createdAt: serverTimestamp(),
  });
};

export const getReactionsByArticleId = async (articleId) => {
  const q = query(
    reactionsCollection,
    where("articleId", "==", articleId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
};