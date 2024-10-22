/**
 * LoginPage component handles user authentication through email/password 
 * and Google login using Firebase. It also manages the authentication state 
 * and provides options for logging in via social platforms or logging out.
 *
 * Dependencies:
 * - React for UI rendering
 * - react-router-dom for navigation between pages
 * - Firebase authentication for login and logout functionality
 * - CSS for component styling
 * 
 * Features:
 * - Email/password login with Firebase
 * - Google login via popup using Firebase
 * - Logout functionality
 * - Authentication state tracking using Firebase's onAuthStateChanged
 * - Conditional rendering of login or logout UI
 * 
 * Note: If the user is logged in, the application redirects them to the landing page.
 * 
 * @author [Group1]
 * @version 1.0
 */

import React, { useEffect, useState, useCallback } from 'react';
import './LoginPage.css'; // Import CSS for styling
import doctorImage from './images/Doctor.png'; // Background doctor image
import facebookIcon from './images/facebook.png'; // Facebook login icon
import linkedinIcon from './images/linkedin.png'; // LinkedIn login icon
import googleIcon from './images/google.png'; // Google login icon
import { Link, useNavigate } from 'react-router-dom'; // Navigation utilities
import { auth, googleProvider } from './firebase'; // Firebase authentication setup
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword 
} from 'firebase/auth'; // Firebase authentication methods

/**
 * LoginPage component provides the login interface and manages the authentication flow.
 *
 * @return {JSX.Element} JSX layout for the login page.
 */
const LoginPage = () => {
  const [loading, setLoading] = useState(false); // Track loading state
  const [user, setUser] = useState(null); // Store the authenticated user
  const [errorMessage, setErrorMessage] = useState(null); // Store error messages
  const [email, setEmail] = useState(''); // Store user email input
  const [password, setPassword] = useState(''); // Store user password input
  const navigate = useNavigate(); // Hook for navigation

  /**
   * Callback function to navigate to the landing page upon successful login.
   *
   * @param user The authenticated user object.
   */
  const redirectToLanding = useCallback((user) => {
    console.log('Navigating to landing page with user:', user);
    alert(`Welcome ${user.displayName || email}!`);
    navigate('/landing'); // Navigate to landing page
  }, [navigate, email]);

  /**
   * Track authentication state changes using Firebase's onAuthStateChanged.
   * If a user is authenticated, it updates the user state.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log('User detected:', currentUser);
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Clean up the subscription
  }, []);

  /**
   * Handle login using email and password with Firebase authentication.
   */
  const handleEmailLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Email login successful:', result.user);
      redirectToLanding(result.user);
    } catch (error) {
      console.error('Email login failed:', error);
      setErrorMessage('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Google login using a popup with Firebase authentication.
   */
  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google login successful:', result.user);
      redirectToLanding(result.user);
    } catch (error) {
      console.error('Google Login failed:', error);
      setErrorMessage('Google Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle user logout with Firebase authentication.
   */
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out');
      setUser(null);
      navigate('/'); // Redirect to login page
    } catch (error) {
      console.error('Logout failed:', error);
      setErrorMessage('Logout failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="left-panel" style={{ backgroundImage: `url(${doctorImage})` }}></div>

      <div className="right-panel">
        <h2>Welcome Back!</h2>
        <p>Login to continue</p>

        {loading ? (
          <div className="loading-indicator">Loading...</div>
        ) : (
          <>
            {!user ? (
              <form className="login-form" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div className="remember-forgot">
                  <label>
                    <input type="checkbox" /> Remember me
                  </label>
                  <a href="/">Forgot Password?</a>
                </div>

                <button
                  type="button"
                  onClick={handleEmailLogin}
                  className="login-button"
                >
                  Login now
                </button>
              </form>
            ) : (
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            )}

            <div className="login-options">
              <p>Or Login with</p>
              <div className="social-login">
                <button className="social-btn" onClick={handleGoogleLogin}>
                  <img src={googleIcon} alt="Google" className="social-icon" />
                </button>
                <button className="social-btn">
                  <img src={facebookIcon} alt="Facebook" className="social-icon" />
                </button>
                <button className="social-btn">
                  <img src={linkedinIcon} alt="LinkedIn" className="social-icon" />
                </button>
              </div>
              <p>
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </p>
            </div>
          </>
        )}

        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default LoginPage;
