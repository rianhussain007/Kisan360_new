import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQgnfWmP17LmUEksQvq_HmcNSj5umlSGI",
  authDomain: "kisan360-aa512.firebaseapp.com",
  projectId: "kisan360-aa512",
  storageBucket: "kisan360-aa512.firebasestorage.app",
  messagingSenderId: "226580375825",
  appId: "1:226580375825:web:928d3b094263d99117c4b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Optional: Set up Google Auth Provider
import { GoogleAuthProvider } from 'firebase/auth';
export const googleProvider = new GoogleAuthProvider();

// Initialize Firebase function for App.tsx
export const initializeFirebase = async () => {
  try {
    // Firebase is initialized when this module is imported
    // You can add any additional initialization logic here
    console.log('Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
};
