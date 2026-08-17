import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const getGoogleAuthErrorMessage = (error, action = "sign in") => {
  const code = error?.code || "";

  if (code === "auth/unauthorized-domain") {
    const domain = typeof window !== "undefined" ? window.location.hostname : "this website";
    return `Google sign-in is not authorised for ${domain}. Add this domain in Firebase Authentication settings.`;
  }
  if (code === "auth/operation-not-allowed") {
    return "Google sign-in is not enabled for this Firebase project. Enable the Google provider in Firebase Authentication.";
  }
  if (code === "auth/popup-closed-by-user") {
    return "The Google sign-in window was closed before completion.";
  }
  if (code === "auth/popup-blocked") {
    return "Your browser blocked the Google sign-in window. Allow popups or try again in your normal browser.";
  }
  if (code === "auth/account-exists-with-different-credential") {
    return "An account already exists with this email using another sign-in method. Sign in with that method first.";
  }
  if (code === "auth/network-request-failed") {
    return "Google could not be reached. Check your internet connection and try again.";
  }
  if (code === "auth/web-storage-unsupported") {
    return "This browser is blocking the storage required for Google sign-in. Enable cookies or open the site in your normal browser.";
  }

  return `We couldn’t ${action} with Google. Please try again${code ? ` (${code})` : "."}`;
};

export const ensureReaderProfile = async (user, fullName = "") => {
  const userRef = doc(db, "users", user.uid);
  const existingUser = await getDoc(userRef);

  if (existingUser.exists()) return;

  await setDoc(userRef, {
    uid: user.uid,
    fullName: fullName || user.displayName || "",
    displayName: fullName || user.displayName || "",
    email: user.email || "",
    photoURL: user.photoURL || "",
    role: "reader",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const observeAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};
