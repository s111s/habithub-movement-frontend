import { useEffect } from 'react';
import { FirebaseApp, initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import { Database, getDatabase, ref, set } from "firebase/database";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAglPIIrP3T3Fumw_LmTN8qQmLAjvPIE-0",
    authDomain: "bottrade-dashboard.firebaseapp.com",
    databaseURL: "https://bottrade-dashboard-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bottrade-dashboard",
    storageBucket: "bottrade-dashboard.firebasestorage.app",
    messagingSenderId: "41384459446",
    appId: "1:41384459446:web:6354812fde12c049b5fa17",
    measurementId: "G-L3SVSJQLWL"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const database = getDatabase(app);

/**
 * Save image hash & URL to Firebase Realtime Database
 * @param hash - SHA-256 hash of the image
 * @param imageUrl - Image URL from GoFile.io
 */
// Declare types for Firebase objects
let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;
let database: Database | null = null;

export const useFirebase = () => {
    useEffect(() => {
        if (typeof window !== "undefined") {
            // Initialize Firebase only on the client side
            app = initializeApp(firebaseConfig);
            analytics = getAnalytics(app);
            database = getDatabase(app);
        }
    }, []);

    return { app, analytics, database };
};

/**
 * Save image hash & URL to Firebase Realtime Database
 * @param hash - SHA-256 hash of the image
 * @param imageUrl - Image URL from GoFile.io
 */
export const saveToDatabase = async (hash: string, imageUrl: string) => {
    try {
        if (!database) {
            console.error("❌ Firebase is not initialized yet.");
            return;
        }

        const timestamp = new Date().toISOString();
        const newPostRef = ref(database, 'uploads/' + hash);
        await set(newPostRef, {
            hash,
            imageUrl,
            timestamp,
        });

        console.log("✅ Stored in Realtime Database:", hash);
    } catch (error) {
        console.error("❌ Error saving to Realtime Database:", error);
        throw error;
    }
};