// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzJEFrAGJjGEmfZdjITcK5ciVtI0W3eSA",
  authDomain: "house-marketplace-app-ca629.firebaseapp.com",
  projectId: "house-marketplace-app-ca629",
  storageBucket: "house-marketplace-app-ca629.appspot.com",
  messagingSenderId: "621785709830",
  appId: "1:621785709830:web:68dad5a81651a09064f287"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore()