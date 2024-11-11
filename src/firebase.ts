import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVxLZCTVJJmsflVT03u2uHbyMvpXvJAZw",
  authDomain: "assignment-3c3e5.firebaseapp.com",
  projectId: "assignment-3c3e5",
  storageBucket: "assignment-3c3e5.firebasestorage.app",
  messagingSenderId: "586735869195",
  appId: "1:586735869195:web:03025424ca84d3c8bad60e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
