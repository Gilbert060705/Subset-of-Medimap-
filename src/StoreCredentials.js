import { db, setDoc, doc } from "./firebase";

async function storeUserDetails(email, fullName) {
    try {
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        fullName: fullName,
      });
  
      console.log("User Details saved to Firestore:", user);
    } catch (error) {
      console.error("Error saving user details:", error.message);
    }
  }

export {
    storeUserDetails
}