"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createArticle } from "@/services/articleService";
import { CATEGORIES } from "@/lib/constants";

export default function NewArticlePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    ourView: "",
    category: "Economy",
    image: "",
    author: "Contextra Editorial",
    featured: false,
    tags: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await createArticle({
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });

      setSuccess("Article created successfully.");

      setFormData({
        title: "",
        summary: "",
        content: "",
        ourView: "",
        category: "Economy",
        image: "",
        author: "Contextra Editorial",
        featured: false,
        tags: "",
      });

      setTimeout(() => {
        router.push("/admin/articles");
      }, 1200);
    } catch (err) {
      console.error(err);
      setError("Failed to create article. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          Admin Articles
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Create New Article
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          Publish a new Contextra article with summary, context, and your editorial view.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter article title"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Summary
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={3}
              placeholder="Write a short summary"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Author
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Author name"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Image URL
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Paste article image URL"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Our View
            </label>
            <textarea
              name="ourView"
              value={formData.ourView}
              onChange={handleChange}
              rows={4}
              placeholder="Write Contextra's editorial view"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={10}
              placeholder="Write the full article content"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. economy, inflation, fuel"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
            />
            <p className="mt-2 text-xs text-slate-500">
              Separate tags with commas.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <label className="inline-flex items-center gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300"
            />
            Mark as featured article
          </label>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Publishing..." : "Publish Article"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/articles")}
            className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}