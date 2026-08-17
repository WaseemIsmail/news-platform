"use client";

import Link from "next/link";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import AuthShell from "@/components/auth/AuthShell";
import FormStatus from "@/components/auth/FormStatus";
import { auth } from "@/lib/firebase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ loading: false, success: "", error: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, success: "", error: "" });

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setStatus({ loading: false, success: "If an account exists for that email, a secure reset link is on its way. Check your inbox and spam folder.", error: "" });
      setEmail("");
    } catch (resetError) {
      if (resetError.code === "auth/invalid-email") {
        setStatus({ loading: false, success: "", error: "Enter a valid email address." });
      } else if (resetError.code === "auth/too-many-requests") {
        setStatus({ loading: false, success: "", error: "Too many attempts. Wait a moment before requesting another link." });
      } else {
        setStatus({ loading: false, success: "", error: "We couldn’t send the reset email. Please try again." });
      }
    }
  };

  return (
    <AuthShell eyebrow="Account recovery" title="Reset your password" description="Enter the email connected to your account. We’ll send a secure link that lets you choose a new password." footer={<>Remembered your password? <Link href="/login" className="font-bold text-slate-950 hover:text-amber-700 dark:text-white dark:hover:text-amber-400">Return to sign in</Link></>}>
      <FormStatus error={status.error} success={status.success} />
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="recovery-email" className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Email address</label>
          <input id="recovery-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" inputMode="email" placeholder="you@example.com" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-950" />
        </div>
        <button type="submit" disabled={status.loading} className="w-full rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-wait disabled:opacity-60 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300">{status.loading ? "Sending secure link…" : "Send reset link"}</button>
      </form>
      <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-600 dark:bg-slate-950 dark:text-slate-400">For your privacy, Contextra does not confirm whether an email is registered. Reset links expire and can only be used once.</div>
    </AuthShell>
  );
}
