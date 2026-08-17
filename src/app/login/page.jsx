"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import AuthShell from "@/components/auth/AuthShell";
import FormStatus from "@/components/auth/FormStatus";
import PasswordField from "@/components/auth/PasswordField";
import { ensureReaderProfile, getGoogleAuthErrorMessage, loginWithGoogle } from "@/lib/auth";
import { auth } from "@/lib/firebase";

function getLoginError(code) {
  if (code === "auth/invalid-email") return "Enter a valid email address.";
  if (code === "auth/too-many-requests") return "Too many attempts. Wait a moment before trying again.";
  return "The email or password is incorrect.";
}

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const finishLogin = useCallback(async (user) => {
    try {
      await ensureReaderProfile(user);
    } catch (profileError) {
      console.error("Reader profile creation failed after sign-in:", profileError);
    }

    setSuccess("You’re signed in. Opening your profile…");
    window.setTimeout(() => router.replace("/profile"), 500);
  }, [router]);

  const handleEmailLogin = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading("email");
    try {
      const credential = await signInWithEmailAndPassword(auth, formData.email.trim(), formData.password);
      await finishLogin(credential.user);
    } catch (loginError) {
      setError(getLoginError(loginError.code));
    } finally {
      setLoading("");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setSuccess("");
    setLoading("google");
    try {
      const user = await loginWithGoogle();
      if (user) await finishLogin(user);
    } catch (loginError) {
      setError(getGoogleAuthErrorMessage(loginError, "sign in"));
    } finally {
      setLoading("");
    }
  };

  return (
    <AuthShell eyebrow="Welcome back" title="Sign in to your reading space" description="Continue with saved stories, discussions, notifications, and your personal account." footer={<>New to Contextra? <Link href="/signup" className="font-bold text-slate-950 hover:text-amber-700 dark:text-white dark:hover:text-amber-400">Create an account</Link></>}>
      <FormStatus error={error} success={success} />
      <form onSubmit={handleEmailLogin} className="space-y-5">
        <div>
          <label htmlFor="login-email" className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Email address</label>
          <input id="login-email" type="email" name="email" value={formData.email} onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))} required autoComplete="email" inputMode="email" placeholder="you@example.com" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
        </div>
        <div>
          <div className="mb-2 text-right"><Link href="/forgot-password" className="text-xs font-bold text-amber-700 hover:underline dark:text-amber-400">Forgot password?</Link></div>
          <PasswordField label="Password" id="login-password" name="password" value={formData.password} onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))} required autoComplete="current-password" placeholder="Enter your password" />
        </div>
        <button type="submit" disabled={Boolean(loading)} className="w-full rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-wait disabled:opacity-60 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300">{loading === "email" ? "Signing in…" : "Sign in"}</button>
      </form>
      <div className="my-6 flex items-center gap-3"><div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" /><span className="text-xs font-semibold uppercase tracking-wide text-slate-400">or</span><div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" /></div>
      <button type="button" onClick={handleGoogleLogin} disabled={Boolean(loading)} className="w-full rounded-xl border border-slate-300 px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">{loading === "google" ? "Connecting to Google…" : "Continue with Google"}</button>
    </AuthShell>
  );
}
