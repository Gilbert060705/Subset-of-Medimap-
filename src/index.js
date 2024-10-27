/**
 * index.js serves as the entry point for the React application.
 * 
 * This file renders the root component (`App`) into the DOM, 
 * enabling the React app to run within the browser. It also sets up 
 * React's Strict Mode to detect potential problems and includes 
 * optional performance measuring capabilities through `reportWebVitals`.
 * 
 * Additionally, it includes global error and promise rejection handlers 
 * to suppress known errors gracefully without disrupting the user experience.
 *
 * Dependencies:
 * - React for component rendering
 * - ReactDOM for interacting with the DOM
 * - reportWebVitals for measuring performance (optional)
 * 
 * @version 1.1
 * @since [27/10/2024]
 */

import React from 'react'; // Core React library
import ReactDOM from 'react-dom/client'; // ReactDOM for rendering components into the DOM
import './index.css'; // Global CSS styles for the application
import App from './App'; // Main application component
import reportWebVitals from './reportWebVitals'; // Performance monitoring utility

// Global error handler to suppress specific errors (like removeLayer)
window.addEventListener('error', (event) => {
  if (event.message.includes('removeLayer')) {
    console.warn('Suppressed map layer error:', event.message);
    event.preventDefault(); // Prevents the error from being shown in the console
  }
});

// Global promise rejection handler to prevent unhandled rejections
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('removeLayer')) {
    console.warn('Suppressed unhandled promise rejection:', event.reason);
    event.preventDefault(); // Prevents this from being treated as an error
  }
});

// Create a root DOM element to render the React app.
const root = ReactDOM.createRoot(document.getElementById('root'));

/**
 * Render the App component inside React's StrictMode.
 * 
 * React.StrictMode helps in identifying potential problems in an 
 * application by activating additional checks and warnings for its descendants.
 */
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * Optionally start measuring the performance of the app by passing a 
 * logging function to `reportWebVitals`. This can help monitor and 
 * improve the app's performance.
 * 
 * Example:
 * reportWebVitals(console.log)
 * 
 * To send performance results to an analytics endpoint, provide the 
 * appropriate function to `reportWebVitals`.
 */
reportWebVitals(); // Start measuring performance (optional)
