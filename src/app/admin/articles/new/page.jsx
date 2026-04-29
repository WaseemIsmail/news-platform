"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { createArticle } from "@/services/articleService";
import { db } from "@/lib/firebase";

const ARTICLE_CATEGORIES = [
  { label: "Opinion", value: "opinion" },
  { label: "Sports", value: "sports" },
  { label: "Politics", value: "politics" },
  { label: "Business", value: "business" },
  { label: "Economy", value: "economy" },
  { label: "Technology", value: "technology" },
  { label: "World", value: "world" },
  { label: "Fact Check", value: "fact-check" },
];

export default function NewArticlePage() {
  const router = useRouter();

  const [polls, setPolls] = useState([]);
  const [pollsLoading, setPollsLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    ourView: "",
    category: "opinion",
    image: "",
    author: "Contextra Editorial",
    featured: false,
    status: "published",
    showOnHomepage: false,
    homepageOrder: "",
    pollId: "",
    tags: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchActivePolls();
  }, []);

  const fetchActivePolls = async () => {
    try {
      setPollsLoading(true);

      const q = query(
        collection(db, "polls"),
        where("status", "==", "active")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setPolls(data);
    } catch (error) {
      console.error("Failed to fetch polls:", error);
    } finally {
      setPollsLoading(false);
    }
  };

  const normalizeTag = (tag = "") => {
    return tag
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      summary: "",
      content: "",
      ourView: "",
      category: "opinion",
      image: "",
      author: "Contextra Editorial",
      featured: false,
      status: "published",
      showOnHomepage: false,
      homepageOrder: "",
      pollId: "",
      tags: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!formData.content.trim()) {
      setError("Content is required.");
      return;
    }

    if (!formData.category.trim()) {
      setError("Category is required.");
      return;
    }

    if (formData.showOnHomepage) {
      const orderNumber = Number(formData.homepageOrder);

      if (!formData.homepageOrder || orderNumber < 1) {
        setError("Homepage order is required when showing on homepage.");
        return;
      }
    }

    try {
      setLoading(true);

      await createArticle({
        title: formData.title.trim(),
        summary: formData.summary.trim(),
        content: formData.content.trim(),
        ourView: formData.ourView.trim(),
        category: formData.category,
        image: formData.image.trim(),
        author: formData.author.trim() || "Contextra Editorial",
        featured: formData.featured,
        status: formData.status,

        // Homepage Editor's Picks fields
        showOnHomepage: formData.showOnHomepage,
        homepageOrder: formData.showOnHomepage
          ? Number(formData.homepageOrder)
          : 999,

        // Attached poll field
        pollId: formData.pollId || "",

        tags: formData.tags
          .split(",")
          .map((tag) => normalizeTag(tag))
          .filter(Boolean),
      });

      setSuccess("Article created successfully.");
      resetForm();

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
          Publish a new Contextra article with summary, context, editorial view,
          homepage settings, and optional poll attachment.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-800">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter article title"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Summary */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-800">
              Summary
            </label>

            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={4}
              placeholder="Write a short summary"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            >
              {ARTICLE_CATEGORIES.map((category) => (
                <option
                  key={category.value}
                  value={category.value}
                  className="bg-white text-slate-900"
                >
                  {category.label}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-slate-500">
              This value is saved to Firestore as a category slug.
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            <p className="mt-2 text-xs text-slate-500">
              Only published articles appear on public pages.
            </p>
          </div>

          {/* Author */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">
              Author
            </label>

            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Author name"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Featured */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">
              Featured
            </label>

            <label className="flex min-h-[46px] items-center gap-3 rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700">
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

          {/* Show on Homepage */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">
              Homepage Display
            </label>

            <label className="flex min-h-[46px] items-center gap-3 rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                name="showOnHomepage"
                checked={formData.showOnHomepage}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300"
              />
              Show in Editor&apos;s Picks
            </label>

            <p className="mt-2 text-xs text-slate-500">
              Tick this to show the article on the homepage.
            </p>
          </div>

          {/* Homepage Order */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">
              Homepage Order
            </label>

            <input
              type="number"
              name="homepageOrder"
              value={formData.homepageOrder}
              onChange={handleChange}
              placeholder="1, 2, or 3"
              min="1"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />

            <p className="mt-2 text-xs text-slate-500">
              Use 1, 2, or 3 for homepage order.
            </p>
          </div>

          {/* Attach Poll */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-800">
              Attach Poll
            </label>

            <select
              name="pollId"
              value={formData.pollId}
              onChange={handleChange}
              disabled={pollsLoading}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:opacity-70"
            >
              <option value="">
                {pollsLoading ? "Loading polls..." : "No poll attached"}
              </option>

              {polls.map((poll) => (
                <option key={poll.id} value={poll.id}>
                  {poll.question}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-slate-500">
              Create polls from Admin → Polls. Only active polls are shown here.
            </p>
          </div>

          {/* Image URL */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-800">
              Image URL
            </label>

            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Paste article image URL"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />

            <p className="mt-2 text-xs text-slate-500">
              Leave empty to use the default article image.
            </p>
          </div>

          {/* Our View */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-800">
              Our View
            </label>

            <textarea
              name="ourView"
              value={formData.ourView}
              onChange={handleChange}
              rows={5}
              placeholder="Write Contextra's editorial view"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Content */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-800">
              Content
            </label>

            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={10}
              placeholder="Write the full article content"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Tags */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-800">
              Tags
            </label>

            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. economy, inflation, fuel"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />

            <p className="mt-2 text-xs text-slate-500">
              Separate tags with commas.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/* Buttons */}
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