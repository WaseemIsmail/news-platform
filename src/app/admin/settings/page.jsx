"use client";

import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Contextra",
    siteDescription: "",
    adminEmail: "",
    allowComments: true,
    allowRegistrations: true,
    enableNewsletter: true,
    maintenanceMode: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const settingsRef = doc(db, "settings", "site-config");
      const snapshot = await getDoc(settingsRef);

      if (snapshot.exists()) {
        setSettings((prev) => ({
          ...prev,
          ...snapshot.data(),
        }));
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const settingsRef = doc(db, "settings", "site-config");

      await setDoc(
        settingsRef,
        {
          ...settings,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setSuccess("Settings updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-slate-600">
              Loading admin settings...
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Admin Panel
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            Platform Settings
          </h1>

          <p className="mt-3 max-w-3xl text-slate-600">
            Manage global platform configurations, content permissions,
            registrations, newsletters, and site-wide behavior across
            Contextra.
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSave}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="space-y-10">
            {/* General Settings */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                General Settings
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {/* Site Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Site Name
                  </label>

                  <input
                    type="text"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleChange}
                    placeholder="Enter platform name"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                {/* Admin Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Admin Email
                  </label>

                  <input
                    type="email"
                    name="adminEmail"
                    value={settings.adminEmail}
                    onChange={handleChange}
                    placeholder="admin@contextra.com"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                {/* Site Description */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Site Description
                  </label>

                  <textarea
                    rows={4}
                    name="siteDescription"
                    value={settings.siteDescription}
                    onChange={handleChange}
                    placeholder="Short SEO-friendly platform description"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Feature Controls */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Feature Controls
              </h2>

              <div className="mt-6 space-y-5">
                {/* Allow Comments */}
                <label className="flex items-center justify-between rounded-2xl border border-slate-200 p-5">
                  <div>
                    <p className="font-medium text-slate-900">
                      Allow Comments
                    </p>
                    <p className="text-sm text-slate-500">
                      Enable or disable article comments globally
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="allowComments"
                    checked={settings.allowComments}
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-slate-300"
                  />
                </label>

                {/* Allow Registrations */}
                <label className="flex items-center justify-between rounded-2xl border border-slate-200 p-5">
                  <div>
                    <p className="font-medium text-slate-900">
                      Allow User Registration
                    </p>
                    <p className="text-sm text-slate-500">
                      Allow new users to create accounts
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="allowRegistrations"
                    checked={settings.allowRegistrations}
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-slate-300"
                  />
                </label>

                {/* Newsletter */}
                <label className="flex items-center justify-between rounded-2xl border border-slate-200 p-5">
                  <div>
                    <p className="font-medium text-slate-900">
                      Enable Newsletter
                    </p>
                    <p className="text-sm text-slate-500">
                      Enable newsletter subscription functionality
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="enableNewsletter"
                    checked={settings.enableNewsletter}
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-slate-300"
                  />
                </label>

                {/* Maintenance Mode */}
                <label className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 p-5">
                  <div>
                    <p className="font-medium text-red-700">
                      Maintenance Mode
                    </p>
                    <p className="text-sm text-red-500">
                      Temporarily disable public platform access
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-red-300"
                  />
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-slate-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving Changes..."
                  : "Save Settings"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}