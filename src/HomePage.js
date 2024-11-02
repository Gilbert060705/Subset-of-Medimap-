import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, monitorAuthState, db, doc, getDoc } from './firebase';
import './App.css';
import './HomePage.css';
import logo from './images/logo.png';
import hospital from './images/hospital.png';
import personProfile from "./images/personProfile.png";
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserName = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const { fullName } = userDoc.data();
        setUserName(fullName);
      } else {
        console.warn('No user data found in Firestore.');
        setUserName('Guest');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserName('Guest');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = monitorAuthState((user) => {
      if (user) {
        fetchUserName(user.uid);
      } else {
        setUserName('Guest');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Add navigation handler
  const handleNavigation = (path) => {
    const user = auth.currentUser;
    if (user) {
      navigate(path);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="App">
      <header className="header">
        <div className="logo">
          <img src={logo} alt="MediMAP Logo" />
        </div>
        <nav>
          {/* Update navigation links */}
          <a href="#" onClick={(e) => {
            e.preventDefault();
            handleNavigation('/landing');
          }}>Home</a>
          <a href="#" onClick={(e) => {
            e.preventDefault();
            handleNavigation('/about');
          }}>About Us</a>
          <a href="#" onClick={(e) => {
            e.preventDefault();
            handleNavigation('/booking');
          }}>History</a>
          <a href="#" onClick={(e) => {
            e.preventDefault();
            handleNavigation('/email');
          }}>Email</a>
          <a href="#" onClick={(e) => {
            e.preventDefault();
            handleNavigation('/profile');
          }}>
            <img src={personProfile} alt="Profile" />
          </a>
        </nav>
      </header>

      {/* Welcome Section */}
      <section className="welcome-section">
        {loading ? (
          <h1>Loading...</h1>
        ) : (
          <h1>Welcome, {userName}!</h1>
        )}
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