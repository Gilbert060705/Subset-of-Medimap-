/**
 * The App component serves as the main entry point of the React application.
 * It defines the routes and structure of the entire app using `react-router-dom`
 * for seamless navigation between pages.
 *
 * Dependencies:
 * - react
 * - react-router-dom
 * 
 * Components Used:
 * - LoginPage1
 * - LoginPage
 * - SignUpPage
 * - LandingPage
 * - HomePage
 * - HospitalMapPage
 * - MedicalBookingForm
 * - AppointmentBooked
 * - AboutUs
 * - Profile
 * - MyBooking
 *
 * @author [Group1]
 * @version 1.1
 */
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage1 from './LoginPage1';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import LandingPage from './LandingPage';
import HomePage from './HomePage';
import HospitalMapPage from './HospitalMapPage';
import MedicalBookingForm from './MedicalBookingForm';
import AppointmentBooked from './AppointmentBooked';
import AboutUs from './AboutUs';
import Profile from './Profile';
import EmailMe from './email';
import MyBooking from './MyBooking'; // Renamed for clarity

/**
 * The App component defines the structure of the application by setting up routes
 * and rendering the corresponding components based on the URL path.
 *
 * @return {JSX.Element} A JSX element that renders the React app with defined routes.
 */
function App() {
    return (
        <Router>
            <Routes>
                {/* Authentication Routes */}
                <Route path="/" element={<LoginPage1 />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />

                {/* Main Pages */}
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/about" element={<AboutUs />} />

                {/* Hospital and Booking Pages */}
                <Route path="/hospitals" element={<HospitalMapPage />} />
                <Route path="/bookform" element={<MedicalBookingForm />} />
                <Route path="/confirmbook" element={<AppointmentBooked />} />

                {/* Profile and Email Pages */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/email" element={<EmailMe />} />

                {/* MyBooking Page */}
                <Route path="/booking" element={<MyBooking />} />

                {/* Fallback Route - 404 Page */}
                <Route path="*" element={<h1>404 - Page Not Found</h1>} />
            </Routes>
        </Router>
    );
}

// Exporting the App component as the default export
export default App;
