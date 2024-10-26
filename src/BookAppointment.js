// Import Firebase functions
import { getDatabase, ref, push, set } from "firebase/database";
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8vjKq3PTgY3fMelbwIVhaKqKERbCUNdc",
  authDomain: "sc2002-5105d.firebaseapp.com",
  projectId: "sc2002-5105d",
  storageBucket: "sc2002-5105d.appspot.com",
  messagingSenderId: "714442349120",
  appId: "1:714442349120:web:fedf34767969bb69fcdda5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function bookAppointment(userId, hospitalName, date) {
  const bookingsRef = ref(database, 'users/' + userId + '/bookings');
  const newBookingRef = push(bookingsRef);
  set(newBookingRef, {
    hospitalName: hospitalName,
    date: date
  });
}

function addFavoriteHospital(userId, hospitalName) {
  const favHospitalsRef = ref(database, 'users/' + userId + '/favoriteHospitals/' + hospitalName);
  set(favHospitalsRef, true);
}
