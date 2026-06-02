"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";
import {
  getUserRole,
  canAccessAdmin,
  isAdmin,
  isEditor,
  hasPermission,
} from "@/lib/permissions";

const AuthContext = createContext(null);

const buildDefaultUserProfile = (currentUser) => {
  return {
    uid: currentUser.uid,
    email: currentUser.email || "",
    displayName: currentUser.displayName || "",
    fullName: currentUser.displayName || "",
    photoURL: currentUser.photoURL || "",
    role: "reader",
    createdAt: null,
    updatedAt: null,
  };
};

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setLoading(true);

        try {
          if (!currentUser) {
            setFirebaseUser(null);
            setUser(null);
            return;
          }

          setFirebaseUser(currentUser);

          const defaultProfile = buildDefaultUserProfile(currentUser);
          const userRef = doc(db, "users", currentUser.uid);

          try {
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              setUser({
                ...defaultProfile,
                ...userSnap.data(),
              });
            } else {
              const newUserProfile = {
                uid: currentUser.uid,
                email: currentUser.email || "",
                displayName: currentUser.displayName || "",
                fullName: currentUser.displayName || "",
                photoURL: currentUser.photoURL || "",
                role: "reader",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              };

              await setDoc(userRef, newUserProfile);

              setUser(defaultProfile);
            }
          } catch (profileError) {
            console.error("User profile load/create failed:", profileError);

            // Fallback: user can still use public reader features
            // even if Firestore profile read/write has a temporary rules issue.
            setUser(defaultProfile);
          }
        } catch (error) {
          console.error("Auth context error:", error);
          setFirebaseUser(null);
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
      console.error("Logout failed:", error);
    }
  };

  const refreshUser = async () => {
    if (!firebaseUser?.uid) return;

    try {
      const defaultProfile = buildDefaultUserProfile(firebaseUser);
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUser({
          ...defaultProfile,
          ...userSnap.data(),
        });
      } else {
        setUser(defaultProfile);
      }
    } catch (error) {
      console.error("Refresh user failed:", error);

      // Keep current session active even if profile refresh fails
      setUser(buildDefaultUserProfile(firebaseUser));
    }
  };

  const value = {
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
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used inside AuthProvider"
    );
  }

  return context;
}

export default AuthContext;