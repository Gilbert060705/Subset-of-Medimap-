// HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import logo from './images/logo.png'; // Adjust path as needed
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <header className="home-header">
        <img src={logo} alt="MediMap Logo" className="home-logo" />
        <nav className="home-navbar">
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/hospitals">Find Hospitals</Link> {/* Correct route path */}
          <Link to="/email">Email</Link>
        </nav>
      </header>

      <main className="home-content">
        <h1>Welcome to MediMap</h1>
        <p>Your go-to platform for finding nearby hospitals and clinics.</p>
        <Link to="/hospitals"> {/* Ensure the path is /hospitals */}
          <button className="find-hospitals-button">Find Hospitals Near Me</button>
        </Link>
        <Link to="/email"> {/* Ensure the path is /hospitals */}
          <button className="find-hospitals-button">Email Me</button>
        </Link>
      </main>
    </div>
  );
};

export default HomePage;
