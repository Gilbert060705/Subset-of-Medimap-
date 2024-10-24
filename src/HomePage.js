/**
 * HospitalMapPage component provides an interactive map and list of hospitals, 
 * clinics, and pharmacies. It allows users to view hospitals near their location 
 * and search or filter hospitals based on preferences.
 *
 * <p>The map uses the `react-leaflet` library to render the map and markers, 
 * and it dynamically updates the map center based on the user's location.</p>
 *
 * Dependencies:
 * - React
 * - React Leaflet
 * - Leaflet CSS
 * - Custom marker icon
 * 
 * Features:
 * - User location tracking (with permission)
 * - Dynamic map centering based on current location
 * - Hospital listing with filtering options
 * - Map with hospital markers and popups
 * 
 * Note: If the user denies location access, the map defaults to Singapore's location.
 * 
 * @author [Group1]
 * @version 1.0
 */

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS for map rendering
import L from 'leaflet';
import './HospitalMapPage.css'; // Custom styles for the component

/**
 * Custom marker icon to display markers on the map.
 */
const customIcon = new L.Icon({
    iconUrl: require('./images/marker-icon.png'),  // Path to marker icon image
    iconSize: [25, 41], // Size of the icon
    iconAnchor: [12, 41], // Anchor point for the icon
    popupAnchor: [1, -34], // Popup anchor relative to the icon
});

/**
 * Component to dynamically update the map's center position.
 *
 * @param position Array containing the latitude and longitude to set the map center.
 * @return {null} Does not render any content.
 */
function SetMapCenter({ position }) {
    const map = useMap();
    useEffect(() => {
        map.setView(position);
    }, [position, map]);
    return null;
}

/**
 * Static list of hospital objects containing relevant information such as
 * name, ETA, distance, availability of telemedicine, status, and coordinates.
 */
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

/**
 * HospitalMapPage component renders the entire hospital map page.
 *
 * <p>It consists of a sidebar with filters, a hospital list, and an interactive map.
 * The map shows both the user's current location (if allowed) and the locations of listed hospitals.</p>
 *
 * @return {JSX.Element} A JSX element containing the hospital map page.
 */
const HospitalMapPage = () => {
    const [currentLocation, setCurrentLocation] = useState([1.3521, 103.8198]);
    const [locationAccess, setLocationAccess] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResultLocation, setSearchResultLocation] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(true);

    useEffect(() => {
        // Check if geolocation is supported
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            setIsLoadingLocation(false);
            return;
        }

        // Options for getCurrentPosition
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        // Success handler
        const success = (position) => {
            console.log('Location obtained successfully:', position);
            const { latitude, longitude } = position.coords;
            setCurrentLocation([latitude, longitude]);
            setLocationAccess(true);
            setLocationError(null);
            setIsLoadingLocation(false);
        };

        // Error handler
        const error = (err) => {
            console.error('Location error:', err);
            setLocationError(
                err.code === 1 ? 'Permission denied. Please enable location access in your browser settings.' :
                err.code === 2 ? 'Location unavailable. Please try again.' :
                err.code === 3 ? 'Location request timed out. Please try again.' :
                'An unknown error occurred while getting your location.'
            );
            setLocationAccess(false);
            setIsLoadingLocation(false);
        };

        // Request location
        console.log('Requesting location...');
        const watchId = navigator.geolocation.watchPosition(success, error, options);

        // Cleanup
        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setSearchError(null); // Clear any previous search errors
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        
        // Clear previous search state
        setSearchError(null);
        setIsSearching(true);

        // Validate search query
        const formattedSearchQuery = searchQuery.trim();
        if (!formattedSearchQuery) {
            setSearchError('Please enter a location to search');
            setIsSearching(false);
            return;
        }

        try {
            // Add region bias for Singapore to improve search accuracy
            const searchUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formattedSearchQuery)}+Singapore&format=json&limit=1`;
            
            console.log('Searching for location:', searchUrl);
            
            const response = await fetch(searchUrl, {
                headers: {
                    'User-Agent': 'MediMap/1.0 (medimap@example.com)'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Search results:', data);

            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                
                // Validate coordinates
                if (isNaN(lat) || isNaN(lon)) {
                    throw new Error('Invalid coordinates received');
                }

                // Validate coordinates are within Singapore region (rough bounds)
                if (lat < 1.22 || lat > 1.47 || lon < 103.6 || lon > 104.1) {
                    setSearchError('Location must be within Singapore');
                    setIsSearching(false);
                    return;
                }

                setSearchResultLocation([lat, lon]);
                setSearchError(null);
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
            <div className="sidebar">
                {/* Search section with error handling */}
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

                    {hospitals.map((hospital, index) => (
                        <Marker key={index} position={[hospital.lat, hospital.lng]} icon={customIcon}>
                            <Popup>{hospital.name}</Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default HospitalMapPage;
