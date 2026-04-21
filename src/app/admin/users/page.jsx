"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [actionLoadingId, setActionLoadingId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let data = [...users];

    if (roleFilter !== "all") {
      data = data.filter(
        (user) => (user.role || "reader") === roleFilter
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();

      data = data.filter((user) => {
        const name = user.fullName?.toLowerCase() || "";
        const email = user.email?.toLowerCase() || "";
        return name.includes(term) || email.includes(term);
      });
    }

    setFilteredUsers(data);
  }, [users, searchTerm, roleFilter]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      readers: users.filter((item) => item.role === "reader").length,
      editors: users.filter((item) => item.role === "editor").length,
      admins: users.filter((item) => item.role === "admin").length,
    };
  }, [users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "users"));

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, role) => {
    try {
      setActionLoadingId(userId);
      setError("");
      setSuccess("");

      await updateDoc(doc(db, "users", userId), {
        role,
        updatedAt: serverTimestamp(),
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role } : user
        )
      );

      setSuccess("User role updated successfully.");
    } catch (error) {
      console.error(error);
      setError("Failed to update user role.");
    } finally {
      setActionLoadingId("");
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      setActionLoadingId(userId);
      setError("");
      setSuccess("");

      await deleteDoc(doc(db, "users", userId));

      setUsers((prev) =>
        prev.filter((user) => user.id !== userId)
      );

      setSuccess("User deleted successfully.");
    } catch (error) {
      console.error(error);
      setError("Failed to delete user.");
    } finally {
      setActionLoadingId("");
    }
  };

  const formatDate = (value) => {
    if (!value) return "N/A";

    if (typeof value?.toDate === "function") {
      return value.toDate().toLocaleDateString();
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString();
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
            Manage Users
          </h1>

          <p className="mt-3 max-w-3xl text-slate-600">
            View registered users, update permissions, and manage reader,
            editor, and administrator access across the Contextra platform.
          </p>
        </div>

        {/* Messages */}
        {success && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Users</p>
            <h2 className="mt-3 text-4xl font-bold text-slate-900">
              {stats.total}
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Readers</p>
            <h2 className="mt-3 text-4xl font-bold text-slate-900">
              {stats.readers}
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Editors</p>
            <h2 className="mt-3 text-4xl font-bold text-amber-700">
              {stats.editors}
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Admins</p>
            <h2 className="mt-3 text-4xl font-bold text-red-700">
              {stats.admins}
            </h2>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Search users
              </label>

              <input
                type="text"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Filter by role
              </label>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
              >
                <option value="all">All Users</option>
                <option value="reader">Reader</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-slate-600">
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-10 text-center">
              <h3 className="text-xl font-semibold text-slate-900">
                No users found
              </h3>

              <p className="mt-2 text-slate-600">
                No users match your current filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left">
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      User
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Email
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Role
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-slate-100"
                    >
                      <td className="px-6 py-5">
                        <p className="font-medium text-slate-900">
                          {user.fullName || "Unnamed User"}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {user.email || "N/A"}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
                          {user.role || "reader"}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {formatDate(user.createdAt)}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-2">
                          <button
                            disabled={actionLoadingId === user.id}
                            onClick={() =>
                              handleRoleUpdate(user.id, "reader")
                            }
                            className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                          >
                            Reader
                          </button>

                          <button
                            disabled={actionLoadingId === user.id}
                            onClick={() =>
                              handleRoleUpdate(user.id, "editor")
                            }
                            className="rounded-xl bg-amber-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-700 disabled:opacity-60"
                          >
                            Editor
                          </button>

                          <button
                            disabled={actionLoadingId === user.id}
                            onClick={() =>
                              handleRoleUpdate(user.id, "admin")
                            }
                            className="rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                          >
                            Admin
                          </button>

                          <button
                            disabled={actionLoadingId === user.id}
                            onClick={() =>
                              handleDeleteUser(user.id)
                            }
                            className="rounded-xl border border-red-300 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
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