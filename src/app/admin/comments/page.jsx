"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminCommentsPage() {
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoadingId, setActionLoadingId] = useState("");

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    let data = [...comments];

    if (statusFilter !== "all") {
      data = data.filter(
        (comment) => (comment.status || "pending") === statusFilter
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();

      data = data.filter((comment) => {
        const commentText = comment.content?.toLowerCase() || "";
        const authorName = comment.authorName?.toLowerCase() || "";
        const articleTitle = comment.articleTitle?.toLowerCase() || "";
        return (
          commentText.includes(term) ||
          authorName.includes(term) ||
          articleTitle.includes(term)
        );
      });
    }

    setFilteredComments(data);
  }, [comments, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: comments.length,
      approved: comments.filter((item) => item.status === "approved").length,
      pending: comments.filter(
        (item) => !item.status || item.status === "pending"
      ).length,
      rejected: comments.filter((item) => item.status === "rejected").length,
    };
  }, [comments]);

  const fetchComments = async () => {
    try {
      setLoading(true);

      const commentsQuery = query(
        collection(db, "comments"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(commentsQuery);

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setComments(data);
      setFilteredComments(data);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (commentId, status) => {
    try {
      setActionLoadingId(commentId);

      await updateDoc(doc(db, "comments", commentId), {
        status,
        moderatedAt: serverTimestamp(),
      });

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? { ...comment, status } : comment
        )
      );
    } catch (error) {
      console.error("Failed to update comment status:", error);
    } finally {
      setActionLoadingId("");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirmed) return;

    try {
      setActionLoadingId(commentId);

      await deleteDoc(doc(db, "comments", commentId));

      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    } finally {
      setActionLoadingId("");
    }
  };

  const formatDate = (value) => {
    if (!value) return "N/A";

    if (typeof value?.toDate === "function") {
      return value.toDate().toLocaleString();
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleString();
  };

  const getStatusBadge = (status) => {
    const currentStatus = status || "pending";

    if (currentStatus === "approved") {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (currentStatus === "rejected") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Admin Panel
          </p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            Comment Moderation
          </h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Review user comments, approve valid discussions, reject harmful
            content, and keep conversations healthy across Contextra.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Comments</p>
            <h2 className="mt-3 text-4xl font-bold text-slate-900">
              {stats.total}
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Approved</p>
            <h2 className="mt-3 text-4xl font-bold text-green-700">
              {stats.approved}
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Pending</p>
            <h2 className="mt-3 text-4xl font-bold text-amber-700">
              {stats.pending}
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Rejected</p>
            <h2 className="mt-3 text-4xl font-bold text-red-700">
              {stats.rejected}
            </h2>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Search comments
              </label>
              <input
                type="text"
                placeholder="Search by comment, author, or article"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Filter by status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
              >
                <option value="all">All Comments</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-slate-600">
              Loading comments...
            </div>
          ) : filteredComments.length === 0 ? (
            <div className="p-10 text-center">
              <h3 className="text-xl font-semibold text-slate-900">
                No comments found
              </h3>
              <p className="mt-2 text-slate-600">
                There are no comments matching the current filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left">
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Comment
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Author
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Article
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Date
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredComments.map((comment) => (
                    <tr
                      key={comment.id}
                      className="border-b border-slate-100 align-top"
                    >
                      <td className="px-6 py-5">
                        <p className="max-w-xl text-sm leading-6 text-slate-700">
                          {comment.content || "No comment content"}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <div className="text-sm text-slate-700">
                          <p className="font-medium text-slate-900">
                            {comment.authorName || "Anonymous"}
                          </p>
                          {comment.authorEmail && (
                            <p className="mt-1 text-slate-500">
                              {comment.authorEmail}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        {comment.articleSlug ? (
                          <Link
                            href={`/article/${comment.articleSlug}`}
                            className="text-sm font-medium text-slate-900 hover:text-amber-700"
                          >
                            {comment.articleTitle || "View Article"}
                          </Link>
                        ) : (
                          <span className="text-sm text-slate-500">
                            {comment.articleTitle || "N/A"}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-500">
                        {formatDate(comment.createdAt)}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize ${getStatusBadge(
                            comment.status
                          )}`}
                        >
                          {comment.status || "pending"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() =>
                              handleStatusUpdate(comment.id, "approved")
                            }
                            disabled={actionLoadingId === comment.id}
                            className="rounded-xl bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              handleStatusUpdate(comment.id, "rejected")
                            }
                            disabled={actionLoadingId === comment.id}
                            className="rounded-xl bg-amber-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-700 disabled:opacity-60"
                          >
                            Reject
                          </button>

                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            disabled={actionLoadingId === comment.id}
                            className="rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}