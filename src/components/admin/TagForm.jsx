"use client";

import { useEffect, useState } from "react";

export default function TagForm({
  initialData = null,
  onSubmit,
  loading = false,
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setSlug(initialData.slug || "");
    } else {
      setName("");
      setSlug("");
    }
  }, [initialData]);

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleNameChange = (value) => {
    setName(value);

    if (!initialData) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Tag name is required.");
      return;
    }

    const finalSlug = slug.trim()
      ? generateSlug(slug)
      : generateSlug(name);

    onSubmit?.({
      name: name.trim(),
      slug: finalSlug,
    });
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">
        {initialData ? "Edit Tag" : "Create New Tag"}
      </h2>

      {error && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-5 md:grid-cols-2"
      >
        {/* Tag Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Tag Name
          </label>

          <input
            type="text"
            placeholder="Enter tag name"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
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
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
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
              ? "Update Tag"
              : "Create Tag"}
          </button>
        </div>
      </form>
    </div>
  );
}