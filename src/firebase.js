/**
 * This module initializes Firebase and configures authentication-related utilities
 * using Firebase Authentication. It provides methods for email-password-based 
 * authentication and Google sign-in.
 * 
 * Firebase is configured with a specific project setup, and this module exports
 * Firebase authentication utilities for use across the application.
 * 
 * Dependencies:
 * - firebase/app
 * - firebase/auth
 * 
 * Features:
 * - Firebase initialization
 * - Google authentication provider
 * - Email-password-based authentication methods
 * - Account linking utilities
 * - Session persistence setup
 * 
 * Note: Sensitive information like API keys and configuration values should be secured.
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
  signInWithPopup, // Import for Google sign-in
  fetchSignInMethodsForEmail, // Import for checking existing sign-in methods
  EmailAuthProvider, // Import for creating email-password credentials
  linkWithCredential // Import for linking accounts
} from 'firebase/auth';
import { storage } from 'firebase/storage'
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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
 * Google authentication provider instance used for OAuth-based sign-in.
 */
const googleProvider = new GoogleAuthProvider();

/**
 * Configures session persistence to maintain authentication state across 
 * browser sessions (i.e., prevents auto-login across page reloads).
 *
 * If there is an error during the session persistence setup, the error
 * is logged to the console for debugging.
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
    getFirestore, 
    doc, 
    setDoc,
    signInWithPopup, // Exported for Google sign-in
    fetchSignInMethodsForEmail, // Exported to check existing sign-in methods
    EmailAuthProvider, // Exported to create email-password credentials
    linkWithCredential // Exported to link accounts
};
