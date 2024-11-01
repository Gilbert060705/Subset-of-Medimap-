// src/HospitalService.js
import { db, doc, getDoc, setDoc } from './firebase';

export const HospitalService = {
  getFavorites: async (userId) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        return userData.favorites || [];
      }
      return [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  toggleFavorite: async (hospitalId, userId) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      let favorites = [];

      if (docSnap.exists()) {
        const userData = docSnap.data();
        favorites = userData.favorites || [];
      }

      const index = favorites.indexOf(hospitalId);
      if (index === -1) {
        favorites.push(hospitalId);
      } else {
        favorites.splice(index, 1);
      }

      await setDoc(docRef, { favorites }, { merge: true });
      return favorites;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }
};

export default HospitalService;