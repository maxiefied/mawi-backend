// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyChlmdVn1qBjK1CoZbw2aq0N6Ae5HEUzP8",
    authDomain: "mawi-solutions-a6bd2.firebaseapp.com",
    databaseURL: "https://mawi-solutions-a6bd2-default-rtdb.firebaseio.com", // ✅ your correct URL
    projectId: "mawi-solutions-a6bd2",
    storageBucket: "mawi-solutions-a6bd2.appspot.com",
    messagingSenderId: "898615756772",
    appId: "1:898615756772:web:0b50462890da2d9424a9f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database };
