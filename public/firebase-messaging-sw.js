// Scripts for Firebase products are imported on-demand
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC70OlcLM5951-zAow71o1xZpLE6vmTggw",
  authDomain: "instaboost-pro-5kkrn.firebaseapp.com",
  projectId: "instaboost-pro-5kkrn",
  storageBucket: "instaboost-pro-5kkrn.appspot.com",
  messagingSenderId: "562500641317",
  appId: "1:562500641317:web:0bd7c250d44a8c25c895cc",
  measurementId: "G-PGTWQQ0BMR"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

onBackgroundMessage(messaging, (payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
