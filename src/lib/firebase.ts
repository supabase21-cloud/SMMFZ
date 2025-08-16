
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getMessaging, type Messaging } from "firebase/messaging";
import { getFirestore, type Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
// IMPORTANT: Replace with your actual Firebase config
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;
let messaging: Messaging | null = null;

if (firebaseConfig.projectId) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  if (typeof window !== 'undefined') {
    messaging = getMessaging(app);
  }
} else {
  console.warn("Firebase config is missing projectId. Firebase will not be initialized.");
  // Provide dummy objects to prevent app crash if Firebase is not configured
  app = {} as FirebaseApp;
  db = {} as Firestore;
}


export { db, app, messaging };
