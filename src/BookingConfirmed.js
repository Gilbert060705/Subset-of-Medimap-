import React, {useState} from 'react';
import logo from './images/logo.png';
import './BookingConfirmed.css';
import profilePic from './images/personProfile.png'; // Add this import

const BookingConfirmed = () =>{
    return(
    <div className="booking-confirmed">
        <header className="header">
            <div className="logo">
                <img src={logo} alt="MediMap Logo" />
        </div>
            <div className="profile-pic">
                 <a href="/profile">
                 <img src={profilePic} alt="Profile" className="profile-icon" />
             </a>
        </div>
            <nav className="nav">
                <a href="/home">Home</a>
                <a href="/about">About Us</a>
                <a href="/bookings">My Bookings</a>
            </nav>
        </header>
        <div className="container">
            <main className="content">
                <h2>Details have been sent to the doctors</h2>
                <p>Wait for 2-3 working days and a reply from the doctors will be sent to your email.</p>
                <button onClick={() => window.location.href = '/home'}>Back to Home</button>
            </main>
        </div>
    </div>
    );
}

export default BookingConfirmed;