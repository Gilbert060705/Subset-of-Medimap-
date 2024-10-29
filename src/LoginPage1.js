import React from 'react';
import './LoginPage1.css';
import Doctor from './images/doctorDressed.png';
import './App.css';
import patient from "./images/patient.png";
import { useNavigate } from 'react-router-dom';

function LoginPage1() {
  const navigate = useNavigate();

  const handlePatientLogin = () => {
    navigate('/login');
  };

  return (
    <div className="login-container">
      <div className="left-panel"></div>
      <div className="right-panel">
        <h1>Welcome Back !</h1>
        <div className="login-buttons">
          <div className="icon1">
            <img src={Doctor} alt="Doctor" />
            <button className="login-button doctor">Login as Admin</button>
          </div>

          <div className="icon2">
            <img src={patient} alt="Patient" />
            <button className="login-button patient" onClick={handlePatientLogin}>
              Login as Patient
            </button>
          </div>
        </div>
        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage1;
