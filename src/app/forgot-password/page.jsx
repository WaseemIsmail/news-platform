"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({
    loading: false,
    success: "",
    error: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus({
      loading: true,
      success: "",
      error: "",
    });

    try {
      await sendPasswordResetEmail(auth, email.trim());

      setStatus({
        loading: false,
        success: "A password reset link has been sent to your email.",
        error: "",
      });

      setEmail("");
    } catch (error) {
      let message = "Something went wrong. Please try again.";

      if (error.code === "auth/user-not-found") {
        message = "No account was found with that email address.";
      } else if (error.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (error.code === "auth/too-many-requests") {
        message =
          "Too many attempts detected. Please wait a bit and try again.";
      }

      setStatus({
        loading: false,
        success: "",
        error: message,
      });
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-16">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2">
          <div className="hidden lg:block">
            <div className="max-w-xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                Account Recovery
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 xl:text-5xl">
                Reset your password and get back to Contextra.
              </h1>
              <p className="mt-5 text-lg leading-8 text-gray-600">
                Enter the email linked to your account and we’ll send you a
                secure password reset link so you can continue reading,
                bookmarking, and following the stories that matter to you.
              </p>

              <div className="mt-8 space-y-4 text-sm text-gray-600">
                <div className="rounded-2xl border border-gray-200 p-4">
                  Secure password reset via Firebase Authentication
                </div>
                <div className="rounded-2xl border border-gray-200 p-4">
                  Fast access back to your profile, bookmarks, and notifications
                </div>
                <div className="rounded-2xl border border-gray-200 p-4">
                  Clean, minimal Contextra account recovery flow
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">
              <div className="mb-8 text-center">
                <Link
                  href="/"
                  className="text-2xl font-bold tracking-tight text-gray-900"
                >
                  Contextra
                </Link>
                <h2 className="mt-4 text-3xl font-bold text-gray-900">
                  Forgot Password
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  We’ll email you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black"
                  />
                </div>

                {status.success && (
                  <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {status.success}
                  </div>
                )}

                {status.error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {status.error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status.loading}
                  className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status.loading ? "Sending reset link..." : "Send Reset Link"}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                Remembered your password?{" "}
                <Link href="/login" className="font-semibold text-black hover:underline">
                  Back to Login
                </Link>
              </div>

              <div className="mt-3 text-center text-sm text-gray-600">
                Don’t have an account?{" "}
                <Link href="/signup" className="font-semibold text-black hover:underline">
                  Create one
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}