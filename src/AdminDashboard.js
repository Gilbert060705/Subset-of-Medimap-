import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { FaTrash } from 'react-icons/fa'; // Import Trash icon from react-icons
import './AdminDashboard.css'; // Import the CSS file for styling

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const userId = "LLQyTir9BKT2vvkWLokklvR1yd02"; // Specify the user ID here

  // Fetch appointments for the specified user
  useEffect(() => {
    const fetchUserAppointments = async () => {
      try {
        const appointmentsRef = collection(db, "appointments", userId, "userAppointments");
        const appointmentsSnapshot = await getDocs(appointmentsRef);

        if (!appointmentsSnapshot.empty) {
          const appointmentList = appointmentsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAppointments(appointmentList);
          console.log("Fetched user appointments:", appointmentList); // Debugging log
        } else {
          console.log("No appointments found for user.");
        }
      } catch (error) {
        setError("Error fetching appointments");
        console.error("Error fetching user appointments:", error);
      }
    };

    fetchUserAppointments();
  }, [userId]);

  // Delete an appointment
  const handleDelete = async (appointmentId) => {
    try {
      const appointmentDocRef = doc(db, "appointments", userId, "userAppointments", appointmentId);
      await deleteDoc(appointmentDocRef);
      setAppointments((prev) => prev.filter((appointment) => appointment.id !== appointmentId));
      alert("Appointment deleted successfully");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      setError("Error deleting appointment");
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {appointments.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Hospital</th>
              <th>Symptoms</th>
              <th>Date</th>
              <th>Time</th>
              <th>Service Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.patientName || "N/A"}</td>
                <td>{appointment.hospital || "N/A"}</td>
                <td>{appointment.symptom || "N/A"}</td>
                <td>{appointment.date || "N/A"}</td>
                <td>{appointment.time || "N/A"}</td>
                <td>{appointment.serviceType || "N/A"}</td>
                <td>
                  <button onClick={() => handleDelete(appointment.id)} className="delete-button">
                    <FaTrash /> {/* Trash icon for delete */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No appointments found.</p>
      )}
    </div>
  );
};

export default AdminDashboard;
