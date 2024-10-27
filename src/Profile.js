import React from 'react';
import './Profile.css';
import logo from './images/logo.png';
import profilePic from './images/personProfile.png'; // Add this import

const Profile = () => {
  return (
    <div className="profile-container">
        <header className="header">
             <div className="logo">
                <img src={logo} alt="MediMap Logo" />
            </div>
            <nav className="nav">
                <a href="/">Home</a>
                <a href="/about">About Us</a>
                <a href="/bookings">My Bookings</a>
            </nav>
        </header>

      <div className="profile-content">
        <section className="user-info">
          <img src="/path-to-avatar.png" alt="Avatar" className="avatar" />
          <h1>Full Name</h1>
          <p>@username</p>
        </section>

        <section className="about-section">
          <div className="about-header">
            <h2>About</h2>
            <button className="edit-button">Edit</button>
          </div>
          <div className="about-details">
            <div className="detail-row">
              <label>Full Name</label>
              <input type="text" value="User123FullName" readOnly />
            </div>
            <div className="detail-row">
              <label>Gender</label>
              <input type="text" value="Male" readOnly />
            </div>
            <div className="detail-row">
              <label>Age</label>
              <input type="text" value="28" readOnly />
            </div>
            <div className="detail-row">
              <label>Email</label>
              <input type="text" value="user@gmail.com" readOnly />
            </div>
            <div className="detail-row">
              <label>Phone</label>
              <input type="text" value="+6590144554" readOnly />
            </div>
            <div className="detail-row">
              <label>Address</label>
              <input type="text" value="115 Alalalo Street" readOnly />
            </div>
          </div>
        </section>

        <section className="visits-section">
          <div className="visits-header">
            <h2>Past Visits</h2>
            <button className="details-button">Details</button>
          </div>
          <div className="visit-item">
            <p>23/08/2024, 11:00 a.m.</p>
            <p>Singapore General Hospital, Outram Rd, Singapore</p>
          </div>
          <div className="visit-item">
            <p>23/08/2024, 11:00 a.m.</p>
            <p>Singapore General Hospital, Outram Rd, Singapore</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
