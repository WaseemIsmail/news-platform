"use client";

import { useState } from "react";
import Link from "next/link";
import { confirmPasswordReset } from "firebase/auth";
import { useSearchParams, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const oobCode = searchParams.get("oobCode");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!oobCode) {
      setError("Invalid or expired password reset link.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await confirmPasswordReset(
        auth,
        oobCode,
        formData.newPassword
      );

      setSuccess("Password has been reset successfully!");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      console.error(err);

      let message = "Failed to reset password.";

      if (err.code === "auth/expired-action-code") {
        message = "This reset link has expired.";
      } else if (err.code === "auth/invalid-action-code") {
        message = "Invalid reset link.";
      } else if (err.code === "auth/weak-password") {
        message = "Password is too weak.";
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-16">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2">
          {/* Left Side */}
          <div className="hidden lg:block">
            <div className="max-w-xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                Secure Password Reset
              </p>

              <h1 className="text-4xl font-bold tracking-tight text-gray-900 xl:text-5xl">
                Create your new password for Contextra.
              </h1>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                Choose a strong password to keep your account secure and
                continue reading, saving articles, and following the stories
                that matter most to you.
              </p>

              <div className="mt-8 space-y-4 text-sm text-gray-600">
                <div className="rounded-2xl border border-gray-200 p-4">
                  Secure reset powered by Firebase Authentication
                </div>

                <div className="rounded-2xl border border-gray-200 p-4">
                  Fast recovery for your profile and saved content
                </div>

                <div className="rounded-2xl border border-gray-200 p-4">
                  Seamless Contextra account security flow
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
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
                  Reset Password
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Set a new password for your account.
                </p>
              </div>

              {/* Success */}
              {success && (
                <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleResetPassword}
                className="space-y-5"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    New Password
                  </label>

                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    placeholder="Enter new password"
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm new password"
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Resetting Password..." : "Reset Password"}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                Back to{" "}
                <Link
                  href="/login"
                  className="font-semibold text-black hover:underline"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}