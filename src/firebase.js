// src/firebase.js
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBE4vlXbskQAN1VzP-Q09A8U5cuybgYDaw",
  authDomain: "seguridad-de-datos-9913e.firebaseapp.com",
  projectId: "seguridad-de-datos-9913e",
  storageBucket: "seguridad-de-datos-9913e.firebasestorage.app",
  messagingSenderId: "294896974728",
  appId: "1:294896974728:web:930da0bab85cd6400ad83d",
  measurementId: "G-QC82YB4DJ3"
};
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Exporta las funciones de autenticación adicionales
export { 
  auth, 
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,  // Exportamos signOut
  collection,
  addDoc,
  query,
  where,
  getDocs
}