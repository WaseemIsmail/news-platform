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

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [user, setUser] = useState(null);

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
            fullName: currentUser.displayName || "",
            photoURL: currentUser.photoURL || "",
            role: "reader",
            createdAt: null,
          };

          if (userSnap.exists()) {
            profileData = {
              ...profileData,
              ...userSnap.data(),
            };
          } else {
            await setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email || "",
              displayName: currentUser.displayName || "",
              fullName: currentUser.displayName || "",
              photoURL: currentUser.photoURL || "",
              role: "reader",
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          }

          setUser(profileData);
        } catch (error) {
          console.error("Auth context error:", error);
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
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || "",
          photoURL: firebaseUser.photoURL || "",
          ...userSnap.data(),
        });
      }
    } catch (error) {
      console.error("Refresh user failed:", error);
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