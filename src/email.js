import React from 'react';
import emailjs from 'emailjs-com';

const SendEmailButton = () => {
  const sendEmail = () => {
    const templateParams = {
      to_name: 'Raunak Saxena', // Replace with recipient's name
      to_email: 'raunaksaxena1404@gmail.com', // Replace with recipient's email
      bookingID: '123456', // Replace with dynamic booking ID
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
