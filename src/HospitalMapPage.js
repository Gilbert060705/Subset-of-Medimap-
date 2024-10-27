import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Papa from 'papaparse';
import './HospitalMapPage.css';
import logo from './images/logo.png';
import profileIcon from './images/personProfile.png';
import menuIcon from './images/threeLinesMenu.png';

// Custom Leaflet Icon
const customIcon = new L.Icon({
  iconUrl: require('./images/marker-icon.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Haversine Distance Formula
const haversineDistance = (coords1, coords2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const [lat1, lon1] = coords1;
  const [lat2, lon2] = coords2;

  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Component to Pan to Selected Hospital with Error Handling
const PanToHospital = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    try {
      if (position && map) {
        console.log('Panning to:', position);
        map.flyTo(position, 13, { animate: true });
      }
    } catch (error) {
      console.error('Error while panning the map:', error);
    }
  }, [position, map]);

  return null;
};

const HospitalMapPage = () => {
  const [currentLocation, setCurrentLocation] = useState([1.3521, 103.8198]); // Default to Singapore
  const [hospitals, setHospitals] = useState([]);
  const [locationAccess, setLocationAccess] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);

  const mapRef = useRef(null);

  // Get User's Location with Error Handling
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation([latitude, longitude]);
        setLocationAccess(true);
      },
      (error) => {
        console.error('Location access denied:', error);
        alert('Location access denied. Defaulting to Singapore.');
      }
    );
  }, []);

  // Load Hospitals from CSV with Error Handling
  useEffect(() => {
    Papa.parse('/HospitalBioData.csv', {
      download: true,
      header: true,
      complete: (result) => {
        try {
          const hospitalData = result.data.map((hospital) => ({
            ...hospital,
            distance: haversineDistance(
              currentLocation,
              [parseFloat(hospital.latitude), parseFloat(hospital.longitude)]
            ).toFixed(2),
          }));
          setHospitals(hospitalData);
        } catch (error) {
          console.error('Error parsing hospital data:', error);
        }
      },
    });
  }, [currentLocation]);

  const handleHospitalClick = (hospital) => {
    setSelectedHospital([parseFloat(hospital.latitude), parseFloat(hospital.longitude)]);
  };

  // Safe Map Access with Exception Handling
  const getMapInstance = useCallback(() => {
    try {
      if (mapRef.current) {
        console.log('Map instance found:', mapRef.current);
        return mapRef.current;
      } else {
        console.warn('Map instance is not ready yet.');
        return null;
      }
    } catch (error) {
      console.error('Error accessing the map instance:', error);
      return null;
    }
  }, []);

  return (
    <div className="hospital-map-page">
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
        <MapContainer
          center={currentLocation}
          zoom={13}
          className="leaflet-map"
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        >
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
