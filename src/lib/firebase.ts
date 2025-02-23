import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCJK1HQP-SJyKR8U7S5wUBhaXJoQcPHxEw",
  authDomain: "labs-whitelabelled.firebaseapp.com",
  projectId: "labs-whitelabelled",
  storageBucket: "labs-whitelabelled.firebasestorage.app",
  messagingSenderId: "735408465417",
  appId: "1:735408465417:web:b35694bd5943e7f336bad8",
  measurementId: "G-KXT412Z064"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);