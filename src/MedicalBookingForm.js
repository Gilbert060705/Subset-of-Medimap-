import React, { useState } from 'react';
import logo from './images/logo.png';
import "./MedicalBookingForm.css";

const MedicalBookingForm = () => {
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    symptom: '',
    serviceType: 'on-site',
    date: '',
    time: '',
    patientName: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

    const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      document: e.target.files[0],
    }));
  };

  return (
    <div className="container">
            <header className="header">
                <div className="logo">
                    <img src={logo} alt="MediMap Logo" />
                </div>
                <nav className="nav">
                    <a href="/HomePage.js">Home</a>
                    <a href="/about">About Us</a>
                    <a href="/bookings">My Bookings</a>
                </nav>
            </header>

      <div className="form-container">
        <h2 className="form-title">Singapore General Hospital</h2>
        
        <div className="form-grid">
          {/* Left Column - Details */}
          <div className="details-section">
            <h3 className="section-title">Details</h3>
            
            <div className="input-grid">
              <div>
                <label className="input-label">Gender:</label>
                <select>
                  <option value="male"> Male </option>
                  <option value="female"> Female </option>
                  <option value="rather-not-say"> Rather not say </option>
                </select>
              </div>
              <div>
                <label className="input-label">Age:</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="input-label">Symptom/Complaint:</label>
              <textarea
                name="symptom"
                value={formData.symptom}
                onChange={handleInputChange}
                className="textarea-field"
              />
            </div>

            <div>
              <label className="input-label">Document supported* (if any):</label>
              <input
                type="file"
                name="document"
                onChange={handleFileChange}
                className="file-input"
              />
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="booking-section">
            <h3 className="section-title white-text">Book an appointment now.</h3>
            
            <div className="mb-4">
              <label className="input-label white-text">Type of Service</label>
              <div className="service-type-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="serviceType"
                    value="on-site"
                    checked={formData.serviceType === 'on-site'}
                    onChange={handleInputChange}
                  />
                  <span className="white-text">On-site</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="serviceType"
                    value="telemedicine"
                    checked={formData.serviceType === 'telemedicine'}
                    onChange={handleInputChange}
                  />
                  <span className="white-text">Telemedicine</span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="input-label white-text">Date (MM/DD/YYYY)</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>

            <div className="mb-4">
              <label className="input-label white-text">Time (HH : MM)</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>

            <div className="mb-6">
              <label className="input-label white-text">Patient's Full Name</label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="submit-button"
            >
              Book now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalBookingForm;
