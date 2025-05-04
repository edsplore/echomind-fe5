import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCwxtNAUJgw2QsKbKpkceRz7usb4Y4yIVY",
  authDomain: "xpress-voice.firebaseapp.com",
  projectId: "xpress-voice",
  storageBucket: "xpress-voice.firebasestorage.app",
  messagingSenderId: "206497091675",
  appId: "1:206497091675:web:8d32cfce3cbd772f86ef7e",
  measurementId: "G-VHEEE3KFPT",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
