
"use client";

import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";
import { supabase } from "./supabase";

const VAPID_KEY = "BN5T6jU_E9d-Yq4VNu2Sxg_5Y-k-kXvjGz_wZc4YJ5rX8nZq9vE8sC7oQ3fJ-fHlI0bL_wZc4YJ5rX8nZq9vE";

export const requestNotificationPermission = async () => {
  if (!messaging) {
    console.log("Firebase Messaging is not initialized.");
    return null;
  }
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
      });
      return token;
    } else {
      console.log("Unable to get permission to notify.");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while requesting permission or getting token:", error);
    return null;
  }
};

export const saveTokenToDb = async (userId: string, token: string) => {
    if (!userId || !token) return;

    const { error } = await supabase
        .from('users')
        .update({ fcm_token: token })
        .eq('id', userId);

    if (error) {
        console.error("Error saving FCM token to DB:", error);
    } else {
        console.log("FCM Token saved to DB successfully for user:", userId);
    }
};

// You can re-enable this if you need to handle foreground messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (messaging) {
        // This part is commented out to keep it simple.
        // You can add logic here to show an in-app notification.
        // onMessage(messaging, (payload) => {
        //   console.log('Received foreground message: ', payload);
        //   resolve(payload);
        // });
    }
  });

