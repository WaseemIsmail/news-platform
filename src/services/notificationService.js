import {
  collection,
  doc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/*
====================================
Create Notification
====================================
*/
export const createNotification = async ({
  userId,
  title,
  message,
  link = "",
}) => {
  if (!userId) return null;

  const notificationsRef = collection(db, "notifications");

  await addDoc(notificationsRef, {
    userId,
    title: title || "New Notification",
    message:
      message || "You have received a new notification.",
    link,
    isRead: false,
    createdAt: serverTimestamp(),
  });

  return true;
};

/*
====================================
Fetch User Notifications
====================================
*/
export const fetchUserNotifications = async (userId) => {
  if (!userId) return [];

  const notificationsRef = collection(db, "notifications");

  const q = query(
    notificationsRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/*
====================================
Mark Notification as Read
====================================
*/
export const markNotificationAsRead = async (
  notificationId
) => {
  if (!notificationId) return null;

  const notificationRef = doc(
    db,
    "notifications",
    notificationId
  );

  await updateDoc(notificationRef, {
    isRead: true,
  });

  return true;
};