/**
 * This module initializes Firebase and configures authentication-related utilities
 * using Firebase Authentication. It provides methods for email-password-based 
 * authentication and Google sign-in.
 * 
 * <p>Firebase is configured with a specific project setup, and this module exports
 * Firebase authentication utilities for use across the application.</p>
 * 
 * Dependencies:
 * - firebase/app
 * - firebase/auth
 * 
 * Features:
 * - Firebase initialization
 * - Google authentication provider
 * - Email-password-based authentication methods
 * - Session persistence setup
 * 
 * Note: Sensitive information like API keys and configuration values should be secured.
 * 
 * @author [Group1]
 * @version 1.0
 */

import { initializeApp } from 'firebase/app'; // Import Firebase core
import { 
    getAuth, 
    GoogleAuthProvider, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    setPersistence, 
    browserSessionPersistence 
} from 'firebase/auth'; // Import Firebase authentication utilities

/**
 * Firebase configuration object containing project-specific credentials.
 * This includes API key, authentication domain, project ID, storage bucket, 
 * messaging sender ID, app ID, and measurement ID.
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
 * <p>If there is an error during the session persistence setup, the error
 * is logged to the console for debugging.</p>
 */
setPersistence(auth, browserSessionPersistence).catch((error) => {
    console.error('Error setting persistence:', error);
});

/**
 * Exports Firebase authentication utilities for use throughout the application.
 * 
 * Exported Items:
 * - `auth`: Firebase authentication instance
 * - `googleProvider`: Google authentication provider
 * - `createUserWithEmailAndPassword`: Method for registering a user with email and password
 * - `signInWithEmailAndPassword`: Method for signing in a user with email and password
 * - `signOut`: Method for signing out the authenticated user
 */
export { 
    auth, 
    googleProvider, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
};
