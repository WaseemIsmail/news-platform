"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const defaultCategories = [
  {
    name: "Opinion",
    slug: "opinion",
    description: "Editorials, expert views, analysis, and public perspectives.",
  },
  {
    name: "Politics",
    slug: "politics",
    description: "Political news, government updates, and policy analysis.",
  },
  {
    name: "Business",
    slug: "business",
    description: "Business, economy, markets, and financial updates.",
  },
  {
    name: "Technology",
    slug: "technology",
    description: "Technology news, AI, startups, and digital transformation.",
  },
  {
    name: "World",
    slug: "world",
    description: "International news and global affairs.",
  },
  {
    name: "Sports",
    slug: "sports",
    description: "Sports news, match updates, tournaments, player stories, and analysis.",
  },
  {
    name: "Fact Check",
    slug: "fact-check",
    description: "Fact-checking reports and verification-based content.",
  },
];

  useEffect(() => {
    fetchCategories();
  }, []);

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const snapshot = await getDocs(collection(db, "categories"));

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      data.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setError("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setIsActive(true);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const checkSlugExists = async (finalSlug) => {
    const q = query(
      collection(db, "categories"),
      where("slug", "==", finalSlug)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return false;

    if (editingId) {
      return snapshot.docs.some((item) => item.id !== editingId);
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    const finalSlug = slug.trim() ? generateSlug(slug) : generateSlug(name);

    if (!finalSlug) {
      setError("Valid slug is required.");
      return;
    }

    try {
      const slugExists = await checkSlugExists(finalSlug);

      if (slugExists) {
        setError("This slug already exists. Please use another slug.");
        return;
      }

      const categoryData = {
        name: name.trim(),
        slug: finalSlug,
        description: description.trim(),
        isActive,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, "categories", editingId), categoryData);
        setSuccess("Category updated successfully.");
      } else {
        await addDoc(collection(db, "categories"), {
          ...categoryData,
          createdAt: serverTimestamp(),
        });

        setSuccess("Category created successfully.");
      }

      resetForm();
      fetchCategories();
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleEdit = (category) => {
    setName(category.name || "");
    setSlug(category.slug || "");
    setDescription(category.description || "");
    setIsActive(category.isActive !== false);
    setEditingId(category.id);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedCategory(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    if (!selectedCategory?.id) return;

    try {
      await deleteDoc(doc(db, "categories", selectedCategory.id));

      setCategories((prev) =>
        prev.filter((item) => item.id !== selectedCategory.id)
      );

      if (editingId === selectedCategory.id) {
        resetForm();
      }

      setSuccess("Category deleted successfully.");
      closeDeleteModal();
    } catch (error) {
      console.error(error);
      setError("Failed to delete category.");
    }
  };

  const createDefaultCategories = async () => {
    try {
      setError("");
      setSuccess("");

      let createdCount = 0;

      for (const category of defaultCategories) {
        const q = query(
          collection(db, "categories"),
          where("slug", "==", category.slug)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          await addDoc(collection(db, "categories"), {
            name: category.name,
            slug: category.slug,
            description: category.description,
            isActive: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });

          createdCount++;
        }
      }

      if (createdCount === 0) {
        setSuccess("Default categories already exist.");
      } else {
        setSuccess(`${createdCount} default categories created successfully.`);
      }

      fetchCategories();
    } catch (error) {
      console.error(error);
      setError("Failed to create default categories.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-10">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
              Admin Panel
            </p>

            <h1 className="mt-3 text-4xl font-bold text-slate-900">
              Manage Categories
            </h1>

            <p className="mt-3 max-w-3xl text-slate-600">
              Create and organize categories such as Opinion, Politics,
              Business, Technology, and Fact Check for Contextra articles.
            </p>
          </div>

          <button
            type="button"
            onClick={createDefaultCategories}
            className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Create Default Categories
          </button>
        </div>

        {/* Form */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            {editingId ? "Edit Category" : "Create New Category"}
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
                Category Name
              </label>

              <input
                type="text"
                placeholder="Example: Opinion"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);

                  if (!editingId) {
                    setSlug(generateSlug(e.target.value));
                  }
                }}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Slug
              </label>

              <input
                type="text"
                placeholder="example: opinion"
                value={slug}
                onChange={(e) => setSlug(generateSlug(e.target.value))}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                placeholder="Short description about this category"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                value={isActive ? "active" : "inactive"}
                onChange={(e) => setIsActive(e.target.value === "active")}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-end gap-3">
              <button
                type="submit"
                className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {editingId ? "Update Category" : "Create Category"}
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

        {/* Category List */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-slate-600">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="p-10 text-center">
              <h3 className="text-xl font-semibold text-slate-900">
                No categories found
              </h3>

              <p className="mt-2 text-slate-600">
                Start by creating your first content category.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left">
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Category Name
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Slug
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Description
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
                  {categories.map((category) => (
                    <tr
                      key={category.id}
                      className="border-b border-slate-100"
                    >
                      <td className="px-6 py-5 font-medium text-slate-900">
                        {category.name}
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {category.slug}
                      </td>

                      <td className="max-w-md px-6 py-5 text-sm leading-6 text-slate-600">
                        {category.description || "-"}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            category.isActive === false
                              ? "bg-red-50 text-red-700"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          {category.isActive === false ? "Inactive" : "Active"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => handleEdit(category)}
                            className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => openDeleteModal(category)}
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
              Delete Category
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900">
                "{selectedCategory?.name}"
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
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}