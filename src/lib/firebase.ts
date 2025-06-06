import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBM_uKOOXqp5-dxYksDovUUjrL2LJJceKU",
  authDomain: "allied-global-236.firebaseapp.com",
  projectId: "allied-global-236",
  storageBucket: "allied-global-236.firebasestorage.app",
  messagingSenderId: "719332723416",
  appId: "1:719332723416:web:eabdfd2cc3ca1afe0425ad",
  measurementId: "G-S01B231K1K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
