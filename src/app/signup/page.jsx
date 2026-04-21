"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const saveUserToFirestore = async (user, fullName = "") => {
    const userRef = doc(db, "users", user.uid);
    const existingUser = await getDoc(userRef);

    if (!existingUser.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        fullName: fullName || user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        role: "reader",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: formData.fullName.trim(),
      });

      await saveUserToFirestore(
        userCredential.user,
        formData.fullName.trim()
      );

      setSuccess("Account created successfully!");

      setTimeout(() => {
        router.push("/profile");
      }, 1200);
    } catch (err) {
      console.error(err);

      let message = "Signup failed. Please try again.";

      if (err.code === "auth/email-already-in-use") {
        message = "This email is already registered.";
      } else if (err.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (err.code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const result = await signInWithPopup(auth, provider);

      await saveUserToFirestore(result.user);

      setSuccess("Google signup successful!");

      setTimeout(() => {
        router.push("/profile");
      }, 1000);
    } catch (err) {
      console.error(err);

      let message = "Google signup failed.";

      if (err.code === "auth/popup-closed-by-user") {
        message = "Google popup was closed before completing signup.";
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
              Join Contextra
            </p>

            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              Create Your Account
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Save articles, join discussions, and personalize your reading
              experience.
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
          <form onSubmit={handleEmailSignup} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
              />
            </div>

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
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create password"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm password"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Google Signup */}
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Continue with Google
          </button>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-slate-900 hover:text-amber-700"
            >
              Login
            </Link>
          </div>

          <div className="mt-3 text-center text-sm text-slate-600">
            Forgot your password?{" "}
            <Link
              href="/forgot-password"
              className="font-medium text-slate-900 hover:text-amber-700"
            >
              Reset here
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}