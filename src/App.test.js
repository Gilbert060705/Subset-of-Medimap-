/**
 * The App component serves as the main entry point of the React application.
 * It defines the routes and structure of the entire app, using `react-router-dom`
 * for navigation between different pages. It also includes a homepage design
 * with a logo and link to React documentation.
 *
 * Dependencies:
 * - react
 * - react-router-dom
 * - logo.svg (image asset)
 * - App.css (styling)
 * 
 * Components Used:
 * - LoginPage
 * - SignUpPage
 * - LandingPage
 * - HomePage
 * - HospitalMapPage
 * - React documentation link
 * 
 * @author [Group1]
 * @version 1.0
 */

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';  // Import logo
import './App.css';  // Import CSS styling
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import LandingPage from './LandingPage';
import HomePage from './HomePage';
import HospitalMapPage from './HospitalMapPage';
import AppointmentForm from './AppointmentForm';  // Use the correct case   

/**
 * The App function component defines the structure of the application by setting up
 * routes and rendering the corresponding components based on the URL path.
 * It also displays a logo and a link to React documentation on the homepage.
 *
 * @return {JSX.Element} A JSX element that renders the React app with the defined routes.
 */
function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    {/* Logo display on the main page */}
                    <img src={logo} className="App-logo" alt="logo" />

                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>

                    {/* Link to React documentation */}
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>

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

                    {/* Add this route for AppointmentForm */}
                     <Route path="/appointment" element={<AppointmentForm />} />
                </Routes>

                {/* Fallback message to verify React app is running */}
                <p>If you see this, the React app is working.</p>
            </div>
        </Router>
    );
}

// Exporting the App component as the default export
export default App;
