// SignUpPage.js

import React, { useState } from 'react';
import './SignUpPage.css';
import doctorImage from './images/Doctor.png';
import { useNavigate } from 'react-router-dom';
import { 
  auth, 
  createUserWithEmailAndPassword 
} from './firebase'; // Import Firebase utilities

const SignUpPage = () => {
  const navigate = useNavigate(); // Hook to navigate between pages

  // State to manage form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(''); // Track errors (if any)

  /**
   * Handles the sign-up process using Firebase Authentication.
   */
  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page

    try {
      // Create a new user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        email, 
        password
      );

      // Successfully created the user
      const user = userCredential.user;
      console.log('User registered:', user);

      // Redirect to the landing page after sign-up
      navigate('/landing');
    } catch (error) {
      console.error('Sign-up error:', error.message);
      setError(error.message); // Display the error message to the user
    }
  };

  return (
    <div className="signup-container">
      {/* Left panel with background image */}
      <div className="left-panel" style={{ backgroundImage: `url(${doctorImage})` }}></div>

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
