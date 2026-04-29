"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  fetchAllArticles,
  removeArticle,
} from "@/services/articleService";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);

      const data = await fetchAllArticles();

      const sortedData = (data || []).sort((a, b) => {
        const aDate = a.createdAt?.toDate
          ? a.createdAt.toDate()
          : new Date(0);

        const bDate = b.createdAt?.toDate
          ? b.createdAt.toDate()
          : new Date(0);

        return bDate - aDate;
      });

      setArticles(sortedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Recently";

    try {
      if (dateValue?.toDate) {
        return dateValue.toDate().toLocaleDateString();
      }

      return new Date(dateValue).toLocaleDateString();
    } catch {
      return "Recently";
    }
  };

  const getStatusBadgeClass = (status) => {
    if (status === "published") {
      return "bg-green-100 text-green-700";
    }

    if (status === "draft") {
      return "bg-amber-100 text-amber-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  const openDeleteModal = (article) => {
    setSelectedArticle(article);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedArticle(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    if (!selectedArticle) return;

    try {
      setDeleting(true);

      await removeArticle(selectedArticle.id);

      setArticles((prev) =>
        prev.filter((item) => item.id !== selectedArticle.id)
      );

      closeDeleteModal();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <p className="text-slate-600">Loading articles...</p>;
  }

  return (
    <>
      <section>
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
              Admin Articles
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Manage Articles
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              View, edit, and organize all Contextra articles. You can also
              check which articles are selected for the homepage Editor&apos;s
              Picks section.
            </p>
          </div>

          <Link
            href="/admin/articles/new"
            className="inline-flex items-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            New Article
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Articles</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              {articles.length}
            </h3>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Published</p>
            <h3 className="mt-2 text-2xl font-bold text-green-700">
              {
                articles.filter((article) => article.status === "published")
                  .length
              }
            </h3>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Homepage Picks</p>
            <h3 className="mt-2 text-2xl font-bold text-amber-700">
              {
                articles.filter(
                  (article) => article.showOnHomepage === true
                ).length
              }
            </h3>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Title
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Homepage Pick
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Homepage Order
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Date
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {articles.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-sm text-slate-500"
                    >
                      No articles found. Create your first article.
                    </td>
                  </tr>
                ) : (
                  articles.map((article) => (
                    <tr
                      key={article.id}
                      className="border-b border-slate-100 last:border-b-0"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-900">
                          {article.title || "Untitled Article"}
                        </p>

                        {article.slug && (
                          <p className="mt-1 text-xs text-slate-400">
                            /article/{article.slug}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm capitalize text-slate-600">
                        {article.category || "general"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusBadgeClass(
                            article.status
                          )}`}
                        >
                          {article.status || "draft"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {article.showOnHomepage ? (
                          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                            No
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {article.showOnHomepage ? (
                          <span className="font-semibold text-slate-900">
                            {article.homepageOrder || "-"}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {formatDate(article.createdAt)}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          {article.slug && (
                            <Link
                              href={`/article/${article.slug}`}
                              target="_blank"
                              className="text-sm font-medium text-slate-700 hover:underline"
                            >
                              View
                            </Link>
                          )}

                          <Link
                            href={`/admin/articles/${article.id}/edit`}
                            className="text-sm font-medium text-slate-700 hover:underline"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => openDeleteModal(article)}
                            className="text-sm font-medium text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Custom Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900">
              Delete Article
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900">
                &quot;{selectedArticle?.title}&quot;
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-70"
              >
                {deleting ? "Deleting..." : "Delete Article"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}