// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClm1iO_o4gtIHtfgOV90J4al2grYLL_v8",
  authDomain: "ifcode-25548.firebaseapp.com",
  projectId: "ifcode-25548",
  storageBucket: "ifcode-25548.firebasestorage.app",
  messagingSenderId: "1097749647061",
  appId: "1:1097749647061:web:7d0d3e829c00a86b829c5c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };