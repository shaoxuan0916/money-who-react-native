// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// @ts-ignore
import {
  // @ts-ignore
  API_KEY,
  // @ts-ignore
  AUTH_DOMAIN,
  // @ts-ignore
  PROJECT_ID,
  // @ts-ignore
  STORAGE_BUCKET,
  // @ts-ignore
  APP_ID,
  // @ts-ignore
  MESSAGING_SENDER_ID,
  // @ts-ignore
} from "@env"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  // databaseURL: process.env.DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const db = getFirestore(app)
