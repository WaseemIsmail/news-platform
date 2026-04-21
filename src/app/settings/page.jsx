"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function SettingsPage() {
  const [user, setUser] = useState(null);

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser(currentUser);

      setProfileData({
        fullName: currentUser.displayName || "",
        email: currentUser.email || "",
      });

      fetchUserProfile(currentUser.uid);
    }
  }, []);

  const fetchUserProfile = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        const data = snapshot.data();

        setProfileData({
          fullName: data.fullName || "",
          email: data.email || "",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!user) return;

    try {
      setLoading(true);
      setError("");
      setProfileMessage("");

      await updateProfile(user, {
        displayName: profileData.fullName.trim(),
      });

      const userRef = doc(db, "users", user.uid);

      await updateDoc(userRef, {
        fullName: profileData.fullName.trim(),
        updatedAt: serverTimestamp(),
      });

      setProfileMessage("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!user) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setPasswordMessage("");

      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.currentPassword
      );

      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, passwordData.newPassword);

      setPasswordMessage("Password updated successfully.");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to update password. Please check current password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Account Settings
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            Manage Your Profile
          </h1>

          <p className="mt-3 text-slate-600">
            Update your personal details and keep your account secure.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Profile Settings */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Profile Information
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Update your display name and account details.
            </p>

            {profileMessage && (
              <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {profileMessage}
              </div>
            )}

            <form
              onSubmit={handleUpdateProfile}
              className="mt-6 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleProfileChange}
                  required
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  disabled
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>

          {/* Password Settings */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Change Password
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Keep your account secure by using a strong password.
            </p>

            {passwordMessage && (
              <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {passwordMessage}
              </div>
            )}

            <form
              onSubmit={handleUpdatePassword}
              className="mt-6 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Current Password
                </label>

                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  New Password
                </label>

                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 text-center text-sm text-slate-600">
          Back to{" "}
          <Link
            href="/profile"
            className="font-medium text-slate-900 hover:text-amber-700"
          >
            Profile
          </Link>
        </div>
      </section>
    </main>
  );
}