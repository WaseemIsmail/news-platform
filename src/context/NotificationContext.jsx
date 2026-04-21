"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useAuthContext } from "@/context/AuthContext";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user, loading: authLoading } = useAuthContext();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user?.uid) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    fetchNotifications();
  }, [user?.uid, authLoading]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const notificationsQuery = query(
        collection(db, "notifications"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(notificationsQuery);

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setNotifications(data);
    } catch (error) {
      console.error("Notification fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = async ({
    title,
    message,
    type = "general",
    href = "",
  }) => {
    if (!user?.uid) return;

    try {
      const payload = {
        userId: user.uid,
        title: title || "Notification",
        message: message || "",
        type,
        href,
        read: false,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, "notifications"),
        payload
      );

      setNotifications((prev) => [
        {
          id: docRef.id,
          ...payload,
        },
        ...prev,
      ]);
    } catch (error) {
      console.error("Add notification failed:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    if (!notificationId) return;

    try {
      await updateDoc(
        doc(db, "notifications", notificationId),
        {
          read: true,
          updatedAt: serverTimestamp(),
        }
      );

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notificationId
            ? { ...item, read: true }
            : item
        )
      );
    } catch (error) {
      console.error("Mark as read failed:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(
        (item) => !item.read
      );

      await Promise.all(
        unreadNotifications.map((item) =>
          updateDoc(doc(db, "notifications", item.id), {
            read: true,
            updatedAt: serverTimestamp(),
          })
        )
      );

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          read: true,
        }))
      );
    } catch (error) {
      console.error("Mark all as read failed:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    if (!notificationId) return;

    try {
      await deleteDoc(
        doc(db, "notifications", notificationId)
      );

      setNotifications((prev) =>
        prev.filter((item) => item.id !== notificationId)
      );
    } catch (error) {
      console.error("Delete notification failed:", error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await Promise.all(
        notifications.map((item) =>
          deleteDoc(doc(db, "notifications", item.id))
        )
      );

      setNotifications([]);
    } catch (error) {
      console.error("Clear notifications failed:", error);
    }
  };

  const unreadCount = useMemo(() => {
    return notifications.filter((item) => !item.read).length;
  }, [notifications]);

  const value = {
    notifications,
    unreadCount,
    loading,

    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    refreshNotifications: fetchNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotificationContext must be used inside NotificationProvider"
    );
  }

  return context;
}

export default NotificationContext;