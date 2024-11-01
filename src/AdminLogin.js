import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';
import DoctorImage from './images/Doctor.png';

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password123";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any stored session on page load to prevent navigating back to this page
    sessionStorage.removeItem("adminLoggedIn");
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Save login state in sessionStorage
      sessionStorage.setItem("adminLoggedIn", "true");

      // Redirect to the dashboard and replace the current page in the history stack
      navigate("/admin-dashboard", { replace: true });
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="admin-login-container">
      <div
        className="left-panel-admin"
        style={{
          backgroundImage: `url(${DoctorImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
      </div>
      <div className="right-panel-admin">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} className="admin-login-form">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="admin-login-button">Login</button>
        </form>
        {error && <p className="admin-error-message">{error}</p>}
      </div>
    </div>
  );
};

export default AdminLogin;
