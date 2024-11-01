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
      const q = query(
        collection(db, 'appointments'),
        where('userId', '==', userId) // Ensure userId matches
      );

      const querySnapshot = await getDocs(q);
      console.log('Appointments for user:', querySnapshot.docs.map((doc) => doc.data()));

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
        console.log('Current User ID:', currentUser.uid); // Log userId
        await fetchAppointments(currentUser.uid);
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    console.log('Updated Bookings State:', bookings); // Log bookings state
  }, [bookings]);

  return (
    <div className="my-booking-container">
      <h1>My Upcoming Appointments</h1>
      {loading ? (
        <p>Loading your appointments...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : bookings.length === 0 ? (
        <p>No upcoming appointments found.</p>
      ) : (
        <ul className="booking-list">
          {bookings.map((appointment) => (
            <li key={appointment.id} className="booking-item">
              <p><strong>Patient Name:</strong> {appointment.patientName}</p>
              <p><strong>Age:</strong> {appointment.age}</p>
              <p><strong>Gender:</strong> {appointment.gender}</p>
              <p><strong>Date:</strong> {appointment.date}</p>
              <p><strong>Time:</strong> {appointment.time}</p>
              <p><strong>Service Type:</strong> {appointment.serviceType}</p>
              <p><strong>Symptom:</strong> {appointment.symptom}</p>
              <p>
                <strong>Document:</strong>{' '}
                <a href={appointment.documentlink} target="_blank" rel="noopener noreferrer">
                  View Document
                </a>
              </p>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate('/')} className="back-button">
        Back to Profile
      </button>
    </div>
  );
};

export default MyBooking;