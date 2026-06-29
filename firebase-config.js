// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6JhtAbjdNhequzwDAKoAV85WgUBuJvow",
  authDomain: "happy-birthday-gaby.firebaseapp.com",
  projectId: "happy-birthday-gaby",
  storageBucket: "happy-birthday-gaby.firebasestorage.app",
  messagingSenderId: "1016993339115",
  appId: "1:1016993339115:web:169ffbeb9275ea140350ae",
  measurementId: "G-8NKVT5WD5T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
