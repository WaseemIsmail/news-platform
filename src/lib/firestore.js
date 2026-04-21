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
   Articles
========================= */

export const articlesCollection = collection(db, "articles");

export const createArticleDoc = async (data) => {
  return await addDoc(articlesCollection, {
    ...data,
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
  const q = query(articlesCollection, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
};

export const getArticleBySlug = async (slug) => {
  const q = query(
    articlesCollection,
    where("slug", "==", slug),
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

export const updateArticleDoc = async (id, data) => {
  const ref = doc(db, "articles", id);

  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteArticleDoc = async (id) => {
  const ref = doc(db, "articles", id);
  await deleteDoc(ref);
};

/* =========================
   Comments
========================= */

export const commentsCollection = collection(db, "comments");

export const createCommentDoc = async (data) => {
  return await addDoc(commentsCollection, {
    ...data,
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