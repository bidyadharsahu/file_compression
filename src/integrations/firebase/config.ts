import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration - you'll need to replace these with your actual config values
const firebaseConfig = {
  apiKey: "AIzaSyBNnzX0JzY8RPgdkStGsYVnhl7FQXtF6cw",
  authDomain: "filecompression-8f304.firebaseapp.com",
  databaseURL: "https://filecompression-8f304-default-rtdb.firebaseio.com",
  projectId: "filecompression-8f304",
  storageBucket: "filecompression-8f304.firebasestorage.app", // Keep this for Firebase config but won't use Storage
  messagingSenderId: "583559270549",
  appId: "1:583559270549:web:17c12ce7172869f2838b9c",
  measurementId: "G-B3JXB4GWB3"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services (removed storage)
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
