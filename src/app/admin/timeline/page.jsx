"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminTimelinePage() {
  const [timelines, setTimelines] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("published");

  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTimeline, setSelectedTimeline] = useState(null);

  useEffect(() => {
    fetchTimelines();
  }, []);

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const fetchTimelines = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "timelines"));

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setTimelines(data);
    } catch (error) {
      console.error("Failed to fetch timelines:", error);
      setError("Failed to fetch timelines.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setSummary("");
    setCategory("");
    setStatus("published");
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Timeline title is required.");
      return;
    }

    if (!summary.trim()) {
      setError("Timeline summary is required.");
      return;
    }

    const finalSlug = slug.trim()
      ? generateSlug(slug)
      : generateSlug(title);

    try {
      const payload = {
        title: title.trim(),
        slug: finalSlug,
        summary: summary.trim(),
        category: category.trim(),
        status,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, "timelines", editingId), payload);
        setSuccess("Timeline updated successfully.");
      } else {
        await addDoc(collection(db, "timelines"), {
          ...payload,
          createdAt: serverTimestamp(),
        });

        setSuccess("Timeline created successfully.");
      }

      resetForm();
      fetchTimelines();
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleEdit = (timeline) => {
    setTitle(timeline.title || "");
    setSlug(timeline.slug || "");
    setSummary(timeline.summary || "");
    setCategory(timeline.category || "");
    setStatus(timeline.status || "published");
    setEditingId(timeline.id);

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openDeleteModal = (timeline) => {
    setSelectedTimeline(timeline);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedTimeline(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    if (!selectedTimeline?.id) return;

    try {
      await deleteDoc(doc(db, "timelines", selectedTimeline.id));

      setTimelines((prev) =>
        prev.filter((item) => item.id !== selectedTimeline.id)
      );

      if (editingId === selectedTimeline.id) {
        resetForm();
      }

      setSuccess("Timeline deleted successfully.");
      closeDeleteModal();
    } catch (error) {
      console.error(error);
      setError("Failed to delete timeline.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Admin Panel
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            Manage Timelines
          </h1>

          <p className="mt-3 max-w-3xl text-slate-600">
            Create, update, and organize timeline stories for major
            events, political developments, investigations, and
            historical breakdowns across Contextra.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            {editingId ? "Edit Timeline" : "Create New Timeline"}
          </h2>

          {success && (
            <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Timeline Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Timeline Title
              </label>

              <input
                type="text"
                placeholder="Enter timeline title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);

                  if (!editingId) {
                    setSlug(generateSlug(e.target.value));
                  }
                }}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Slug
              </label>

              <input
                type="text"
                placeholder="auto-generated-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            {/* Summary */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Summary
              </label>

              <textarea
                rows={4}
                placeholder="Enter short timeline summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category
                </label>

                <input
                  type="text"
                  placeholder="Politics, Business, Tech..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {editingId ? "Update Timeline" : "Create Timeline"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Timeline List */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-slate-600">
              Loading timelines...
            </div>
          ) : timelines.length === 0 ? (
            <div className="p-10 text-center">
              <h3 className="text-xl font-semibold text-slate-900">
                No timelines found
              </h3>

              <p className="mt-2 text-slate-600">
                Start by creating your first major event timeline.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left">
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Title
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Category
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
                  {timelines.map((timeline) => (
                    <tr
                      key={timeline.id}
                      className="border-b border-slate-100"
                    >
                      <td className="px-6 py-5">
                        <p className="font-medium text-slate-900">
                          {timeline.title}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {timeline.slug}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {timeline.category || "General"}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
                          {timeline.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => handleEdit(timeline)}
                            className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => openDeleteModal(timeline)}
                            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
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

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900">
              Delete Timeline
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900">
                "{selectedTimeline?.title}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Delete Timeline
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}