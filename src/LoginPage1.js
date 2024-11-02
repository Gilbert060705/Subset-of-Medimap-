import React from 'react';
import './LoginPage1.css';
import DoctorImage from './images/doctorDressed.png';
import PatientImage from "./images/patient.png";
import { useNavigate } from 'react-router-dom';

function LoginPage1() {
  const navigate = useNavigate();

  const handlePatientLogin = () => {
    navigate('/login');
  };

  const handleAdminLogin = () => {
    navigate('/admin-login');
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        {/* Add content if needed or leave blank for styling */}
      </div>

      <div className="right-panel">
        <h1>Welcome Back!</h1>
        <div className="login-buttons">
          <div className="login-option">
            <img src={DoctorImage} alt="Doctor Icon" className="login-icon" />
            <button 
              className="login-button doctor" 
              onClick={handleAdminLogin} 
              aria-label="Login as Admin"
            >
              Login as Admin
            </button>
          </div>

          <div className="login-option">
            <img src={PatientImage} alt="Patient Icon" className="login-icon" />
            <button 
              className="login-button patient" 
              onClick={handlePatientLogin} 
              aria-label="Login as Patient"
            >
              Login as Patient
            </button>
          </div>
        </div>
        
        <p className="signup-link">
          Don’t have an account? <a href="/signup" className="signup-link-text">Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage1;
