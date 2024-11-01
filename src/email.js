import React from 'react';
import emailjs from 'emailjs-com';
import { auth } from './firebase'; // Import your Firebase auth instance

const SendEmailButton = () => {
  const sendEmail = () => {
    const user = auth.currentUser;

    if (!user) {
      alert('No user is currently logged in.');
      return;
    }

    const templateParams = {
      to_name: user.displayName || 'User', // Use the user's display name or fallback to 'User'
      to_email: user.email, // Use the logged-in user's email
      bookingID: '123456', // Replace with dynamic booking ID if available
      message: 'Your booking has been confirmed!', // Custom message
    };

    emailjs
      .send(
        'service_husmn2j', // Replace with your EmailJS Service ID
        'template_z96uwkt', // Replace with your EmailJS Template ID
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
      Send Email
    </button>
  );
};

export default SendEmailButton;
