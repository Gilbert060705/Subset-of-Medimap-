import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from './firebase';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);
        const userList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);
      } catch (error) {
        setError("Error fetching users");
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const fetchUserAppointments = async (userId) => {
    try {
      setSelectedUser(userId);
      const appointmentsRef = collection(db, "appointments", userId, "userAppointments");
      const appointmentsSnapshot = await getDocs(appointmentsRef);
      const appointmentList = appointmentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAppointments(appointmentList);
    } catch (error) {
      setError("Error fetching appointments");
      console.error("Error fetching user appointments:", error);
    }
  };

  const handleDelete = async (appointmentId) => {
    try {
      const appointmentDocRef = doc(db, "appointments", selectedUser, "userAppointments", appointmentId);
      await deleteDoc(appointmentDocRef);
      setAppointments((prev) => prev.filter((appointment) => appointment.id !== appointmentId));
      alert("Appointment deleted successfully");
    } catch (error) {
      setError("Error deleting appointment");
      console.error("Error deleting appointment:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      setError("Error logging out");
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {error && <p className="error">{error}</p>}

        {selectedUser === null ? (
          <>
            <h3>Select a Patient</h3>
            <div className="user-cards">
              {users.length > 0 ? (
                users.map((user) => (
                  <div key={user.id} onClick={() => fetchUserAppointments(user.id)} className="user-card">
                    <p>{user.fullName || "Unknown Name"}</p>
                  </div>
                ))
              ) : (
                <p>No users found.</p>
              )}
            </div>
          </>
        ) : (
          <>
            <button onClick={() => setSelectedUser(null)} className="back-button">Back to Users</button>
            <h3>Appointments for {users.find(user => user.id === selectedUser)?.fullName || "Selected User"}</h3>
            {appointments.length > 0 ? (
              <table className="appointments-table">
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
                          <FaTrash />
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
    </div>
  );
};

export default AdminDashboard;
