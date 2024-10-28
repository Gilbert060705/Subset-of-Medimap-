/**
 * This module initializes Firebase and configures authentication-related utilities
 * using Firebase Authentication. It provides methods for email-password-based 
 * authentication and Google sign-in.
 *
 * Firebase is configured with a specific project setup, and this module exports
 * Firebase authentication utilities for use across the application.
 *
 * @version 1.2
 */

import { initializeApp } from 'firebase/app'; // Import Firebase core
import { 
  getAuth, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  setPersistence, 
  browserSessionPersistence, 
  signInWithPopup, 
  fetchSignInMethodsForEmail, 
  EmailAuthProvider, 
  linkWithCredential, 
  sendPasswordResetEmail // Import for password reset functionality
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore, doc, setDoc, updateDoc } from 'firebase/firestore';

/**
 * Firebase configuration object containing project-specific credentials.
 */
const firebaseConfig = {
  apiKey: "AIzaSyCkFI-TfVZFatRkgSKGbqKnJEGeFgjDAyE",
  authDomain: "sc2006-89c81.firebaseapp.com",
  projectId: "sc2006-89c81",
  storageBucket: "sc2006-89c81.appspot.com",
  messagingSenderId: "815636358065",
  appId: "1:815636358065:web:6cd00783cf097c2d589390",
  measurementId: "G-BG1GYX3CSQ"
};

/** Initialize Firebase app with the provided configuration. */
const app = initializeApp(firebaseConfig);

/** Initialize Firebase Authentication. */
const auth = getAuth(app);

/** Initialize Firebase Storage. */
const storage = getStorage(app);

/** Initialize Firestore Database. */
const db = getFirestore(app);

/** Google authentication provider instance. */
const googleProvider = new GoogleAuthProvider();

/** Set session persistence to browser session. */
(async () => {
  try {
    await setPersistence(auth, browserSessionPersistence);
    console.log('Session persistence set successfully.');
  } catch (error) {
    console.error('Error setting persistence:', error);
  }
})();

/**
 * Monitor authentication state changes.
 * @param {function} callback - Callback function to handle user state.
 */
const monitorAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/** Export Firebase utilities. */
export { 
  auth, 
  googleProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  storage, 
  db, 
  doc, 
  setDoc, 
  updateDoc, 
  signInWithPopup, 
  fetchSignInMethodsForEmail, 
  EmailAuthProvider, 
  linkWithCredential, 
  sendPasswordResetEmail, 
  monitorAuthState // Export monitorAuthState for auth changes
};
