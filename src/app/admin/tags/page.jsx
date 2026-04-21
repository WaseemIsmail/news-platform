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

export default function AdminTagsPage() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchTags();
  }, []);

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const fetchTags = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "tags"));

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setTags(data);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setSlug("");
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Tag name is required.");
      return;
    }

    const finalSlug = slug.trim()
      ? generateSlug(slug)
      : generateSlug(name);

    try {
      if (editingId) {
        await updateDoc(doc(db, "tags", editingId), {
          name: name.trim(),
          slug: finalSlug,
          updatedAt: serverTimestamp(),
        });

        setSuccess("Tag updated successfully.");
      } else {
        await addDoc(collection(db, "tags"), {
          name: name.trim(),
          slug: finalSlug,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        setSuccess("Tag created successfully.");
      }

      resetForm();
      fetchTags();
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleEdit = (tag) => {
    setName(tag.name || "");
    setSlug(tag.slug || "");
    setEditingId(tag.id);
    setError("");
    setSuccess("");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this tag?"
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "tags", id));

      setTags((prev) =>
        prev.filter((item) => item.id !== id)
      );

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      console.error(error);
      setError("Failed to delete tag.");
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
            Manage Tags
          </h1>

          <p className="mt-3 max-w-3xl text-slate-600">
            Create, update, and organize content tags for article discovery,
            SEO improvements, and topic-based navigation across Contextra.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            {editingId ? "Edit Tag" : "Create New Tag"}
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

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Tag Name
              </label>

              <input
                type="text"
                placeholder="Enter tag name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);

                  if (!editingId) {
                    setSlug(generateSlug(e.target.value));
                  }
                }}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Slug
              </label>

              <input
                type="text"
                placeholder="auto-generated-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
              />
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {editingId ? "Update Tag" : "Create Tag"}
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

        {/* Tag List */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-slate-600">
              Loading tags...
            </div>
          ) : tags.length === 0 ? (
            <div className="p-10 text-center">
              <h3 className="text-xl font-semibold text-slate-900">
                No tags found
              </h3>

              <p className="mt-2 text-slate-600">
                Start by creating your first content tag.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left">
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Tag Name
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Slug
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {tags.map((tag) => (
                    <tr
                      key={tag.id}
                      className="border-b border-slate-100"
                    >
                      <td className="px-6 py-5 font-medium text-slate-900">
                        #{tag.name}
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {tag.slug}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => handleEdit(tag)}
                            className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(tag.id)}
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
    </main>
  );
}