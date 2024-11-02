import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './LandingPage.css';  
import logo from './images/logo.png';  
import profilePic from './images/personProfile.png';  
import menuIcon from './images/threeLinesMenu.png';  
import femaleDoctor from './images/femaleDoctor.webp';  
import blueHeart from './images/hazyHeart.png';  
import shieldIcon from './images/shield.png';  
import catchyText from './images/catchy.png';  

const LandingPage = () => {
  const location = useLocation();  
  const navigate = useNavigate();  

  const { welcomeMessage = '' } = location.state || {};

  const handleStartNow = () => {
    navigate('/home');  
  };

  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="landing-logo">
          <img src={logo} alt="MediMap Logo" className="logo" />
        </div>
        <div className="profile-pic">
          <Link to="/profile">
            <img src={profilePic} alt="Profile" className="profile-icon" />
          </Link>
        </div>
        <nav className="landing-nav">
          <Link to="/home">Home</Link> {/* Changed from /landing to /home */}
          <Link to="/about">About Us</Link>
          <Link to="/booking">My Booking</Link>
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