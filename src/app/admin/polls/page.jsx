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

export default function AdminPollsPage() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [status, setStatus] = useState("active");

  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "polls"));

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setPolls(data);
    } catch (error) {
      console.error("Failed to fetch polls:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setQuestion("");
    setOptions(["", ""]);
    setStatus("active");
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOptionField = () => {
    if (options.length >= 6) return;
    setOptions([...options, ""]);
  };

  const removeOptionField = (index) => {
    if (options.length <= 2) return;

    const updated = options.filter((_, i) => i !== index);
    setOptions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanedOptions = options
      .map((option) => option.trim())
      .filter(Boolean);

    if (!question.trim()) {
      setError("Poll question is required.");
      return;
    }

    if (cleanedOptions.length < 2) {
      setError("At least 2 poll options are required.");
      return;
    }

    try {
      const payload = {
        question: question.trim(),
        options: cleanedOptions.map((item) => ({
          label: item,
          votes: 0,
        })),
        status,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, "polls", editingId), payload);
        setSuccess("Poll updated successfully.");
      } else {
        await addDoc(collection(db, "polls"), {
          ...payload,
          createdAt: serverTimestamp(),
        });

        setSuccess("Poll created successfully.");
      }

      resetForm();
      fetchPolls();
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleEdit = (poll) => {
    setQuestion(poll.question || "");
    setStatus(poll.status || "active");
    setEditingId(poll.id);

    const existingOptions =
      poll.options?.map((item) => item.label) || ["", ""];

    setOptions(existingOptions.length >= 2 ? existingOptions : ["", ""]);

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this poll?"
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "polls", id));

      setPolls((prev) => prev.filter((item) => item.id !== id));

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      console.error(error);
      setError("Failed to delete poll.");
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
            Manage Polls
          </h1>

          <p className="mt-3 max-w-3xl text-slate-600">
            Create and manage public opinion polls for breaking news,
            trending topics, and editorial engagement across Contextra.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            {editingId ? "Edit Poll" : "Create New Poll"}
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

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Poll Question
              </label>

              <input
                type="text"
                placeholder="Enter poll question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-slate-700">
                Poll Options
              </label>

              <div className="space-y-3">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3"
                  >
                    <input
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                    />

                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOptionField(index)}
                        className="rounded-xl bg-red-100 px-4 py-3 text-sm font-medium text-red-700 transition hover:bg-red-200"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {options.length < 6 && (
                <button
                  type="button"
                  onClick={addOptionField}
                  className="mt-4 rounded-2xl border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  + Add Option
                </button>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {editingId ? "Update Poll" : "Create Poll"}
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

        {/* Poll List */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-slate-600">
              Loading polls...
            </div>
          ) : polls.length === 0 ? (
            <div className="p-10 text-center">
              <h3 className="text-xl font-semibold text-slate-900">
                No polls found
              </h3>

              <p className="mt-2 text-slate-600">
                Start by creating your first engagement poll.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left">
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Question
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Options
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
                  {polls.map((poll) => (
                    <tr
                      key={poll.id}
                      className="border-b border-slate-100"
                    >
                      <td className="px-6 py-5 font-medium text-slate-900">
                        {poll.question}
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        <div className="space-y-1">
                          {poll.options?.map((option, index) => (
                            <div key={index}>
                              • {option.label}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
                          {poll.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => handleEdit(poll)}
                            className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(poll.id)}
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