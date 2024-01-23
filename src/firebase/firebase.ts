// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAv2cF6nNP2vJGIruL56yR402w_nNlZiug",
  authDomain: "task-93c27.firebaseapp.com",
  projectId: "task-93c27",
  storageBucket: "task-93c27.appspot.com",
  messagingSenderId: "164176018785",
  appId: "1:164176018785:web:b16ab8a06900e26fad1920",
  measurementId: "G-55QW4JF8P4",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth();
const firestore = getFirestore(app);
const tasks = collection(firestore, "tasks");
const users = collection(firestore, "users");
export { app, auth, firestore, tasks, users };
