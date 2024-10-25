// src/AppointmentForm.js
import React, { useState } from 'react';
import './AppointmentForm.css';
import { useLocation } from 'react-router-dom';

const AppointmentForm = () => {
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [symptom, setSymptom] = useState('');
  const [document, setDocument] = useState(null);
  const [serviceType, setServiceType] = useState({
    onSite: false,
    telemedicine: false,
  });
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [fullName, setFullName] = useState('');

  const location = useLocation();
  const hospitalName = location.state?.hospitalName || 'Unknown Hospital';

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log({ gender, age, symptom, document, serviceType, date, time, fullName });
  };

  return (
    <div className="appointment-form-container">
      <header>
        <div className="logo">
          <img src="logo.png" alt="MediMAP logo" />
        </div>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About Us</a>
          <a href="/bookings">My Bookings</a>
        </nav>
      </header>

      <div className="form-wrapper">
        <h1>Booking an Appointment for {hospitalName}</h1>
        <div className="form-content">
          <div className="details-section">
            <h3>Details</h3>
            <form onSubmit={handleSubmit}>
              <label>Gender:</label>
              <input 
                type="text" 
                value={gender} 
                onChange={(e) => setGender(e.target.value)} 
              />

              <label>Age:</label>
              <input 
                type="number" 
                value={age} 
                onChange={(e) => setAge(e.target.value)} 
              />

              <label>Symptom/Complaint:</label>
              <textarea 
                value={symptom} 
                onChange={(e) => setSymptom(e.target.value)} 
              />

              <label>Document supported* (if any):</label>
              <input 
                type="file" 
                onChange={(e) => setDocument(e.target.files[0])} 
              />
            </form>
          </div>

          <div className="appointment-section">
            <h3>Book an appointment now</h3>
            <form onSubmit={handleSubmit}>
              <label>Type of Service</label>
              <div>
                <input 
                  type="checkbox" 
                  checked={serviceType.onSite} 
                  onChange={() => setServiceType({ ...serviceType, onSite: !serviceType.onSite })} 
                /> On-site
                <input 
                  type="checkbox" 
                  checked={serviceType.telemedicine} 
                  onChange={() => setServiceType({ ...serviceType, telemedicine: !serviceType.telemedicine })} 
                /> Telemedicine
              </div>

              <label>Date (MM/DD/YYYY):</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
              />

              <label>Time (HH:MM):</label>
              <input 
                type="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
              />

              <label>Patient's Full Name:</label>
              <input 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
              />

              <button type="submit" className="book-button">Book now</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;
