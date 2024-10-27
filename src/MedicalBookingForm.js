import React, { useState } from 'react';
import logo from './images/logo.png';
import "./MedicalBookingForm.css";
import { Link } from 'react-router-dom';
import profilePic from './images/personProfile.png';

const MedicalBookingForm = () => {
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    symptom: '',
    serviceType: 'on-site',
    date: '',
    time: '',
    patientName: '',
    document: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      document: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add form submission logic here
  };

  return (
    <div className="bookingPage-container">
      <header className="bookingPage-header">
        <div className="bookingPage-logo">
          <img src={logo} alt="MediMap Logo" />
        </div>
        <div className="profile-pic">
        <a href="/profile">
              <img src={profilePic} alt="Profile" className="profile-icon" />
            </a>
        </div>
        <nav className="bookingPage-nav">
          <Link to="/landing">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/bookings">My Bookings</Link>
        </nav>
      </header>

      <div className="bookingPage-form-container">
        <h2 className="bookingPage-form-title">Singapore General Hospital</h2>

        <div className="bookingPage-form-grid">
          {/* Left Column - Details */}
          <div className="bookingPage-details-section">
            <h3 className="bookingPage-section-title">Details</h3>

            <div className="bookingPage-input-grid">
              <div>
                <label className="bookingPage-input-label">Gender:</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="rather-not-say">Rather not say</option>
                </select>
              </div>
              <div>
                <label className="bookingPage-input-label">Age:</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>

            <div className="bookingPage-mb-4">
              <label className="bookingPage-input-label">Symptom/Complaint:</label>
              <textarea
                name="symptom"
                value={formData.symptom}
                onChange={handleInputChange}
                className="textarea-field"
              />
            </div>

            <div>
              <label className="bookingPage-input-label">Document supported* (if any):</label>
              <input
                type="file"
                name="document"
                onChange={handleFileChange}
                className="file-input"
              />
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="bookingPage-booking-section">
            <h3 className="bookingPage-section-title white-text">Book an appointment now.</h3>

            <div className="bookingPage-mb-4">
              <label className="bookingPage-input-label white-text">Type of Service</label>
              <div className="bookingPage-service-type-options">
                <label className="bookingPage-radio-option">
                  <input
                    type="radio"
                    name="serviceType"
                    value="on-site"
                    checked={formData.serviceType === 'on-site'}
                    onChange={handleInputChange}
                  />
                  <span className="bookingPage-white-text">On-site</span>
                </label>
                <label className="bookingPage-radio-option">
                  <input
                    type="radio"
                    name="serviceType"
                    value="telemedicine"
                    checked={formData.serviceType === 'telemedicine'}
                    onChange={handleInputChange}
                  />
                  <span className="bookingPage-white-text">Telemedicine</span>
                </label>
              </div>
            </div>

            <div className="bookingPage-mb-4">
              <label className="bookingPage-input-label white-text">Date (MM/DD/YYYY)</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="bookingPage-input-field"
              />
            </div>

            <div className="bookingPage-mb-4">
              <label className="bookingPage-input-label white-text">Time (HH : MM)</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="bookingPage-input-field"
              />
            </div>

            <div className="bookingPage-mb-6">
              <label className="bookingPage-input-label white-text">Patient's Full Name</label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleInputChange}
                className="bookingPage-input-field"
              />
            </div>

            <Link to="/confirmbook">
              <button
                className="bookingPage-submit-button"
                onClick={handleSubmit}
              >
                Book now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalBookingForm;
