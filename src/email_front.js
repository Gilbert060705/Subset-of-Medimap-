import { auth } from './firebase'; 

const confirmAppointment = async () => {
  const user = auth.currentUser;

  if (user) {
    const email = user.email;
    
    try {
      const response = await fetch('https://your-backend-api.com/send-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        alert(`Appointment confirmation sent to ${email}`);
      } else {
        alert('Failed to send confirmation email. Please try again.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('An error occurred. Please try again.');
    }
  } else {
    alert('No user is logged in.');
  }
};
