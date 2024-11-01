import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, deleteDoc, doc } from './firebase';

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  // Fetch appointments from Firestore
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsRef = collection(db, "appointments"); // Ensure this matches your collection name
        const appointmentsSnapshot = await getDocs(appointmentsRef);
        
        if (!appointmentsSnapshot.empty) {
          const appointmentList = appointmentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setAppointments(appointmentList);
          console.log("Fetched appointments:", appointmentList); // Debugging log
        } else {
          console.log("No appointments found."); // Debugging log
        }
      } catch (error) {
        setError("Error fetching appointments");
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  // Delete an appointment
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "appointments", id));
      setAppointments(prev => prev.filter(app => app.id !== id));
      alert("Appointment deleted successfully");
    } catch (error) {
      console.error("Error deleting appointment:", error);
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
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.patientName || "N/A"}</td>
                <td>{appointment.doctor || "N/A"}</td>
                <td>{appointment.date || "N/A"}</td>
                <td>{appointment.time || "N/A"}</td>
                <td>
                  <button onClick={() => handleDelete(appointment.id)}>Delete</button>
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
