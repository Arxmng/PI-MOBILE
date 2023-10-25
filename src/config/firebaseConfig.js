// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDQkw6h265xYltqqLYB-qXcheaMEXd1A54",
    authDomain: "studiogamesapp.firebaseapp.com",
    projectId: "studiogamesapp",
    storageBucket: "studiogamesapp.appspot.com",
    messagingSenderId: "192591185329",
    appId: "1:192591185329:web:ad72c13e22388117992990",
    measurementId: "G-NY1YTJKZTH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);