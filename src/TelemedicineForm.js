import React, { useState } from 'react';
import './TelemedicineForm.css';
import logo from './images/logo.png';

const TelemedicineForm = () => {
  const [symptoms, setSymptoms] = useState('');
  const [allergies, setAllergies] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { symptoms, allergies, file });
  };

  return (
    <div className="telemedicine-form">
      <header className="header">
        <div className="logo">
          <img src={ logo } alt="MediMAP Logo" />
        </div>
        <nav className="nav">
          <a href="#">Home</a>
          <a href="#">About Us</a>
          <a href="#">My Bookings</a>
        </nav>
      </header>
      <div className="container">
        <main>
            <form onSubmit={handleSubmit}>
            <h2>Complete the form to ease the doctor diagnose your condition.</h2>
            
            <div className="form-group">
                <label htmlFor="symptoms">Issue / Symptoms :</label>
                <textarea
                id="symptoms"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                required
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="lab-results">Relevant lab results :</label>
                <input
                type="file"
                id="lab-results"
                onChange={(e) => setFile(e.target.files[0])}
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="allergies">Allergy lists :</label>
                <textarea
                id="allergies"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                />
            </div>
            
            <button type="submit">Submit</button>
            </form>
        </main>
      </div>
      
    </div>
  );
};

export default TelemedicineForm;