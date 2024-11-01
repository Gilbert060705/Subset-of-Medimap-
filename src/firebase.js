/**
 * This module initializes Firebase and configures authentication-related utilities
 * using Firebase Authentication, Firestore, and Storage. It provides methods for 
 * email-password-based authentication and Google sign-in, along with utility functions
 * to monitor user state and manage user sessions.
 *
 * @version 1.4
 */

import { initializeApp } from 'firebase/app'; // Firebase core
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
  sendPasswordResetEmail 
} from 'firebase/auth'; // Firebase Authentication
import { getStorage, getDownloadURL, ref, uploadBytes } from 'firebase/storage'; // Firebase Storage
import { getFirestore, doc, setDoc, updateDoc, getDoc, addDoc, collection, getDocs, deleteDoc } from 'firebase/firestore'; // Firestore

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

/** Firebase services */
const auth = getAuth(app); // Firebase Authentication
const storage = getStorage(app); // Firebase Storage
const db = getFirestore(app); // Firestore Database
const googleProvider = new GoogleAuthProvider(); // Google Authentication Provider

/**
 * Set session persistence to browser session.
 * This ensures that the user's session is persisted until they close the browser tab.
 */
(async () => {
  try {
    await setPersistence(auth, browserSessionPersistence);
    console.log('Session persistence set successfully.');
  } catch (error) {
    console.error('Error setting session persistence:', error);
  }
})();

/**
 * Monitor authentication state changes.
 * This function registers a callback to be invoked whenever the authentication state changes.
 * @param {function} callback - Callback function to handle user state.
 * @returns {function} Unsubscribe function to stop monitoring.
 */
const monitorAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Export Firebase utilities for use throughout the application.
 */
export { 
  auth, 
  googleProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  storage,
  getDownloadURL,
  uploadBytes,
  ref, 
  db, 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc, // Exported for fetching user data
  addDoc,
  collection,
  getDocs, // Added for fetching all documents in a collection
  deleteDoc, // Added for deleting a document
  signInWithPopup, 
  fetchSignInMethodsForEmail, 
  EmailAuthProvider, 
  linkWithCredential, 
  sendPasswordResetEmail, 
  monitorAuthState // Exported to monitor authentication state changes
};
