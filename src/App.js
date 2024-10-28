/**
 * The App component serves as the main entry point of the React application.
 * It defines the routes and structure of the entire app, using `react-router-dom`
 * for navigation between different pages.
 *
 * <p>This component utilizes the `Router` and `Routes` from `react-router-dom` to manage
 * multiple routes, each mapped to a specific component/page.</p>
 *
 * Dependencies:
 * - react
 * - react-router-dom
 * 
 * Components Used:
 * - LoginPage
 * - SignUpPage
 * - LandingPage
 * - HomePage
 * - HospitalMapPage
 * - MedicalBookingForm
 * - AppointmentBooked
 * - AboutUs
 * - Profile
 * 
 * @author [Group1]
 * @version 1.0
 */
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import LandingPage from './LandingPage';  // Import the LandingPage
import HomePage from './HomePage';
import HospitalMapPage from './HospitalMapPage';
import MedicalBookingForm from './MedicalBookingForm';
import AppointmentBooked from './AppointmentBooked';
import AboutUs from './AboutUs';
import Profile from './Profile'; // Add this import
import EmailMe from './email';

/**
 * The App function component defines the structure of the application by setting up
 * routes and rendering the corresponding components based on the URL path.
 *
 * @return {JSX.Element} A JSX element that renders the React app with the defined routes.
 */
function App() {
    return (
        <Router>
            <Routes>
                {/* Route mapping for LoginPage */}
                <Route path="/" element={<LoginPage />} />

                {/* Route mapping for SignUpPage */}
                <Route path="/signup" element={<SignUpPage />} />

                {/* Route mapping for LandingPage */}
                <Route path="/landing" element={<LandingPage />} />  

                {/* Route mapping for HomePage */}
                <Route path="/home" element={<HomePage />} /> 

                {/* Route mapping for HospitalMapPage */}
                <Route path="/hospitals" element={<HospitalMapPage />} />

                {/* Route mapping for MedicalBookingFormPage */}
                <Route path="/bookform" element={<MedicalBookingForm />} />

                {/* Route mapping for AppointmentBooked */}
                <Route path="/confirmbook" element={<AppointmentBooked />} />

                {/* Route mapping for AboutUs */}
                <Route path="/about" element={<AboutUs />} />

                {/* Route mapping for Profile */}
                <Route path="/profile" element={<Profile />} /> 

                <Route path="/email" element={<EmailMe />} /> 

                {/* Fallback Route - 404 Page */}
                <Route path="*" element={<h1>404 - Page Not Found</h1>} />
            </Routes>
        </Router>
    );
}

// Exporting the App component as the default export
export default App;
