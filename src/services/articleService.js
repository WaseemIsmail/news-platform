import {
  createArticleDoc,
  getAllArticles,
  getArticleById,
  getArticleBySlug,
  updateArticleDoc,
  deleteArticleDoc,
} from "@/lib/firestore";
import { readingTime } from "@/utils/readingTime";
import { slugify } from "@/utils/slugify";

export const createArticle = async (articleData) => {
  const slug = slugify(articleData.title);

  const payload = {
    title: articleData.title,
    slug,
    summary: articleData.summary || "",
    content: articleData.content || "",
    ourView: articleData.ourView || "",
    category: articleData.category || "General",
    image: articleData.image || "",
    author: articleData.author || "Contextra Editorial",
    readingTime: readingTime(articleData.content || ""),
    views: 0,
    featured: articleData.featured || false,
    tags: articleData.tags || [],
  };

  return await createArticleDoc(payload);
};

export const fetchAllArticles = async () => {
  return await getAllArticles();
};

export const fetchArticleById = async (id) => {
  return await getArticleById(id);
};

export const fetchArticleBySlug = async (slug) => {
  return await getArticleBySlug(slug);
};

export const editArticle = async (id, articleData) => {
  const payload = {
    ...articleData,
    slug: slugify(articleData.title),
    readingTime: readingTime(articleData.content || ""),
  };

  return await updateArticleDoc(id, payload);
};

export const removeArticle = async (id) => {
  return await deleteArticleDoc(id);
};