import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCNpmb621bX-VMn94SAd_-I_NjwrGzN1mc",
  authDomain: "studybuddy-814f5.firebaseapp.com",
  projectId: "studybuddy-814f5",
  storageBucket: "studybuddy-814f5.firebasestorage.app",
  messagingSenderId: "709043838497",
  appId: "1:709043838497:web:60e3271c404db2572acd60",
  measurementId: "G-N60CSW06R5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
