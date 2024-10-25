import { getDatabase, ref, push, set } from "firebase/database";
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
