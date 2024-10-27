import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';  // Import hooks for navigation and location
import './LandingPage.css';  // Import CSS for styling
import logo from './images/logo.png';  
import femaleDoctor from './images/femaleDoctor.webp';  
import catchyText from './images/catchy.png';  
import blueHeart from './images/hazyHeart.png';  
import shieldIcon from './images/shield.png';  

const LandingPage = () => {
  const location = useLocation();  // Hook to get location state
  const navigate = useNavigate();  // Hook to manage navigation

  // Extract welcomeMessage from location state, fallback to an empty string
  const { welcomeMessage = '' } = location.state || {};

  /**
   * Displays welcome message if available.
   */
  useEffect(() => {
    if (welcomeMessage) {
      alert(welcomeMessage);  // Show the welcome message in an alert
    }
  }, [welcomeMessage]);

  const handleStartNow = () => {
    navigate('/home');  // Redirect to homepage
  };

  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="landing-logo">
          <img src={logo} alt="MediMap Logo" className="logo" />
        </div>
        <nav className="landing-nav">
          <a href="/landing">Home</a>
          <a href="/about"> About Us </a>
          <a href="#"> My Booking </a>
        </nav>
      </header>

      <main className="landing-main">
        <div className="main-left">
          <img src={femaleDoctor} alt="Female Doctor" className="doctor-image" />
        </div>
        <div className="main-right">
          <h1>Searching for medical assistance?</h1>
          <p>Let MediMap+ assist you.</p>
          <button className="cta-button" onClick={handleStartNow}>
            Start Now
          </button>
          <img src={catchyText} alt="999+ Hospitals, Clinics" className="catchy-text" />
        </div>

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
