import React from 'react';
import './History.css';
import logo from './images/logo.png';

const History = () => {
  return (
    <div className="history-container">
      <header className="history-header">
        <img src={logo} alt="MediMap Logo" className="logo" />
        <nav className="nav">
          <a href="/">Home</a>
          <a href="/about">About Us</a>
          <a href="/bookings">My Bookings</a>
        </nav>
      </header>

      <div className="history-content">
        <h1>My History</h1>

        <section className="appointments-section">
          <h2>Appointments</h2>

          <div className="appointment-item">
            <h3>30/08/2024</h3>
            <div className="details-row">
              <p><strong>Location:</strong> Singapore General Hospital, Outram Rd, Singapore</p>
              <p><strong>Type of Service:</strong> On-Site, Telemedicine</p>
              <p><strong>Time:</strong> 11:00 a.m.</p>
              <p><strong>Patient’s Name:</strong> Tang Cool</p>
            </div>
          </div>

          <div className="appointment-item">
            <h3>30/08/2024</h3>
            <div className="details-row">
              <p><strong>Location:</strong> Singapore General Hospital, Outram Rd, Singapore</p>
              <p><strong>Type of Service:</strong> On-Site</p>
              <p><strong>Time:</strong> 11:00 a.m.</p>
              <p><strong>Patient’s Name:</strong> Daniel Cool</p>
            </div>
          </div>
        </section>

        <section className="past-visits-section">
          <h2>Past Visits</h2>

          <div className="visit-item">
            <h3>23/08/2024, 11:00 a.m.</h3>
            <div className="details-row">
              <p><strong>Location:</strong> Singapore General Hospital, Outram Rd, Singapore</p>
              <p><strong>Type of Service:</strong> On-Site, Telemedicine</p>
              <p><strong>Time:</strong> 11:00 a.m.</p>
              <p><strong>Patient’s Name:</strong> Daniel Cool</p>
              <p><strong>Review:</strong> ⭐⭐⭐⭐⭐ (4.1)</p>
              <p><em>Very nice service, nurses are patient and informative.</em></p>
            </div>
            <button className="favorite-button">Add to Favorite</button>
          </div>

          <div className="visit-item">
            <h3>22/08/2024, 11:00 a.m.</h3>
            <div className="details-row">
              <p><strong>Location:</strong> Singapore General Hospital, Outram Rd, Singapore</p>
              <p><strong>Type of Service:</strong> Online</p>
              <p><strong>Time:</strong> 11:00 a.m.</p>
              <p><strong>Patient’s Name:</strong> Daniel Cool</p>
            </div>
            <button className="review-button">Add a review</button>
            <button className="favorite-button">Add to Favorite</button>
          </div>

          <div className="visit-item">
            <h3>21/08/2024, 11:00 a.m.</h3>
            <div className="details-row">
              <p><strong>Location:</strong> Singapore General Hospital, Outram Rd, Singapore</p>
              <p><strong>Type of Service:</strong> Online</p>
              <p><strong>Time:</strong> 11:00 a.m.</p>
              <p><strong>Patient’s Name:</strong> Daniel Cool</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default History;
