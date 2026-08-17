"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { confirmPasswordReset } from "firebase/auth";
import AuthShell from "@/components/auth/AuthShell";
import FormStatus from "@/components/auth/FormStatus";
import PasswordField from "@/components/auth/PasswordField";
import { auth } from "@/lib/firebase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!oobCode) return setError("This reset link is incomplete or invalid. Request a new one below.");
    if (formData.newPassword.length < 6) return setError("Use at least six characters for your new password.");
    if (formData.newPassword !== formData.confirmPassword) return setError("The two passwords do not match.");

    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, formData.newPassword);
      setSuccess("Your password has been updated. Taking you to sign in…");
      window.setTimeout(() => router.replace("/login"), 700);
    } catch (resetError) {
      if (resetError.code === "auth/expired-action-code") setError("This reset link has expired. Request a new link to continue.");
      else if (resetError.code === "auth/invalid-action-code") setError("This reset link is invalid or has already been used.");
      else if (resetError.code === "auth/weak-password") setError("Choose a stronger password with at least six characters.");
      else setError("We couldn’t reset the password. Please request a new link and try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field) => (event) => setFormData((current) => ({ ...current, [field]: event.target.value }));
  const passwordsMatch = formData.confirmPassword.length > 0 && formData.newPassword === formData.confirmPassword;

  return (
    <AuthShell eyebrow="Secure password reset" title="Choose a new password" description="Create a password you do not use elsewhere. Your saved stories and account details will remain unchanged." footer={<>Need a fresh link? <Link href="/forgot-password" className="font-bold text-slate-950 hover:text-amber-700 dark:text-white dark:hover:text-amber-400">Request another reset email</Link></>}>
      <FormStatus error={error || (!oobCode ? "This page needs a valid reset link from your email." : "")} success={success} />
      <form onSubmit={handleResetPassword} className="space-y-5">
        <PasswordField label="New password" hint="6+ characters" id="new-password" value={formData.newPassword} onChange={updateField("newPassword")} required minLength={6} autoComplete="new-password" placeholder="Create a new password" />
        <PasswordField label="Confirm new password" hint={passwordsMatch ? "Passwords match" : "Enter it again"} id="confirm-new-password" value={formData.confirmPassword} onChange={updateField("confirmPassword")} required minLength={6} autoComplete="new-password" placeholder="Repeat the new password" />
        <button type="submit" disabled={loading || !oobCode} className="w-full rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300">{loading ? "Updating password…" : "Update password"}</button>
      </form>
    </AuthShell>
  );
}
