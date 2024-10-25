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
import TelemedicineForm from './TelemedicineForm';

/**
 * The App function component defines the structure of the application by setting up
 * routes and rendering the corresponding components based on the URL path.
 *
 * @return {JSX.Element} A JSX element that renders the React app with the defined routes.
 */
function App() {
    return (
        /**
         * Router is used to wrap the application and enable routing functionality.
         * Routes contains individual Route elements, each mapped to a specific component.
         * 
         * <p>If no matching route is found, the default route ("/") will render the
         * LoginPage component.</p>
         */
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

                <Route path="/telemedicineform" element={<TelemedicineForm/>} />
            </Routes>

            {/* Fallback message to verify React app is running */}
            <p>If you see this, the React app is working.</p> 
        </Router>
    );
}

// Exporting the App component as the default export
export default App;
