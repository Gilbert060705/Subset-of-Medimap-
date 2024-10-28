import { db, setDoc, doc } from "./firebase";

async function storeUserDetails(email, fullName, userID) {
    try {
      await setDoc(doc(db, "users", userID), {
        fullName: fullName,
        gender: '',
        age: '',
        email: email,
        phone: '',
        address: '',
      });
  
      console.log("User Details saved to Firestore:");
    } catch (error) {
      console.error("Error saving user details:", error.message);
    }
  }

export {
    storeUserDetails
}