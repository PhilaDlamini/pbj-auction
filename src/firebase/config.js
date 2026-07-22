/* Connects our app to firebase */
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAxz1Roap8Olq4pKIp6RIUx5m7QOi7Penw",
  authDomain: "pbj-auction.firebaseapp.com",
  projectId: "pbj-auction",
  storageBucket: "pbj-auction.firebasestorage.app",
  messagingSenderId: "812876785940",
  appId: "1:812876785940:web:7643baeecd82980ca37a01"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
export { app };