// Firebase client initialization
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Add other Firebase SDK imports as needed (auth, firestore, storage, etc.)

const firebaseConfig = {
  apiKey: "AIzaSyBNnzX0JzY8RPgdkStGsYVnhl7FQXtF6cw",
  authDomain: "filecompression-8f304.firebaseapp.com",
  databaseURL: "https://filecompression-8f304-default-rtdb.firebaseio.com",
  projectId: "filecompression-8f304",
  storageBucket: "filecompression-8f304.firebasestorage.app",
  messagingSenderId: "583559270549",
  appId: "1:583559270549:web:17c12ce7172869f2838b9c",
  measurementId: "G-B3JXB4GWB3"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
