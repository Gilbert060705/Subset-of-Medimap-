import React, { useState, useEffect } from 'react';
import './Profile.css';
import logo from './images/logo.png';
import profilePic from './images/personProfile.png';
import { auth, db, doc } from './firebase'; 
import { updateDoc, getDoc } from 'firebase/firestore'; 
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false); 
  const [loading, setLoading] = useState(true); 
  const [userData, setUserData] = useState({
    fullName: '',
    gender: '',
    age: '',
    email: '',
    phone: '',
    address: '',
  });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserProfile(currentUser.uid);
      } else {
        navigate('/');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

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
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const saveUserProfile = async () => {
    try {
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), userData);
        console.log('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const toggleEdit = () => {
    if (isEditing) saveUserProfile();
    setIsEditing((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('User logged out successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Modified navigation handlers - Changed from /landing to /home
  const handleHomeClick = () => {
    navigate('/home');  // Changed from '/landing' to '/home'
  };

  const handleAboutClick = () => {
    navigate('/about');
  };

  const handleMyBookingClick = () => {
    navigate('/booking');
  };

  if (loading) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className="profile-container">
      <header className="header">
        <div className="logo">
          <img src={logo} alt="MediMap Logo" onClick={handleHomeClick} style={{ cursor: 'pointer' }}/>
        </div>
        <nav className="nav">
          <a href="#" onClick={handleHomeClick}>Home</a>
          <a href="#" onClick={handleAboutClick}>About Us</a>
          <a href="#" onClick={handleMyBookingClick}>My Bookings</a>
        </nav>
      </header>

      <div className="profile-content">
        <section className="user-info">
          <img src={profilePic} alt="Avatar" className="avatar" />
          <h1>{userData.fullName || 'User Name'}</h1>
          <p>@{userData.email ? userData.email.split('@')[0] : 'username'}</p>
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
      {field === 'gender' ? (
        <select
          name="gender"
          value={userData.gender}
          onChange={handleInputChange}
          disabled={!isEditing}
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Rather not say">Rather not say</option>
        </select>
      ) : (
        <input
          type="text"
          name={field}
          value={userData[field]}
          readOnly={!isEditing}
          onChange={handleInputChange}
        />
      )}
    </div>
  ))}
</div>

        </section>

        <section className="logout-section">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </section>
      </div>
    </div>
  );
};

export default Profile;