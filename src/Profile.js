import React, { useState } from 'react';
import './Profile.css';
import logo from './images/logo.png';
import profilePic from './images/personProfile.png';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const [userData, setUserData] = useState({
    fullName: 'User123FullName',
    gender: 'Male',
    age: '28',
    email: 'user@gmail.com',
    phone: '+6590144554',
    address: '115 Alalalo Street',
  });

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Toggle edit mode
  const toggleEdit = () => setIsEditing(!isEditing);

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
          <img src={profilePic} alt="Avatar" className="avatar" />
          <h1>{userData.fullName}</h1>
          <p>@{userData.email.split('@')[0]}</p>
        </section>

        <section className="about-section">
          <div className="about-header">
            <h2>About</h2>
            <button className="edit-button" onClick={toggleEdit}>
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
          <div className="about-details">
            <div className="detail-row">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={userData.fullName}
                readOnly={!isEditing}
                onChange={handleInputChange}
              />
            </div>
            <div className="detail-row">
              <label>Gender</label>
              <input
                type="text"
                name="gender"
                value={userData.gender}
                readOnly={!isEditing}
                onChange={handleInputChange}
              />
            </div>
            <div className="detail-row">
              <label>Age</label>
              <input
                type="text"
                name="age"
                value={userData.age}
                readOnly={!isEditing}
                onChange={handleInputChange}
              />
            </div>
            <div className="detail-row">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                readOnly={!isEditing}
                onChange={handleInputChange}
              />
            </div>
            <div className="detail-row">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={userData.phone}
                readOnly={!isEditing}
                onChange={handleInputChange}
              />
            </div>
            <div className="detail-row">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={userData.address}
                readOnly={!isEditing}
                onChange={handleInputChange}
              />
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
