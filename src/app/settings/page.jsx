"use client";

import { useState } from "react";
import { EmailAuthProvider, reauthenticateWithCredential, sendEmailVerification, updatePassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import AccountShell from "@/components/account/AccountShell";
import AccountState from "@/components/account/AccountState";
import FormStatus from "@/components/auth/FormStatus";
import PasswordField from "@/components/auth/PasswordField";
import { useAuthContext } from "@/context/AuthContext";
import { db } from "@/lib/firebase";

function SettingsForms({ user, firebaseUser, refreshUser }) {
  const [fullName, setFullName] = useState(user.fullName || user.displayName || "");
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loadingAction, setLoadingAction] = useState("");
  const [profileStatus, setProfileStatus] = useState({ error: "", success: "" });
  const [securityStatus, setSecurityStatus] = useState({ error: "", success: "" });
  const usesPassword = firebaseUser?.providerData?.some((provider) => provider.providerId === "password");

  const updateField = (field) => (event) => setPasswordData((current) => ({ ...current, [field]: event.target.value }));

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    const cleanName = fullName.trim();
    if (cleanName.length < 2) return setProfileStatus({ error: "Enter a name with at least two characters.", success: "" });

    setLoadingAction("profile");
    setProfileStatus({ error: "", success: "" });
    try {
      await updateProfile(firebaseUser, { displayName: cleanName });
      await updateDoc(doc(db, "users", user.uid), { fullName: cleanName, displayName: cleanName, updatedAt: serverTimestamp() });
      await refreshUser();
      setProfileStatus({ error: "", success: "Your profile name has been updated." });
    } catch (profileError) {
      console.error("Profile update failed:", profileError);
      setProfileStatus({ error: "We couldn’t update your profile. Please try again.", success: "" });
    } finally {
      setLoadingAction("");
    }
  };

  const handleUpdatePassword = async (event) => {
    event.preventDefault();
    setSecurityStatus({ error: "", success: "" });
    if (passwordData.newPassword.length < 6) return setSecurityStatus({ error: "Use at least six characters for your new password.", success: "" });
    if (passwordData.newPassword !== passwordData.confirmPassword) return setSecurityStatus({ error: "The two new passwords do not match.", success: "" });

    setLoadingAction("password");
    try {
      const credential = EmailAuthProvider.credential(firebaseUser.email, passwordData.currentPassword);
      await reauthenticateWithCredential(firebaseUser, credential);
      await updatePassword(firebaseUser, passwordData.newPassword);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setSecurityStatus({ error: "", success: "Your password has been updated securely." });
    } catch (passwordError) {
      console.error("Password update failed:", passwordError);
      const message = passwordError.code === "auth/invalid-credential" || passwordError.code === "auth/wrong-password" ? "Your current password is incorrect." : passwordError.code === "auth/requires-recent-login" ? "For security, sign out and sign back in before changing your password." : "We couldn’t update your password. Please try again.";
      setSecurityStatus({ error: message, success: "" });
    } finally {
      setLoadingAction("");
    }
  };

  const handleVerification = async () => {
    setLoadingAction("verification");
    setSecurityStatus({ error: "", success: "" });
    try {
      await sendEmailVerification(firebaseUser);
      setSecurityStatus({ error: "", success: "Verification email sent. Open the link in your inbox, then sign in again." });
    } catch (verificationError) {
      console.error("Verification email failed:", verificationError);
      setSecurityStatus({ error: "We couldn’t send the verification email. Please wait and try again.", success: "" });
    } finally {
      setLoadingAction("");
    }
  };

  return (
    <AccountShell eyebrow="Account controls" title="Profile and security" description="Update how your name appears and keep access to your reader account secure.">
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">Profile</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight">Public account details</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Your display name appears beside comments and reader activity.</p>
          <div className="mt-5"><FormStatus error={profileStatus.error} success={profileStatus.success} /></div>
          <form onSubmit={handleUpdateProfile} className="mt-6 space-y-5">
            <div><label htmlFor="settings-name" className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Display name</label><input id="settings-name" type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} required autoComplete="name" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-950" /></div>
            <div><label htmlFor="settings-email" className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Email address</label><input id="settings-email" type="email" value={user.email || ""} disabled className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950" /><p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Email changes require a separate identity-verification flow and are not available here yet.</p></div>
            <button type="submit" disabled={Boolean(loadingAction)} className="w-full rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-wait disabled:opacity-60 dark:bg-amber-400 dark:text-slate-950">{loadingAction === "profile" ? "Saving profile…" : "Save profile"}</button>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">Security</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight">Sign-in protection</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Manage password access and verify ownership of your email.</p>
          <div className="mt-5"><FormStatus error={securityStatus.error} success={securityStatus.success} /></div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"><div className="flex items-center justify-between gap-4"><div><h3 className="text-sm font-black">Email verification</h3><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{firebaseUser.emailVerified ? "Your email address is verified." : "Verify your email to strengthen account recovery."}</p></div>{firebaseUser.emailVerified ? <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">Verified</span> : <button type="button" onClick={handleVerification} disabled={Boolean(loadingAction)} className="shrink-0 rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold hover:bg-white disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800">{loadingAction === "verification" ? "Sending…" : "Send email"}</button>}</div></div>

          {usesPassword ? (
            <form onSubmit={handleUpdatePassword} className="mt-6 space-y-5">
              <PasswordField label="Current password" id="current-password" value={passwordData.currentPassword} onChange={updateField("currentPassword")} required autoComplete="current-password" placeholder="Confirm your current password" />
              <PasswordField label="New password" hint="6+ characters" id="settings-new-password" value={passwordData.newPassword} onChange={updateField("newPassword")} required minLength={6} autoComplete="new-password" placeholder="Create a new password" />
              <PasswordField label="Confirm new password" id="settings-confirm-password" value={passwordData.confirmPassword} onChange={updateField("confirmPassword")} required minLength={6} autoComplete="new-password" placeholder="Repeat the new password" />
              <button type="submit" disabled={Boolean(loadingAction)} className="w-full rounded-xl border border-slate-950 px-5 py-3.5 text-sm font-bold transition hover:bg-slate-950 hover:text-white disabled:cursor-wait disabled:opacity-60 dark:border-slate-600 dark:hover:bg-slate-800">{loadingAction === "password" ? "Updating password…" : "Update password"}</button>
            </form>
          ) : (
            <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/30"><h3 className="font-black text-blue-950 dark:text-blue-200">Password managed by your sign-in provider</h3><p className="mt-2 text-sm leading-6 text-blue-800 dark:text-blue-300">You signed in with Google or another provider. Change your password through that provider’s account security settings.</p></div>
          )}
        </section>
      </div>
    </AccountShell>
  );
}

export default function SettingsPage() {
  const { user, firebaseUser, loading, refreshUser } = useAuthContext();
  if (loading) return <AccountState loading />;
  if (!user || !firebaseUser) return <AccountState title="Sign in to manage settings" description="Profile and security controls are available only after you sign in." />;
  return <SettingsForms key={user.uid} user={user} firebaseUser={firebaseUser} refreshUser={refreshUser} />;
}
