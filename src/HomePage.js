import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import './HospitalMapPage.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';
import logo from './images/logo.png';

// Custom marker icon configuration
const customIcon = new L.Icon({
    iconUrl: require('./images/marker-icon.png'),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

// SetMapCenter component remains the same
function SetMapCenter({ position }) {
    const map = useMap();
    useEffect(() => {
        map.setView(position);
    }, [position, map]);
    return null;
}

// Updated Routing component with proper cleanup
function Routing({ start, end }) {
    const map = useMap();
    const routingControlRef = useRef(null);

    useEffect(() => {
        if (!map || !start || !end) return;

        // Clean up existing routing control
        if (routingControlRef.current) {
            map.removeControl(routingControlRef.current);
        }

        // Create new routing control
        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(start[0], start[1]),
                L.latLng(end[0], end[1])
            ],
            routeWhileDragging: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: false,
            lineOptions: {
                styles: [{ color: '#6FA1EC', weight: 4 }]
            },
            createMarker: () => null // Don't create markers for waypoints
        });

        // Add to map and store reference
        routingControl.addTo(map);
        routingControlRef.current = routingControl;

        // Cleanup function
        return () => {
            if (routingControlRef.current && map) {
                map.removeControl(routingControlRef.current);
                routingControlRef.current = null;
            }
        };
    }, [map, start, end]);

    return null;
}

// Hospital data remains the same
const hospitals = [
    {
        name: 'Singapore General Hospital',
        eta: '19.20',
        distance: '5.1 km',
        telemedicine: 'Available',
        status: ['Nearby', 'Favorite', 'Visited'],
        lat: 1.2793,
        lng: 103.8378,
    },
    {
        name: 'Mount Elizabeth Hospital',
        eta: '19.29',
        distance: '6.2 km',
        telemedicine: 'Available',
        status: ['Nearby', 'Favorite', 'Visited'],
        lat: 1.3041,
        lng: 103.8322,
    },
    {
        name: 'Woodlands Health',
        eta: '19.35',
        distance: '7.2 km',
        telemedicine: 'Available',
        status: ['Favorite', 'Visited'],
        lat: 1.4449,
        lng: 103.7823,
    },
    {
        name: 'Sengkang General Hospital',
        eta: '19.56',
        distance: '10.2 km',
        telemedicine: 'Available',
        status: ['Visited'],
        lat: 1.3911,
        lng: 103.8918,
    },
];

const HospitalMapPage = () => {
    const [currentLocation, setCurrentLocation] = useState([1.3521, 103.8198]);
    const [locationAccess, setLocationAccess] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResultLocation, setSearchResultLocation] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(true);
    const [showRoute, setShowRoute] = useState(false);
    const [showBookingButton, setShowBookingButton] = useState(false); // State for showing the booking button

    // Location effect remains the same
    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            setIsLoadingLocation(false);
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        const success = (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation([latitude, longitude]);
            setLocationAccess(true);
            setLocationError(null);
            setIsLoadingLocation(false);
        };

        const error = (err) => {
            setLocationError(
                err.code === 1 ? 'Permission denied. Please enable location access in your browser settings.' :
                err.code === 2 ? 'Location unavailable. Please try again.' :
                err.code === 3 ? 'Location request timed out. Please try again.' :
                'An unknown error occurred while getting your location.'
            );
            setLocationAccess(false);
            setIsLoadingLocation(false);
        };

        const watchId = navigator.geolocation.watchPosition(success, error, options);

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setSearchError(null);
        setShowRoute(false); // Reset route when search changes
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        setSearchError(null);
        setIsSearching(true);
        setShowRoute(false);
        setShowBookingButton(false); // Hide booking button until successful search

        const formattedSearchQuery = searchQuery.trim();
        if (!formattedSearchQuery) {
            setSearchError('Please enter a location to search');
            setIsSearching(false);
            return;
        }

        try {
            const searchUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formattedSearchQuery)}+Singapore&format=json&limit=1`;
            
            const response = await fetch(searchUrl, {
                headers: {
                    'User-Agent': 'MediMap/1.0 (medimap@example.com)'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                
                if (isNaN(lat) || isNaN(lon)) {
                    throw new Error('Invalid coordinates received');
                }

                if (lat < 1.22 || lat > 1.47 || lon < 103.6 || lon > 104.1) {
                    setSearchError('Location must be within Singapore');
                    setIsSearching(false);
                    return;
                }

                setSearchResultLocation([lat, lon]);
                setShowRoute(true); // Enable route after successful search
                setSearchError(null);
                setShowBookingButton(true); // Show booking button after successful search
            } else {
                setSearchError('Location not found in Singapore. Please try a different search term.');
            }
        } catch (error) {
            console.error('Search error:', error);
            setSearchError('An error occurred while searching. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="hospital-map-page">
            <header className = "map-header">
                <div className = "map-logo">
                    <img src={logo} alt="Medimap Logo"/>
                </div>
                <nav className = "map-navbar">
                    <a href="/landing"> Home </a>
                    <a href="/about"> About Us </a>
                    <a href="#"> My Booking </a>
                </nav>
            </header>
            {/* Sidebar section remains the same */}
            <div className="sidebar">
                <div className="search-section">
                    <form onSubmit={handleSearchSubmit} className="search-form">
                        <input
                            type="text"
                            placeholder="Search location in Singapore"
                            className="search-bar"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            disabled={isSearching}
                        />
                        <button 
                            type="submit" 
                            className="search-button"
                            disabled={isSearching}
                        >
                            {isSearching ? 'Searching...' : 'Search'}
                        </button>
                    </form>
                    
                    {searchError && (
                        <div className="search-error">
                            <p>{searchError}</p>
                        </div>
                    )}

                    {searchResultLocation && !searchError && (
                        <div className="search-success">
                            <p>Location found! Map centered on search result.</p>
                        </div>
                    )}
                </div>

                {/* Location Status Indicator */}
                <div className="location-status">
                    {isLoadingLocation ? (
                        <p>Getting your location...</p>
                    ) : locationError ? (
                        <div className="error-message">
                            <p>{locationError}</p>
                            <button onClick={() => window.location.reload()}>
                                Try Again
                            </button>
                        </div>
                    ) : locationAccess ? (
                        <p>📍 Using your current location</p>
                    ) : (
                        <p>Using default location (Singapore)</p>
                    )}
                </div>
                {/* Filters for hospitals */}
                <div className="filters">
                    <h3>Type</h3>
                    <label><input type="checkbox" checked /> Private</label>
                    <label><input type="checkbox" /> Public</label>
                    <label><input type="checkbox" /> Non-profit</label>
                    <label><input type="checkbox" /> Profit</label>

                    <h3>Services</h3>
                    <label><input type="checkbox" /> General Services</label>
                    <label><input type="checkbox" /> Cardiology</label>
                    <label><input type="checkbox" /> Neurology</label>
                    <label><input type="checkbox" /> Radiology</label>
                    <label><input type="checkbox" /> Urology</label>

                    <h3>Preference</h3>
                    <label><input type="checkbox" /> Favorite</label>
                    <label><input type="checkbox" /> Nearby</label>
                    <label><input type="checkbox" /> Visited</label>

                    {/* Conditionally render the Book an Appointment button */}
                    {showBookingButton && (
                    <Link to="/bookform">
                        <button className="book-appointment-button" >
                            Book an Appointment Now
                        </button>
                    </Link>
                    )}
                </div>
            </div>

            <div className="hospital-list">
                <h2>List of Hospitals, Clinics, and Pharmacy</h2>
                {hospitals.map((hospital, index) => (
                    <div className="hospital-item" key={index}>
                        <h3>{hospital.name}</h3>
                        <p>ETA: {hospital.eta} ({hospital.distance} away)</p>
                        <p>Telemedicine: {hospital.telemedicine}</p>
                        <p>
                            {hospital.status.map((status, i) => (
                                <span key={i} className="status-tag">{status}</span>
                            ))}
                        </p>
                    </div>
                ))}
                <button className="see-more">See more results</button>
            </div>

            <div className="map-container">
                <MapContainer 
                    center={searchResultLocation || currentLocation} 
                    zoom={13} 
                    className="leaflet-map"
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <SetMapCenter position={searchResultLocation || currentLocation} />
                    
                    {/* Current location marker */}
                    {locationAccess && (
                        <Marker position={currentLocation} icon={customIcon}>
                            <Popup>
                                <strong>Your current location</strong>
                                <br />
                                Lat: {currentLocation[0].toFixed(4)}
                                <br />
                                Lng: {currentLocation[1].toFixed(4)}
                            </Popup>
                        </Marker>
                    )}

                    {/* Search result marker */}
                    {searchResultLocation && (
                        <Marker position={searchResultLocation} icon={customIcon}>
                            <Popup>
                                <strong>Search Result</strong>
                                <br />
                                {searchQuery}
                                <br />
                                Lat: {searchResultLocation[0].toFixed(4)}
                                <br />
                                Lng: {searchResultLocation[1].toFixed(4)}
                            </Popup>
                        </Marker>
                    )}

                    {/* Hospital markers */}
                    {hospitals.map((hospital, index) => (
                        <Marker 
                            key={index}
                            position={[hospital.lat, hospital.lng]} 
                            icon={customIcon}
                        >
                            <Popup>{hospital.name}</Popup>
                        </Marker>
                    ))}

                    {/* Only show routing when we have both locations and showRoute is true */}
                    {locationAccess && searchResultLocation && showRoute && (
                        <Routing 
                            start={currentLocation} 
                            end={searchResultLocation}
                        />
                    )}
                </MapContainer>
            </div>
        </div>
    );
};

export default HospitalMapPage;
