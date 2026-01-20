// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// 1. Importar o Firestore
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCyFXrpmX3KORpCfjqRxixXMWV3F47q-NQ",
    authDomain: "notas-franciscanas.firebaseapp.com",
    projectId: "notas-franciscanas",
    storageBucket: "notas-franciscanas.firebasestorage.app",
    messagingSenderId: "335449978824",
    appId: "1:335449978824:web:e578f4c93fa556c1d372fd",
    measurementId: "G-WZYZG1YEEV"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 2. Inicializar e EXPORTAR o banco de dados
export const db = getFirestore(app);
export const auth = getAuth(app);