"use client";

import { useEffect, useState } from "react";

export default function TimelineEditorForm({
  initialData = null,
  onSubmit,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    category: "",
    status: "published",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        slug: initialData.slug || "",
        summary: initialData.summary || "",
        category: initialData.category || "",
        status: initialData.status || "published",
      });
    } else {
      setFormData({
        title: "",
        slug: "",
        summary: "",
        category: "",
        status: "published",
      });
    }
  }, [initialData]);

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (name === "title" && !initialData) {
        updated.slug = generateSlug(value);
      }

      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Timeline title is required.");
      return;
    }

    if (!formData.summary.trim()) {
      setError("Timeline summary is required.");
      return;
    }

    const finalSlug = formData.slug.trim()
      ? generateSlug(formData.slug)
      : generateSlug(formData.title);

    onSubmit?.({
      title: formData.title.trim(),
      slug: finalSlug,
      summary: formData.summary.trim(),
      category: formData.category.trim(),
      status: formData.status,
    });
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">
        {initialData ? "Edit Timeline" : "Create New Timeline"}
      </h2>

      {error && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Timeline Title
          </label>

          <input
            type="text"
            name="title"
            placeholder="Enter timeline title"
            value={formData.title}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Slug
          </label>

          <input
            type="text"
            name="slug"
            placeholder="auto-generated-slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Summary
          </label>

          <textarea
            rows={4}
            name="summary"
            placeholder="Enter short timeline summary"
            value={formData.summary}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category
            </label>

            <input
              type="text"
              name="category"
              placeholder="Politics, Business, Tech..."
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? initialData
                ? "Updating..."
                : "Creating..."
              : initialData
              ? "Update Timeline"
              : "Create Timeline"}
          </button>
        </div>
      </form>
    </div>
  );
}