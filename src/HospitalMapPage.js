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

// Helper to update map view
const ChangeMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
};

// Haversine Distance Formula
const haversineDistance = (coords1, coords2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const [lat1, lon1] = coords1;
  const [lat2, lon2] = coords2;
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const HospitalMapPage = () => {
  const [currentLocation, setCurrentLocation] = useState([1.3521, 103.8198]);
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [visibleHospitals, setVisibleHospitals] = useState(5);
  const [mapCenter, setMapCenter] = useState([1.3521, 103.8198]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    nearby: true,
    favorites: false,
    visited: false,
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
  });

  const mapRef = useRef();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        const userCoords = [latitude, longitude];
        setCurrentLocation(userCoords);
        setMapCenter(userCoords);
      },
      () => alert('Location access denied. Defaulting to Singapore.')
    );
  }, []);

  useEffect(() => {
    Papa.parse('/HospitalBioData.csv', {
      download: true,
      header: true,
      complete: ({ data }) => {
        const sortedHospitals = data
          .map((hospital) => ({
            ...hospital,
            distance: haversineDistance(
              currentLocation,
              [parseFloat(hospital.latitude), parseFloat(hospital.longitude)]
            ).toFixed(2),
          }))
          .sort((a, b) => a.distance - b.distance);

        setHospitals(sortedHospitals);
        setFilteredHospitals(sortedHospitals.slice(0, visibleHospitals));
      },
    });
  }, [currentLocation]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const result = hospitals.find((hospital) =>
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (result) {
      setFilteredHospitals([result]);
      setFilters({ nearby: false });
      const coords = [parseFloat(result.latitude), parseFloat(result.longitude)];
      setMapCenter(coords);
    } else {
      alert('Hospital not found. Try a different search.');
    }
  };

  const handleFilterChange = (category, key) => {
    setFilters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key],
      },
    }));
  };

  const handleHospitalClick = (hospital) => {
    const coords = [parseFloat(hospital.latitude), parseFloat(hospital.longitude)];
    setSelectedHospital(hospital);
    setMapCenter(coords);
  };

  const handleViewMore = () => {
    setVisibleHospitals((prev) => prev + 5);
    setFilteredHospitals(hospitals.slice(0, visibleHospitals + 5));
  };

  const handleNearbyToggle = () => {
    const newNearby = !filters.nearby;
    setFilters((prev) => ({ ...prev, nearby: newNearby }));
    if (newNearby) {
      setFilteredHospitals(hospitals.slice(0, visibleHospitals));
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
            <h3>Preferences</h3>
            <div className="filter-grid">
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.nearby}
                  onChange={handleNearbyToggle}
                />
                <span>Show Nearby Hospitals</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.favorites}
                  onChange={() => handleFilterChange('favorites', 'favorites')}
                />
                <span>Favorites</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.visited}
                  onChange={() => handleFilterChange('visited', 'visited')}
                />
                <span>Visited</span>
              </label>
            </div>
          </div>

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
                  <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="hospital-list">
          <h2>Hospital List</h2>
          {filteredHospitals.length > 0 ? (
            filteredHospitals.map((hospital, index) => (
              <div
                key={index}
                className="hospital-item"
                onClick={() => handleHospitalClick(hospital)}
              >
                <h3>{hospital.name}</h3>
                <p>Distance: {hospital.distance} km away</p>
              </div>
            ))
          ) : (
            <p>No hospitals found.</p>
          )}
          {visibleHospitals < hospitals.length && filters.nearby && (
            <button onClick={handleViewMore} className="animated-button">
              View More Hospitals
            </button>
          )}
        </div>

        <div className="map-container">
          <MapContainer center={mapCenter} zoom={12} className="leaflet-map">
            <ChangeMapView center={mapCenter} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={currentLocation} icon={customIcon}>
              <Popup>Your Location</Popup>
            </Marker>
            {selectedHospital && (
              <Marker
                position={[
                  parseFloat(selectedHospital.latitude),
                  parseFloat(selectedHospital.longitude),
                ]}
                icon={customIcon}
              >
                <Popup>{selectedHospital.name}</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default HospitalMapPage;
