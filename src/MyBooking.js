import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from './firebase';
import './MyBooking.css';
import { useNavigate } from 'react-router-dom';

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAppointments = async (userId) => {
    try {
      const appointmentsRef = collection(db, 'appointments', userId, 'userAppointments');
      const querySnapshot = await getDocs(appointmentsRef);
      const appointmentsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(appointmentsList);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to fetch appointments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        await fetchAppointments(currentUser.uid);
      } else {
        // If no user is logged in, redirect to login page
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleBackToProfile = () => {
    // Check if user is authenticated before navigating
    const user = auth.currentUser;
    if (user) {
      navigate('/profile'); // Navigate to profile page
    } else {
      navigate('/'); // Navigate to login page if not authenticated
    }
  };

  const handleBacktoHome = () =>{
    const user = auth.currentUser;
    if(user){
      navigate('/home');
    }else{
      navigate('/');
    }
  }

  return (
    <div className="my-booking-container">
      <h1>My Upcoming Appointments</h1>
      {loading ? (
        <p>Loading your appointments...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : bookings.length === 0 ? (
        <>
          <p>No upcoming appointments found.</p>
          <button onClick={handleBackToProfile} className="back-button">
            Back to Profile
          </button>
        </>
      ) : (
        <>
          <ul className="booking-list">
            {bookings.map((appointment) => (
              <li key={appointment.id} className="booking-item">
                <p><strong>Hospital Name:</strong> {appointment.hospital}</p>
                <p><strong>Patient Name:</strong> {appointment.patientName}</p>
                <p><strong>Date:</strong> {appointment.date}</p>
                <p><strong>Time:</strong> {appointment.time}</p>
                <p><strong>Service Type:</strong> {appointment.serviceType}</p>
                {appointment.documentlink && (
                  <p>
                    <strong>Document:</strong>{' '}
                    <a href={appointment.documentlink} target="_blank" rel="noopener noreferrer">
                      View Document
                    </a>
                  </p>
                )}
              </li>
            ))}
          </ul>
          <button onClick={handleBackToProfile} className="back-button">
            Back to Profile
          </button>

          <button onClick={handleBacktoHome} className="back-button">
            Back to Home
          </button>
        </>
      )}
    </div>
  );
};

export default MyBooking;