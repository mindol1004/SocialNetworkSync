import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim(),
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim()}.firebaseapp.com`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim(),
  storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim()}.appspot.com`,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim(),
  databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim()}-default-rtdb.firebaseio.com`
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

export const getCurrentUser = () => {
  return auth.currentUser;
};

export { auth, database, googleProvider };
