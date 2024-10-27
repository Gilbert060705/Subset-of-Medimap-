import React from 'react';
import './AppointmentBooked.css';
import logo from './images/logo.png';

const AppointmentBooked = () => {
    return (
        <div className="appointment-booked">
            <header className="header">
                <div className="logo">
                    <img src={logo} alt="MediMap Logo" />
                </div>
                <nav className="nav">
                    <a href="/landing">Home</a>
                    <a href="/about">About Us</a>
                    <a href="/bookings">My Bookings</a>
                </nav>
            </header>
            <div className="container">
                <main className="content">
                    <h2>Appointment Booked</h2>
                    <p>Check your email to obtain appointment confirmation.</p>
                    <button onClick={() => window.location.href = '/landing'}>Back to Home</button>
                </main>
            </div>
        </div>
    );
}

export default AppointmentBooked;
