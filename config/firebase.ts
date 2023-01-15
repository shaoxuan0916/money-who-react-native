// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {  getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // apiKey: process.env.API_KEY,
  // authDomain: process.env.AUTH_DOMAIN,
  // databaseURL: process.env.DATABASE_URL,
  // projectId: process.env.PROJECT_ID,
  // storageBucket: process.env.STORAGE_BUCKET,
  // messagingSenderId: process.env.MESSAGING_SENDER_ID,
  // appId: process.env.APP_ID,
  apiKey: "AIzaSyBJpKsyIAmIpF1cDdG3ky3Wu-_ZvyybfR8",
  authDomain: "moneywho-6a059.firebaseapp.com",
  projectId: "moneywho-6a059",
  storageBucket: "moneywho-6a059.appspot.com",
  messagingSenderId: "557313697156",
  appId: "1:557313697156:web:d189db94166d61a0a469d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app)