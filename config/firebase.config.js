// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcX_bpjZHdIy1zicRGUsHuZ1_927htyf4",
  authDomain: "rebid-app-99afb.firebaseapp.com",
  projectId: "rebid-app-99afb",
  storageBucket: "rebid-app-99afb.appspot.com",
  messagingSenderId: "1058218171804",
  appId: "1:1058218171804:web:11bacd0522f2a0aa287c59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const authentication = getAuth(app)
const db = getFirestore(app)

export{authentication,db}