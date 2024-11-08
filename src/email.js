import React from 'react';
import emailjs from 'emailjs-com';
import { auth } from './firebase'; // Import your Firebase auth instance

const SendEmailButton = ({ bookingID, hospitalName, appointmentDate, appointmentTime }) => {
  const sendEmail = () => {
    const user = auth.currentUser;

    if (!user) {
      alert('No user is currently logged in.');
      return;
    }

    const templateParams = {
      to_name: user.displayName || 'User', // User display name or fallback
      to_email: user.email,               // Logged-in user's email
      bookingID,                          // Dynamic booking ID
      hospitalName,                       // Dynamic hospital name
      appointmentDate,                    // Dynamic date
      appointmentTime,                    // Dynamic time
      message: `Your booking has been confirmed for ${appointmentDate} at ${appointmentTime}.`, // Custom dynamic message
    };

    emailjs
      .send(
        'service_husmn2j',   // Replace with your EmailJS Service ID
        'template_z96uwkt',  // Replace with your EmailJS Template ID
        templateParams,
        'MShthz_jF-f0YjD_i' // Replace with your EmailJS User ID
      )
      .then(
        (response) => {
          console.log('Email sent successfully!', response.status, response.text);
          alert('Confirmation email sent successfully!');
        },
        (error) => {
          console.error('Failed to send email:', error);
          alert('Failed to send email. Please try again.');
        }
      );
  };

  return (
    <button onClick={sendEmail} className="animated-button">
      Send Confirmation Email
    </button>
  );
};

export default SendEmailButton;
