/**
 * SignUpPage component renders the registration interface for users 
 * of the MediMap+ application. It provides a simple form for users 
 * to enter their details and select their role.
 * 
 * Dependencies:
 * - React for UI rendering
 * - react-router-dom for navigation
 * - CSS for component styling
 * 
 * Features:
 * - Collects user information such as email, full name, role, and password.
 * - Redirects to the landing page upon successful sign-up.
 * 
 * Note: In a real-world scenario, the form would handle and validate 
 * user input data before registration.
 * 
 * @version 1.0
 * @since [15/09/2024]
 */

import React from 'react';
import './SignUpPage.css'; // Import CSS for Sign-Up page styling
import doctorImage from './images/Doctor.png'; // Background image for the left panel
import { useNavigate } from 'react-router-dom'; // Navigation hook for redirection

/**
 * SignUpPage component renders the sign-up form for new users.
 *
 * @return {JSX.Element} JSX layout for the sign-up page.
 */
const SignUpPage = () => {
  const navigate = useNavigate(); // Hook to navigate between pages

  /**
   * Handles the sign-up process. 
   * Simulates successful registration by redirecting to the landing page.
   */
  const handleSignUp = () => {
    // In a real application, handle form data and validation here
    navigate('/landing');  // Redirect to the landing page after signup
  };

  return (
    <div className="signup-container">
      {/* Left panel with background image */}
      <div className="left-panel" style={{ backgroundImage: `url(${doctorImage})` }}></div>

      <div className="right-panel">
        <h2>Medimap+ is here to help you!</h2>
        <form className="signup-form">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Email" />

          <label htmlFor="fullName">Full Name</label>
          <input type="text" id="fullName" placeholder="Full Name" />

          <label>Role</label>
          <div className="role-options">
            <label>
              <input type="checkbox" /> Admin
            </label>
            <label>
              <input type="checkbox" /> Patient
            </label>
          </div>

          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Password" />

          <button
            type="button"
            onClick={handleSignUp}
            className="signup-button"
          >
            Register Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
