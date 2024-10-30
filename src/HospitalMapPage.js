import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

// Hospital Service for managing favorites and visited
const HospitalService = {
  getFavorites: () => JSON.parse(localStorage.getItem('favoriteHospitals')) || [],
  getVisited: () => JSON.parse(localStorage.getItem('visitedHospitals')) || [],

  toggleFavorite: (hospitalId) => {
    const favorites = HospitalService.getFavorites();
    const index = favorites.indexOf(hospitalId);
    index === -1 ? favorites.push(hospitalId) : favorites.splice(index, 1);
    localStorage.setItem('favoriteHospitals', JSON.stringify(favorites));
  },

  toggleVisited: (hospitalId) => {
    const visited = HospitalService.getVisited();
    const index = visited.indexOf(hospitalId);
    index === -1 ? visited.push(hospitalId) : visited.splice(index, 1);
    localStorage.setItem('visitedHospitals', JSON.stringify(visited));
  }
};

const HospitalMapPage = () => {
  const navigate = useNavigate();
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
    type: {
      private: false,
      public: false,
      nonprofit: false,
      profit: false,
    },
    services: {
      GeneralServices: false,
      Cardiology: false,
      Neurology: false,
      Gastroenterology: false,
      Radiology: false,
      Urology: false,
      Pathology: false,
      Obstetrics: false,
      NumberOfBeds: false,
    },
  });
  

  // Get current location
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

  // Load hospital data
  useEffect(() => {
    Papa.parse('/HospitalBioData.csv', {
      download: true,
      header: true,
      complete: ({ data }) => {
        const sortedHospitals = data.map((hospital) => ({
          ...hospital,
          distance: haversineDistance(
            currentLocation,
            [parseFloat(hospital.latitude), parseFloat(hospital.longitude)]
          ).toFixed(2),
        })).sort((a, b) => a.distance - b.distance);

        setHospitals(sortedHospitals);
        setFilteredHospitals(sortedHospitals.slice(0, 5));
      },
    });
  }, [currentLocation]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const result = hospitals.find((hospital) =>
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (result) {
      const coords = [parseFloat(result.latitude), parseFloat(result.longitude)];
      setFilteredHospitals([{
        ...result,
        distance: haversineDistance(currentLocation, coords).toFixed(2),
      }]);
      setMapCenter(coords);
      setSelectedHospital(result);
      setFilters((prev) => ({ ...prev, nearby: false }));
    } else {
      alert('Hospital not found. Try a different search.');
      setFilteredHospitals([]); // Clear the list if no result found
    }
  };

  const handleFilterChange = (category, key = null) => {
    setFilters((prevFilters) => {
      if (key === null) {
        const newFilters = { ...prevFilters, [category]: !prevFilters[category] };
        if (category === 'nearby' && newFilters.nearby) {
          setFilteredHospitals(hospitals.slice(0, visibleHospitals));
        }
        return newFilters;
      } else {
        return {
          ...prevFilters,
          [category]: {
            ...prevFilters[category],
            [key]: !prevFilters[category][key],
          },
        };
      }
    });
  };

  const handleViewMore = () => {
    setVisibleHospitals((prev) => prev + 5);
    setFilteredHospitals(hospitals.slice(0, visibleHospitals + 5));
  };

  const handleHospitalClick = (hospital) => {
    const coords = [parseFloat(hospital.latitude), parseFloat(hospital.longitude)];
    setSelectedHospital(hospital);
    setMapCenter(coords);
    navigate('/bookform', { state: { hospitalName: hospital.name } });
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
            <Link to="/bookform" className="book-appointment-button">Book Appointment</Link>
          </form>

          <div className="filter-section">
            <h3>Preferences</h3>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={filters.nearby}
                onChange={() => handleFilterChange('nearby')}
              />
              <span>Show Nearby Hospitals</span>
            </label>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={filters.favorites}
                onChange={() => handleFilterChange('favorites')}
              />
              <span>Favorites</span>
            </label>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={filters.visited}
                onChange={() => handleFilterChange('visited')}
              />
              <span>Visited</span>
            </label>
          </div>

          <div className="filter-section">
            <h3>Type</h3>
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

          <div className="filter-section">
            <h3>Services</h3>
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

        <div className="hospital-list">
          <h2>Hospital List</h2>
          {filteredHospitals.length > 0 ? (
            filteredHospitals.map((hospital, index) => (
              <div
                key={hospital.id || index}
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
