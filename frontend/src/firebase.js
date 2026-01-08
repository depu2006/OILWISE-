// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADo0asxqXJLl2_f-mM6JCAMeGcoJpQ_jg",
  authDomain: "oilwise-app.firebaseapp.com",
  projectId: "oilwise-app",
  storageBucket: "oilwise-app.firebasestorage.app",
  messagingSenderId: "863423972602",
  appId: "1:863423972602:web:ba0ac784895bc9939db543"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);   // for login / register
export const db = getFirestore(app); // for database
export default app;
