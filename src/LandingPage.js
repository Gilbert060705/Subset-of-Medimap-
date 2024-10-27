/**
 * LandingPage component serves as the entry point for the MediMap+ application.
 * It displays a welcoming interface with navigation options and a call-to-action button 
 * that redirects the user to the homepage.
 *
 * Dependencies:
 * - React for UI rendering
 * - react-router-dom for navigation
 * - CSS for component styling
 * 
 * Features:
 * - Header with navigation links and icons
 * - Main section with a welcoming message and decorative elements
 * - Navigation to homepage on button click
 * 
 * Note: All images are imported and used within the layout to enhance the visual appeal.
 * 
 * @author [Group1]
 * @version 1.0
 * @since [15/09/2024]
 */

import React from 'react';
import './LandingPage.css';  // Import CSS for styling
import logo from './images/logo.png';  // Import logo image
import profilePic from './images/personProfile.png';  // Import profile icon
import menuIcon from './images/threeLinesMenu.png';  // Import menu icon
import femaleDoctor from './images/femaleDoctor.webp';  // Import doctor image
import blueHeart from './images/hazyHeart.png';  // Import heart decoration
import shieldIcon from './images/shield.png';  // Import shield icon
import catchyText from './images/catchy.png';  // Import catchy hospitals image
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation

/**
 * The LandingPage component provides the landing interface of the MediMap+ application.
 * 
 * @return {JSX.Element} JSX code for the landing page layout.
 */
const LandingPage = () => {
  const navigate = useNavigate();  // Hook to manage navigation

  /**
   * Handles navigation to the homepage when the "Start Now" button is clicked.
   */
  const handleStartNow = () => {
    navigate('/home');  // Redirect to homepage
  };

  return (
    <div className="landing-container">
      {/* Header Section */}
      <header className="landing-header">
        <div className="landing-logo">
          <img src={logo} alt="MediMap Logo" className="logo" />
        </div>
        <div className="profile-pic">
          <a href="/profile">
             <img src={profilePic} alt="Profile" className="profile-icon" />
          </a>
      </div>
        <nav className="landing-nav">
          <a href="/landing">Home</a>
          <a href="/about"> About Us </a>
          <a href="#"> My Booking </a>
        </nav>
      </header>

      {/* Main Section */}
      <main className="landing-main">
        <div className="main-left">
          <img src={femaleDoctor} alt="Female Doctor" className="doctor-image" />
        </div>
        <div className="main-right">
          <h1>Searching for medical assistance?</h1>
          <p>Let MediMap+ assist you.</p>
          <button className="cta-button" onClick={handleStartNow}>
            Start Now
          </button>  {/* Navigation to homepage on click */}
          <img src={catchyText} alt="999+ Hospitals, Clinics" className="catchy-text" />
        </div>

        {/* Decorative Elements */}
        <div className="decorations">
          <img src={blueHeart} alt="Blue Heart" className="blue-heart" />
          <img src={blueHeart} alt="Blue Heart" className="blue-heart heart-second" />
          <img src={blueHeart} alt="Blue Heart" className="blue-heart heart-third" />
          <img src={shieldIcon} alt="Shield" className="shield-icon" />
          <img src={blueHeart} alt="Blue Heart" className="blue-heart heart-bottom-right" />
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
