import React, { useState } from 'react';
import './SignUpPage.css';
import doctorImage from './images/Doctor.png';
import { useNavigate } from 'react-router-dom';
import { 
  auth, 
  createUserWithEmailAndPassword, 
  fetchSignInMethodsForEmail, 
  signInWithEmailAndPassword, 
  linkWithCredential, 
  EmailAuthProvider, 
  googleProvider, 
  signInWithPopup 
} from './firebase'; // Import Firebase utilities

const SignUpPage = () => {
  const navigate = useNavigate(); // React Router hook for navigation

  // State to manage form inputs and error handling
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(''); // Track error messages

  /**
   * Handles the sign-up process using Firebase Authentication.
   */
  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent page reload on form submission

    try {
      // Check if the email is already linked to another authentication method
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);

      if (signInMethods.includes('google.com')) {
        // If the email is registered with Google, ask the user to log in with Google
        setError(
          'This email is already registered with Google. Please log in using Google.'
        );
        await handleGoogleLogin(); // Trigger Google sign-in to link the account
        return;
      }

      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User registered:', userCredential.user);

      // Redirect to the landing page
      navigate('/landing');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        // If email is already used, attempt to link the accounts
        try {
          await linkExistingAccount();
        } catch (linkError) {
          setError(linkError.message); // Display any linking errors
        }
      } else {
        console.error('Sign-up error:', error.message);
        setError(error.message); // Display other sign-up errors
      }
    }
  };

  /**
   * Signs in the user using Google OAuth.
   */
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider); // Google sign-in popup
      console.log('Google sign-in successful:', result.user);

      // Redirect after Google login
      navigate('/landing');
    } catch (error) {
      console.error('Error during Google sign-in:', error.message);
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  /**
   * Links the existing Google account with email-password credentials.
   */
  const linkExistingAccount = async () => {
    const credential = EmailAuthProvider.credential(email, password); // Create email-password credential

    try {
      // Sign in the user with their email-password credentials
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Link the email-password credential with the existing Google account
      await linkWithCredential(user, credential);
      console.log('Accounts linked successfully:', user);

      // Redirect to the landing page after successful linking
      navigate('/landing');
    } catch (error) {
      console.error('Error linking accounts:', error.message);
      setError('Could not link your account. Please try logging in with Google.');
    }
  };

  return (
    <div className="signup-container">
      {/* Left panel with background image */}
      <div className="left-panel" style={{ backgroundImage: `url(${doctorImage})` }}></div>

      {/* Right panel with sign-up form */}
      <div className="right-panel">
        <h2>Medimap+ is here to help you!</h2>
        <form className="signup-form" onSubmit={handleSignUp}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="signup-button">
            Register Account
          </button>

          {/* Display error message if any */}
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
