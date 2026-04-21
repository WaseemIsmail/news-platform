import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/*
====================================
Create / Save User Profile
====================================
*/
export const createUserProfile = async (user) => {
  if (!user?.uid) return null;

  const userRef = doc(db, "users", user.uid);

  const existingUser = await getDoc(userRef);

  if (!existingUser.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      fullName: user.displayName || "Contextra User",
      email: user.email || "",
      photoURL: user.photoURL || "",
      role: "reader",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  return true;
};

/*
====================================
Fetch User Profile
====================================
*/
export const fetchUserProfile = async (userId) => {
  if (!userId) return null;

  const userRef = doc(db, "users", userId);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

/*
====================================
Update User Profile
====================================
*/
export const updateUserProfile = async (userId, updates = {}) => {
  if (!userId) return null;

  const userRef = doc(db, "users", userId);

  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });

  return true;
};