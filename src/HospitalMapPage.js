import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Papa from 'papaparse';
import { Link } from 'react-router-dom';
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

// Helper Component to Update Map View
const ChangeMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13); // Set the zoom to 13
  }, [center, map]);
  return null;
};

// Haversine Distance Formula
const haversineDistance = (coords1, coords2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const [lat1, lon1] = coords1;
  const [lat2, lon2] = coords2;

  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const HospitalMapPage = () => {
  const [currentLocation, setCurrentLocation] = useState([1.3521, 103.8198]); // Default to Singapore
  const [hospitals, setHospitals] = useState([]);
  const [visibleHospitals, setVisibleHospitals] = useState(5);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([1.3521, 103.8198]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: { private: false, public: false, nonprofit: false, profit: false },
    services: {
      generalServices: false,
      cardiology: false,
      neurology: false,
      gastroenterology: false,
      radiology: false,
      urology: false,
      pathology: false,
      obstetrics: false,
      sleep: false,
    },
    preference: { favorite: false, nearby: false, visited: false },
  });

  const mapRef = useRef();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userCoords = [latitude, longitude];
        setCurrentLocation(userCoords);
        setMapCenter(userCoords); // Center map on user location
      },
      () => alert('Location access denied. Defaulting to Singapore.')
    );
  }, []);

  useEffect(() => {
    Papa.parse('/HospitalBioData.csv', {
      download: true,
      header: true,
      complete: (result) => {
        const sortedHospitals = result.data
          .map((hospital) => ({
            ...hospital,
            distance: haversineDistance(
              currentLocation,
              [parseFloat(hospital.latitude), parseFloat(hospital.longitude)]
            ).toFixed(2),
          }))
          .sort((a, b) => a.distance - b.distance);

        setHospitals(sortedHospitals);
      },
    });
  }, [currentLocation]);

  const handleFilterChange = (category, item) => {
    setFilters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: !prev[category][item],
      },
    }));
  };

  const handleHospitalClick = (hospital) => {
    const hospitalCoords = [parseFloat(hospital.latitude), parseFloat(hospital.longitude)];
    setSelectedLocation(hospitalCoords);
    setMapCenter(hospitalCoords); // Re-center map on selected hospital
  };

  const handleViewMore = () => {
    setVisibleHospitals((prevCount) => prevCount + 5);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}, Singapore`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        const locationCoords = [parseFloat(lat), parseFloat(lon)];
        setSelectedLocation(locationCoords);
        setMapCenter(locationCoords);
      } else {
        alert('Location not found');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      alert('An error occurred while searching for the location.');
    }
  };

  return (
    <div className="hospital-map-page">
      <header className="navbar">
        <div className="logo-container">
          <img src={logo} alt="MediMap Logo" />
        </div>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
        </nav>
        <div className="profile-icons">
          <Link to="/profile">
            <img src={profileIcon} alt="User Profile" />
          </Link>
          <img src={menuIcon} alt="Menu Icon" />
        </div>
      </header>

      <div className="content-container">
        <div className="filters-container">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search Hospitals or Locations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="animated-button">Search</button>
          </form>

          <div className="filter-section">
            <h3>Type</h3>
            <div className="filter-grid">
              {Object.entries(filters.type).map(([key, value]) => (
                <label key={key} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleFilterChange('type', key)}
                  />
                  <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Services</h3>
            <div className="filter-grid">
              {Object.entries(filters.services).map(([key, value]) => (
                <label key={key} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleFilterChange('services', key)}
                  />
                  <span>{key.replace(/([A-Z])/g, ' $1').replace(/^\w/, (c) => c.toUpperCase())}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Preference</h3>
            <div className="filter-grid">
              {Object.entries(filters.preference).map(([key, value]) => (
                <label key={key} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleFilterChange('preference', key)}
                  />
                  <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="hospital-list">
          <h2>List of Nearest Hospitals</h2>
          {hospitals.slice(0, visibleHospitals).map((hospital, index) => (
            <div key={index} className="hospital-item" onClick={() => handleHospitalClick(hospital)}>
              <h3>{hospital.name}</h3>
              <p>Distance: {hospital.distance} km away</p>
            </div>
          ))}
          {visibleHospitals < hospitals.length && (
            <button onClick={handleViewMore} className="animated-button">View More Hospitals</button>
          )}
        </div>

        <div className="map-container">
          <MapContainer center={mapCenter} zoom={12} className="leaflet-map">
            <ChangeMapView center={mapCenter} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
            <Marker position={currentLocation} icon={customIcon}>
              <Popup>Your Location</Popup>
            </Marker>
            {selectedLocation && (
              <Marker position={selectedLocation} icon={customIcon}>
                <Popup>Selected Location</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default HospitalMapPage;
