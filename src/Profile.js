import React, { useState, useEffect } from 'react';
import './Profile.css';
import logo from './images/logo.png';
import profilePic from './images/personProfile.png';
import { auth, db, doc, setDoc } from './firebase'; 
import { getDoc } from 'firebase/firestore'; 

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false); 
  const [userData, setUserData] = useState({
    fullName: '',
    gender: '',
    age: '',
    email: '',
    phone: '',
    address: '',
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserProfile(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        console.log('No user data found, using default values.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const saveUserProfile = async () => {
    try {
      if (user) {
        await setDoc(doc(db, 'users', user.uid), userData);
        console.log('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const toggleEdit = () => {
    if (isEditing) saveUserProfile(); 
    setIsEditing(!isEditing);
  };

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
          <h1>{userData.fullName || 'User Name'}</h1>
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
            {['fullName', 'gender', 'age', 'email', 'phone', 'address'].map((field) => (
              <div className="detail-row" key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type="text"
                  name={field}
                  value={userData[field]}
                  readOnly={!isEditing}
                  onChange={handleInputChange}
                />
              </div>
            ))}
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
