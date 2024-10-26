import { getDatabase, ref, push, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// https://sc2002-5105d-default-rtdb.asia-southeast1.firebasedatabase.app
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8vjKq3PTgY3fMelbwIVhaKqKERbCUNdc",
  authDomain: "sc2002-5105d.firebaseapp.com",
  projectId: "sc2002-5105d",
  storageBucket: "sc2002-5105d.appspot.com",
  messagingSenderId: "714442349120",
  appId: "1:714442349120:web:fedf34767969bb69fcdda5",
  measurementId: "G-ZJM6VTVNBX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const analytics = getAnalytics(app);

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
