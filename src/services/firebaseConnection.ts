// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBi3m56Va7UsFjj-ikUhYUr1b6MTCYl2tA",
  authDomain: "ifcode-teste.firebaseapp.com",
  projectId: "ifcode-teste",
  storageBucket: "ifcode-teste.firebasestorage.app",
  messagingSenderId: "776355456593",
  appId: "1:776355456593:web:4b5dd278e1a659094e3a70",
  measurementId: "G-Y6FV4MSEN8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };