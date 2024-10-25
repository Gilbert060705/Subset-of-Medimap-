/**
 * HospitalMapPage component provides an interactive map and hospital list. 
 * It fetches user location, calculates distances using the Haversine formula, 
 * and displays hospital information from a CSV file.
 * 
 * Dependencies:
 * - React for UI rendering
 * - React Leaflet for map rendering
 * - Leaflet for map markers and icons
 * - Papa Parse for CSV parsing
 * 
 * Features:
 * - User location tracking using browser's geolocation API
 * - Distance calculation between hospitals and the user's current location
 * - Interactive map with markers and hospital popups
 * - Panning functionality to move the map to selected hospital locations
 * 
 * Note: If location access is denied, the default location is set to Singapore.
 * 
 * @author [Group1]
 * @version 1.0
 */

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Papa from 'papaparse'; // CSV parsing library
import './HospitalMapPage.css';
import logo from './images/logo.png';
import profileIcon from './images/personProfile.png';
import menuIcon from './images/threeLinesMenu.png';
import { useNavigate } from 'react-router-dom';

/**
 * Custom marker icon for map markers using Leaflet.
 */
const customIcon = new L.Icon({
  iconUrl: require('./images/marker-icon.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

/**
 * Calculates the distance between two geographical coordinates using the Haversine formula.
 *
 * @param coords1 Array containing the latitude and longitude of the first location.
 * @param coords2 Array containing the latitude and longitude of the second location.
 * @return {Number} Distance in kilometers.
 */
const haversineDistance = (coords1, coords2) => {
  const toRad = (x) => (x * Math.PI) / 180;

  const lat1 = coords1[0];
  const lon1 = coords1[1];
  const lat2 = coords2[0];
  const lon2 = coords2[1];

  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

/**
 * Component to pan the map to the selected hospital's location.
 * 
 * @param position Array containing the latitude and longitude of the hospital.
 * @return {null} This component does not render anything.
 */
const PanToHospital = ({ position }) => {
  const map = useMap(); // Access the map instance

  useEffect(() => {
    if (position) {
      map.setView(position, 13); // Pan to the selected hospital with zoom level 13
    }
  }, [position, map]);

  return null;
};

/**
 * Main HospitalMapPage component that renders the hospital map and list.
 *
 * @return {JSX.Element} JSX representation of the hospital map page.
 */
const HospitalMapPage = () => {
  const [currentLocation, setCurrentLocation] = useState([1.3521, 103.8198]); // Default to Singapore
  const [hospitals, setHospitals] = useState([]); // Store hospital data
  const [locationAccess, setLocationAccess] = useState(false); // Track location access
  const [selectedHospital, setSelectedHospital] = useState(null); // Track selected hospital
  const navigate = useNavigate(); // Router navigation
  
  // Fetch the user's current location using the geolocation API
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation([latitude, longitude]);
        setLocationAccess(true);
      },
      () => {
        alert('Location access denied. Defaulting to Singapore.');
      }
    );
  }, []);

  // Fetch hospital data from a CSV file and calculate distances
  useEffect(() => {
    Papa.parse('/HospitalBioData.csv', {
      download: true,
      header: true,
      complete: (result) => {
        const hospitalData = result.data.map((hospital) => ({
          ...hospital,
          distance: haversineDistance(
            currentLocation,
            [parseFloat(hospital.latitude), parseFloat(hospital.longitude)]
          ).toFixed(2), // Distance in km
        }));
        setHospitals(hospitalData);
      },
    });
  }, [currentLocation]);

  /**
   * Handle click event on a hospital to set it as the selected hospital.
   *
   * @param hospital The hospital object containing latitude and longitude.
   */
  const handleHospitalClick = (hospital) => {
    navigate('/appointmentform', { state: { hospitalName: hospital.name } });
  };

  return (
    <div className="hospital-map-page">
      <div className="landing-container">
        <header className="landing-header">
          <img src={logo} alt="MediMap Logo" className="logo" />
          <nav>
            <a href="#home">Home</a>
            <a href="#about">About Us</a>
          </nav>
          <div className="icons">
            <a href="/profile">
              <img src={profileIcon} alt="User Profile" className="profile-icon" />
            </a>
            <a href="/menu">
              <img src={menuIcon} alt="Menu" className="menu-icon" />
            </a>
          </div>
        </header>
      </div>

      <div className="sidebar">
        <input type="text" placeholder="Direct Search" className="search-bar" />
        <div className="filters">
          <h3>Type</h3>
          <label><input type="checkbox" /> Private</label>
          <label><input type="checkbox" /> Public</label>
          <label><input type="checkbox" /> Non-profit</label>
          <label><input type="checkbox" /> Profit</label>
        </div>
      </div>

      <div className="hospital-list">
        <h2>List of Hospitals, Clinics, and Pharmacy</h2>
        {hospitals.map((hospital, index) => (
          <div
            className="hospital-item"
            key={index}
            onClick={() => handleHospitalClick(hospital)}
          >
            <h3>{hospital.name}</h3>
            <p>Distance: {hospital.distance} km away</p>
            <p>Telemedicine: Available</p>
          </div>
        ))}
      </div>

      <div className="map-container">
        <MapContainer center={currentLocation} zoom={13} className="leaflet-map">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {locationAccess && (
            <Marker position={currentLocation} icon={customIcon}>
              <Popup>Your current location</Popup>
            </Marker>
          )}
          {hospitals.map((hospital, index) => (
            <Marker
              key={index}
              position={[parseFloat(hospital.latitude), parseFloat(hospital.longitude)]}
              icon={customIcon}
            >
              <Popup>{hospital.name}</Popup>
            </Marker>
          ))}
          {selectedHospital && <PanToHospital position={selectedHospital} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default HospitalMapPage;
