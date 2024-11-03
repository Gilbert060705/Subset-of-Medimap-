import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Papa from 'papaparse';
import { Link } from 'react-router-dom';
import './HospitalMapPage.css';
import logo from './images/logo.png';
import profileIcon from './images/personProfile.png';
import { auth } from './firebase.js';
import { HospitalService } from './HospitalService.js';
import HospitalDetailCard from './HospitalDetailCard.js';

// Custom Leaflet Icon
const customIcon = new L.Icon({
  iconUrl: ('./images/marker-icon.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Helper component to update map view
const ChangeMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
};

// Haversine Distance Calculation
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

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const HospitalMapPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentLocation, setCurrentLocation] = useState([1.3521, 103.8198]);
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [visibleHospitals, setVisibleHospitals] = useState(5);
  const [showDetailCard, setShowDetailCard] = useState(false);
  const [mapCenter, setMapCenter] = useState([1.3521, 103.8198]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
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

  // Authentication Effect
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userFavorites = await HospitalService.getFavorites(currentUser.uid);
        setFavorites(userFavorites);
      } else {
        setUser(null);
        setFavorites([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Navigation handler
  const handleNavigation = (path) => {
    const user = auth.currentUser;
    if (user) {
      navigate(path);
    } else {
      navigate('/');
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...hospitals];

    if (searchQuery) {
      filtered = filtered.filter(hospital =>
        hospital.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.favorites) {
      filtered = filtered.filter(hospital => favorites.includes(hospital.name));
    }

    if (filters.visited) {
      filtered = filtered.filter(hospital =>
        JSON.parse(localStorage.getItem(`visited_${user?.uid}_${hospital.name}`))
      );
    }

    if (filters.nearby) {
      filtered = filtered.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    }

    const activeTypeFilters = Object.entries(filters.type)
      .filter(([_, value]) => value)
      .map(([key]) => key.toLowerCase());

    if (activeTypeFilters.length > 0) {
      filtered = filtered.filter(hospital =>
        activeTypeFilters.some(type =>
          hospital.type?.toLowerCase().includes(type)
        )
      );
    }

    const activeServiceFilters = Object.entries(filters.services)
      .filter(([_, value]) => value)
      .map(([key]) => key.toLowerCase());

    if (activeServiceFilters.length > 0) {
      filtered = filtered.filter(hospital => {
        const hospitalServices = hospital.services || [];
        return activeServiceFilters.some(service =>
          hospitalServices.some(hs => hs.toLowerCase().includes(service.toLowerCase()))
        );
      });
    }

    setFilteredHospitals(filtered.slice(0, visibleHospitals));
  }, [hospitals, filters, favorites, visibleHospitals, searchQuery, user]);

  useEffect(() => {
    applyFilters();
  }, [filters, applyFilters]);

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
          .filter(hospital => hospital.latitude && hospital.longitude)
          .map((hospital) => {
            let type = hospital['Type of Hospital'] ? hospital['Type of Hospital'].toLowerCase() : '';
            if (type.includes('private')) {
              type = 'private';
            } else if (type.includes('public')) {
              type = 'public';
            } else if (type.includes('profit')) {
              type = 'profit';
            } else if (type.includes('nonprofit')) {
              type = 'nonprofit';
            }

            const servicesRaw = hospital['Services'] || '';
            const servicesArray = servicesRaw
              .split(/[\n,]+/)
              .map(service => service.trim())
              .filter(service => service);

            return {
              ...hospital,
              type: type,
              services: servicesArray,
              distance: haversineDistance(
                currentLocation,
                [parseFloat(hospital.latitude), parseFloat(hospital.longitude)]
              ).toFixed(2),
            };
          })
          .sort((a, b) => a.distance - b.distance);

        setHospitals(sortedHospitals);
        applyFilters();
      },
    });
  }, [currentLocation, applyFilters]);

  const handleToggleFavorite = async (e, hospital) => {
    e.stopPropagation();
    if (!user) {
      alert('Please login to add favorites');
      return;
    }
    try {
      const newFavorites = await HospitalService.toggleFavorite(hospital.name, user.uid);
      setFavorites(newFavorites);
      if (filters.favorites) {
        applyFilters();
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorites');
    }
  };

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
      setFilteredHospitals([]);
    }
  };

  // Updated handleFilterChange function
  const handleFilterChange = (category, key = null) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      
      if (category === 'type') {
        if (key === 'public') {
          newFilters.type = { ...newFilters.type, public: !newFilters.type.public, private: false };
        } else if (key === 'private') {
          newFilters.type = { ...newFilters.type, private: !newFilters.type.private, public: false };
        } else if (key === 'profit') {
          newFilters.type = { ...newFilters.type, profit: !newFilters.type.profit, nonprofit: false };
        } else if (key === 'nonprofit') {
          newFilters.type = { ...newFilters.type, nonprofit: !newFilters.type.nonprofit, profit: false };
        }
      }
      else if (category === 'services') {
        newFilters.services = {
          ...newFilters.services,
          [key]: !newFilters.services[key]
        };
      }
      else {
        newFilters[category] = !newFilters[category];
      }
      return newFilters;
    });
  };

  const handleViewMore = () => {
    setVisibleHospitals(prev => prev + 5);
    applyFilters();
  };

  const handleHospitalClick = (hospital) => {
    const coords = [parseFloat(hospital.latitude), parseFloat(hospital.longitude)];
    setSelectedHospital(hospital);
    setMapCenter(coords);
    setShowDetailCard(true);
  };

  const handleBookAppointment = () => {
    if (!user) {
      alert('Please login to book an appointment');
      navigate('/');
      return;
    }
    if (selectedHospital) {
      navigate('/bookform', { state: { hospitalName: selectedHospital.name } });
    } else {
      alert('Please select a hospital from the list first.');
    }
  };

  return (
    <div className="hospital-map-page">
      <header className="navbar">
        <div className="logo-container">
          <img
            src={logo}
            alt="MediMap Logo"
            style={{ cursor: 'pointer' }}
            onClick={() => handleNavigation('/home')}
          />
        </div>
        <nav className="nav-links">
          <a href="#" onClick={(e) => {
            e.preventDefault();
            handleNavigation('/home');
          }}>Home</a>
          <a href="#" onClick={(e) => {
            e.preventDefault();
            handleNavigation('/about');
          }}>About Us</a>
        </nav>
        <div className="profile-icons">
          <Link to="/profile">
            <img src={profileIcon} alt="User Profile" />
          </Link>
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
            <button
              type="button"
              onClick={handleBookAppointment}
              className="book-appointment-button"
            >
              Book Appointment
            </button>
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
                  className="checkbox-input"
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
              >
                <div className="hospital-content">
                  <h3
                    onClick={() => handleHospitalClick(hospital)}
                    className="hospital-name-clickable"
                  >
                    {hospital.name}
                  </h3>
                  <p>Distance: {hospital.distance} km away</p>
                </div>
                <div className="hospital-actions">
                  <button
                    className={`favorite-btn ${favorites.includes(hospital.name) ? 'active' : ''}`}
                    onClick={(e) => handleToggleFavorite(e, hospital)}
                    title={favorites.includes(hospital.name) ? "Remove from favorites" : "Add to favorites"}
                  >
                    ♥
                    </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              {filters.favorites ? (
                <p>No favorite hospitals yet. Click the heart icon to add hospitals to your favorites.</p>
              ) : (
                <p>No hospitals found matching your search criteria.</p>
              )}
            </div>
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
        {showDetailCard && selectedHospital && (
          <HospitalDetailCard
            hospital={selectedHospital}
            onClose={() => setShowDetailCard(false)}
          />
        )}
      </div>
    </div>
  );
};

export default HospitalMapPage;