/**
 * This module initializes Firebase and configures authentication-related utilities
 * using Firebase Authentication. It provides methods for email-password-based 
 * authentication and Google sign-in.
 * 
 * Firebase is configured with a specific project setup, and this module exports
 * Firebase authentication utilities for use across the application.
 * 
 * @version 1.1
 */

import { initializeApp } from 'firebase/app'; // Import Firebase core
import { 
  getAuth, 
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

/**
 * Initializes the Firebase application with the provided configuration.
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase Authentication service initialized using the Firebase app instance.
 */
const auth = getAuth(app);

/**
 * Firebase storage service initialized using the Firebase app instance.
 */
const storage = getStorage(app);

/**
 * Firestore database service initialized using the Firebase app instance.
 */
const db = getFirestore(app);

/**
 * Google authentication provider instance used for OAuth-based sign-in.
 */
const googleProvider = new GoogleAuthProvider();

/**
 * Configures session persistence to maintain authentication state across 
 * browser sessions (i.e., prevents auto-login across page reloads).
 */
setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.error('Error setting persistence:', error);
});

/**
 * Exports Firebase authentication utilities for use throughout the application.
 */
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
    sendPasswordResetEmail // Exported for password reset
};
