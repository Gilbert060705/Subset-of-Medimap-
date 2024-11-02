import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { FaTrash } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]); // List of all users
  const [appointments, setAppointments] = useState([]); // Appointments for the selected user
  const [selectedUser, setSelectedUser] = useState(null); // Currently selected user
  const [error, setError] = useState(""); // Error handling

  // Fetch all users (patients) from the users collection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);

        if (!usersSnapshot.empty) {
          const userList = usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUsers(userList);
        } else {
          console.log("No users found.");
        }
      } catch (error) {
        setError("Error fetching users");
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch appointments for the selected user
  const fetchUserAppointments = async (userId) => {
    try {
      setError("");
      setSelectedUser(userId); // Set the selected user
      const appointmentsRef = collection(db, "appointments", userId, "userAppointments");
      const appointmentsSnapshot = await getDocs(appointmentsRef);

      if (!appointmentsSnapshot.empty) {
        const appointmentList = appointmentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAppointments(appointmentList);
      } else {
        setAppointments([]);
        console.log("No appointments found for the selected user.");
      }
    } catch (error) {
      setError("Error fetching appointments");
      console.error("Error fetching user appointments:", error);
    }
  };

  // Delete an appointment
  const handleDelete = async (appointmentId) => {
    try {
      const appointmentDocRef = doc(db, "appointments", selectedUser, "userAppointments", appointmentId);
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

      {/* Step 1: Display List of All Users */}
      {selectedUser === null ? (
        <>
          <h3>Select a Patient</h3>
          {users.length > 0 ? (
            <ul className="user-list">
              {users.map((user) => (
                <li 
                  key={user.id} 
                  onClick={() => fetchUserAppointments(user.id)} 
                  className="user-item clickable"
                >
                  {user.fullName || "Unknown Name"}
                </li>
              ))}
            </ul>
          ) : (
            <p>No users found.</p>
          )}
        </>
      ) : (
        <>
          {/* Step 2: Display Appointments for the Selected User */}
          <button onClick={() => setSelectedUser(null)} className="back-button">Back to Users</button>
          <h3>Appointments for {users.find(user => user.id === selectedUser)?.fullName || "Selected User"}</h3>
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
            <p>No appointments found for this user.</p>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
