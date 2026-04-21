"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const provider = new GoogleAuthProvider();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const ensureUserExists = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const existingUser = await getDoc(userRef);

    if (!existingUser.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        fullName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        role: "reader",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      );

      await ensureUserExists(userCredential.user);

      setSuccess("Login successful!");

      setTimeout(() => {
        router.push("/profile");
      }, 1000);
    } catch (err) {
      console.error(err);

      let message = "Invalid email or password.";

      if (err.code === "auth/user-not-found") {
        message = "No account found with this email.";
      } else if (err.code === "auth/wrong-password") {
        message = "Incorrect password.";
      } else if (err.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (err.code === "auth/too-many-requests") {
        message =
          "Too many failed attempts. Please try again later.";
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const result = await signInWithPopup(auth, provider);

      await ensureUserExists(result.user);

      setSuccess("Google login successful!");

      setTimeout(() => {
        router.push("/profile");
      }, 1000);
    } catch (err) {
      console.error(err);

      let message = "Google login failed.";

      if (err.code === "auth/popup-closed-by-user") {
        message =
          "Google popup was closed before completing login.";
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          {/* Header */}
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
              Welcome Back
            </p>

            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              Login to Contextra
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Access your saved articles, bookmarks, comments, and profile.
            </p>
          </div>

          {/* Success */}
          {success && (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEmailLogin} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-slate-900 hover:text-amber-700"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Continue with Google
          </button>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-slate-600">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-slate-900 hover:text-amber-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}