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
    const [currentLocation, setCurrentLocation] = useState([1.3521, 103.8198]); // Default to Singapore
    const [locationAccess, setLocationAccess] = useState(false); // Track location permission

    // Prompt the user for location access and set the current location if granted
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

    return (
        <div className="hospital-map-page">
            <div className="sidebar">
                {/* Search bar */}
                <input type="text" placeholder="Direct Search" className="search-bar" />

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
                <MapContainer center={currentLocation} zoom={13} className="leaflet-map">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <SetMapCenter position={currentLocation} /> {/* Update map center */}
                    {locationAccess && (
                        <Marker position={currentLocation} icon={customIcon}>
                            <Popup>Your current location</Popup>
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
