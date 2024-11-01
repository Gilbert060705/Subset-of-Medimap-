import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from './images/logo.png';
import "./MedicalBookingForm.css";
import { Link } from 'react-router-dom';
import profilePic from './images/personProfile.png';
import{ db, addDoc, auth, collection} from './firebase'
import { storeReportFile } from './reportFileHandler';

const MedicalBookingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hospitalName = location.state?.hospitalName || 'Hospital Name';
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    hospital: hospitalName,
    gender: '',
    age: '',
    symptom: '',
    serviceType: '',
    date: '',
    time: '',
    patientName: '',
    documentlink: ''
  });
  const [document, setDocument] = useState (null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setDocument(file); // Directly assign the file
  };

  const validateForm = () => {
    for (const key in formData) {
      if (key === 'documentlink') continue;
      if (!formData[key] || (typeof formData[key] === 'string' && formData[key].trim() === '')) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //submission logic

    if(formData.age < 1){
      alert("Age could not be 0 or negative.");
      return;
    }

    if(formData.date < today){
      alert("The date must be at later or equal to today's date.");
      return;
    }

    const isValid = validateForm(); // Assume a function to check all fields
    if (isValid) {
      console.log("Form data:", formData);
    } else {
      alert("All fields are required.");
      return;
    }


    console.log("Form is valid, submitting...");
    // Proceed with form submission
    try {
      let documentUrl = null;

      if(document){
        console.log(document.name);
        documentUrl = await storeReportFile(document);
      }
      await addDoc(collection(db, "appointments", user.uid, "userAppointments"), {
        ...formData,
        documentlink: documentUrl
      });
      console.log("Appointment stored succesfully");
      navigate('/confirmbook');
      } catch (error) {
        console.error("Error storing appointment: ", error);
        alert("Failed to store appointment.");
      }
    console.log('Form submitted:', formData);
  };

  return (
    <div className="bookingPage-container">
      <header className="bookingPage-header">
        <div className="bookingPage-logo">
          <img src={logo} alt="MediMap Logo" />
        </div>
        <div className="profile-pic">
        <a href="/profile">
              <img src={profilePic} alt="Profile" className="profile-icon" />
            </a>
        </div>
        <nav className="bookingPage-nav">
          <Link to="/landing">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/bookings">My Bookings</Link>
        </nav>
      </header>

      <div className="bookingPage-form-container">
        <h2 className="bookingPage-form-title">{hospitalName}</h2>

        <form className="appointment-form" onSubmit={handleSubmit}>
        <div className="bookingPage-form-grid">
          {/* Left Column - Details */}
          <div className="bookingPage-details-section">
            <h3 className="bookingPage-section-title">Details</h3>

            <div className="bookingPage-input-grid">
              <div>
                <label className="bookingPage-input-label">Gender:</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="" disabled hidden>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="rather-not-say">Rather not say</option>
                </select>
              </div>
              <div>
                <label className="bookingPage-input-label">Age:</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="input-field"
                  min="1"
                  
                  required
                />
              </div>
            </div>

            <div className="bookingPage-mb-4">
              <label className="bookingPage-input-label">Symptom/Complaint:</label>
              <textarea
                name="symptom"
                value={formData.symptom}
                onChange={handleInputChange}
                className="textarea-field"
                required
              />
            </div>

            <div>
              <label className="bookingPage-input-label">Document supported* (if any):</label>
              <input
                type="file"
                name="document"
                onChange={handleFileChange}
                className="file-input"
                required
              />
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="bookingPage-booking-section">
            <h3 className="bookingPage-section-title white-text">Book an appointment now.</h3>

            <div className="bookingPage-mb-4">
              <label className="bookingPage-input-label white-text">Type of Service</label>
              <div className="bookingPage-service-type-options">
                <label className="bookingPage-radio-option">
                  <input
                    type="radio"
                    name="serviceType"
                    value="on-site"
                    checked={formData.serviceType === 'on-site'}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="bookingPage-white-text">On-site</span>
                </label>
                <label className="bookingPage-radio-option">
                  <input
                    type="radio"
                    name="serviceType"
                    value="telemedicine"
                    checked={formData.serviceType === 'telemedicine'}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="bookingPage-white-text">Telemedicine</span>
                </label>
              </div>
            </div>

            <div className="bookingPage-mb-4">
              <label className="bookingPage-input-label white-text">Date (MM/DD/YYYY)</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="bookingPage-input-field"
                required
              />
            </div>

            <div className="bookingPage-mb-4">
              <label className="bookingPage-input-label white-text">Time (HH : MM)</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="bookingPage-input-field"
                required
              />
            </div>

            <div className="bookingPage-mb-6">
              <label className="bookingPage-input-label white-text">Patient's Full Name</label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleInputChange}
                className="bookingPage-input-field"
                required
              />
            </div>
            <button
              type='submit'
              className="bookingPage-submit-button"
              onClick={handleSubmit}>
              Book now
            </button>
          </div>
        </div>
        </form>
      </div>
    </div>
  );
};

export default MedicalBookingForm;
