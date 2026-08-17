"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import AuthShell from "@/components/auth/AuthShell";
import FormStatus from "@/components/auth/FormStatus";
import PasswordField from "@/components/auth/PasswordField";
import { ensureReaderProfile, getGoogleAuthErrorMessage, loginWithGoogle } from "@/lib/auth";
import { auth } from "@/lib/firebase";

function getSignupError(code) {
  if (code === "auth/email-already-in-use") return "An account already exists for this email. Try signing in instead.";
  if (code === "auth/invalid-email") return "Enter a valid email address.";
  if (code === "auth/weak-password") return "Choose a stronger password with at least six characters.";
  return "We couldn’t create the account. Please try again.";
}

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const completeSignup = useCallback(async (user, fullName = "") => {
    try {
      await ensureReaderProfile(user, fullName);
    } catch (profileError) {
      console.error("Reader profile creation failed after sign-up:", profileError);
    }

    setSuccess("Your account is ready. Opening your profile…");
    window.setTimeout(() => router.replace("/profile"), 500);
  }, [router]);

  const handleEmailSignup = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (formData.password.length < 6) return setError("Use at least six characters for your password.");
    if (formData.password !== formData.confirmPassword) return setError("The two passwords do not match.");

    setLoading("email");
    try {
      const credential = await createUserWithEmailAndPassword(auth, formData.email.trim(), formData.password);
      await updateProfile(credential.user, { displayName: formData.fullName.trim() });
      await completeSignup(credential.user, formData.fullName.trim());
    } catch (signupError) {
      setError(getSignupError(signupError.code));
    } finally {
      setLoading("");
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setSuccess("");
    setLoading("google");
    try {
      const user = await loginWithGoogle();
      if (user) await completeSignup(user);
    } catch (signupError) {
      setError(getGoogleAuthErrorMessage(signupError, "create your account"));
    } finally {
      setLoading("");
    }
  };

  const updateField = (field) => (event) => setFormData((current) => ({ ...current, [field]: event.target.value }));
  const passwordsMatch = formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword;

  return (
    <AuthShell eyebrow="Join Contextra" title="Create your reader account" description="Save reporting, take part in discussions, and keep your news experience organised." footer={<>Already have an account? <Link href="/login" className="font-bold text-slate-950 hover:text-amber-700 dark:text-white dark:hover:text-amber-400">Sign in</Link></>}>
      <FormStatus error={error} success={success} />
      <form onSubmit={handleEmailSignup} className="space-y-5">
        <div><label htmlFor="signup-name" className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Full name</label><input id="signup-name" type="text" value={formData.fullName} onChange={updateField("fullName")} required autoComplete="name" placeholder="How should we address you?" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-950" /></div>
        <div><label htmlFor="signup-email" className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Email address</label><input id="signup-email" type="email" value={formData.email} onChange={updateField("email")} required autoComplete="email" inputMode="email" placeholder="you@example.com" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-950" /></div>
        <PasswordField label="Password" hint="6+ characters" id="signup-password" value={formData.password} onChange={updateField("password")} required minLength={6} autoComplete="new-password" placeholder="Create a password" />
        <PasswordField label="Confirm password" hint={passwordsMatch ? "Passwords match" : "Enter it again"} id="signup-confirm-password" value={formData.confirmPassword} onChange={updateField("confirmPassword")} required minLength={6} autoComplete="new-password" placeholder="Repeat your password" />
        <button type="submit" disabled={Boolean(loading)} className="w-full rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-wait disabled:opacity-60 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300">{loading === "email" ? "Creating account…" : "Create account"}</button>
      </form>
      <div className="my-6 flex items-center gap-3"><div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" /><span className="text-xs font-semibold uppercase tracking-wide text-slate-400">or</span><div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" /></div>
      <button type="button" onClick={handleGoogleSignup} disabled={Boolean(loading)} className="w-full rounded-xl border border-slate-300 px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">{loading === "google" ? "Connecting to Google…" : "Continue with Google"}</button>
    </AuthShell>
  );
}
