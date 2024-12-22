// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAFbZacUTS-YYrn94q3AOHWdhJzkz5XZr0",
    authDomain: "fir-chat-app-master-dad5a.firebaseapp.com",
    databaseURL:
        "https://fir-chat-app-master-dad5a-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fir-chat-app-master-dad5a",
    storageBucket: "fir-chat-app-master-dad5a.firebasestorage.app",
    messagingSenderId: "238468462066",
    appId: "1:238468462066:web:ebc4604bff6d0665e7276b",
    measurementId: "G-Z8VTXVE1N3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
