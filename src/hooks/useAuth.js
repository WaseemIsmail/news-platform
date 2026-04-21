"use client";

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";
import {
  getUserRole,
  hasPermission,
  canAccessAdmin,
  isAdmin,
  isEditor,
} from "@/lib/permissions";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        try {
          if (!currentUser) {
            setFirebaseUser(null);
            setUser(null);
            setLoading(false);
            return;
          }

          setFirebaseUser(currentUser);

          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          let profileData = {
            uid: currentUser.uid,
            email: currentUser.email || "",
            displayName: currentUser.displayName || "",
            photoURL: currentUser.photoURL || "",
            role: "reader",
          };

          if (userSnap.exists()) {
            profileData = {
              ...profileData,
              ...userSnap.data(),
            };
          }

          setUser(profileData);
        } catch (error) {
          console.error("Auth loading error:", error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    user,
    firebaseUser,
    loading,

    isAuthenticated: !!firebaseUser,

    role: getUserRole(user),

    isAdmin: isAdmin(user),
    isEditor: isEditor(user),
    canAccessAdmin: canAccessAdmin(user),

    hasPermission: (permission) =>
      hasPermission(user, permission),

    logout,
  };
}