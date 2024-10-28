// src/HomePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, monitorAuthState } from './firebase'; // Import Firebase utilities
import './App.css';
import './HomePage.css';
import logo from './images/logo.png';
import hospital from './images/hospital.png';
import personProfile from "./images/personProfile.png"
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [userName, setUserName] = useState(''); // State to store user's name or email
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Monitor authentication state and set user's name or email
    const unsubscribe = monitorAuthState((user) => {
      if (user) {
        const name = user.displayName || user.email.split('@')[0]; // Display name or email prefix
        setUserName(name); // Update state with user's name or email
      } else {
        setUserName('Guest'); // Default to 'Guest' if no user is logged in
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, []);

  // Function to navigate to HospitalMapPage
  const handleLocateHospital = () => {
    navigate('/hospitals'); // Navigate to the HospitalMapPage
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src={logo} alt="MediMAP Logo" />
        </div>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About Us</a>
          <a href="/history">History</a>
          <a href="/email">Email</a>
          <a href="/profile">
            <img src={personProfile} alt="Profile" />
          </a>
        </nav>
      </header>

      {/* Welcome Section */}
      <section className="welcome-section">
        <h1>Welcome, {userName}!</h1>
        <p>Check out these first aid tutorials for emergency situations.</p>
      </section>

      {/* Content Container */}
      <div className="content-container">
        <section className="tutorial-container">
          <div className="tutorial-row">
            {[
              { title: 'Handle burn injuries', imgSrc: './img2.jpg', link: 'https://www.youtube.com/watch?v=zaDkQ6SFJpQ&pp=ygUMaGFuZGxlIGJ1cm5z' },
              { title: 'Handle choking', imgSrc: './img1.jpg', link: 'https://www.youtube.com/watch?v=MkTZlRyXQiY&pp=ygUOaGFuZGxlIGNob2tpbmc%3D' },
            ].map((tutorial, index) => (
              <div key={index} className="card">
                <a href={tutorial.link} target="_blank" rel="noopener noreferrer">
                  <img src={tutorial.imgSrc} alt={tutorial.title} />
                  <p>{tutorial.title}</p>
                </a>
              </div>
            ))}
          </div>

          <div className="tutorial-row">
            {[
              { title: 'Guide to do proper CPR', imgSrc: './img3.jpg', link: 'https://www.youtube.com/watch?v=Plse2FOkV4Q&pp=ygUTZ3VpZGUgdG8gcHJvcGVyIGNwcg%3D%3D' },
              { title: 'Handle fracture', imgSrc: './img4.jpg', link: 'https://www.youtube.com/watch?v=2v8vlXgGXwE&pp=ygUPaGFuZGxlIGZyYWN0dXJl' },
            ].map((tutorial, index) => (
              <div key={index} className="card">
                <a href={tutorial.link} target="_blank" rel="noopener noreferrer">
                  <img src={tutorial.imgSrc} alt={tutorial.title} />
                  <p>{tutorial.title}</p>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Locate Hospital Section */}
        <section className="locate-hospital">
          <div className="hospital-image">
            <img src={hospital} alt="Hospital" />
          </div>
          <Link to="/hospitals">
            <button className="locate-button">Locate nearest hospital now!</button>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
