// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCzpR-Y3-lAkCajDPkREIG8Yn6_sYvkGb0",
    authDomain: "pompi-89246.firebaseapp.com",
    databaseURL: "https://pompi-89246-default-rtdb.firebaseio.com",
    projectId: "pompi-89246",
    storageBucket: "pompi-89246.firebasestorage.app",
    messagingSenderId: "570772626071",
    appId: "1:570772626071:web:e13dc19d630c92fca3a7d2",
    measurementId: "G-Z25YKZZFK3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export { app, analytics };
