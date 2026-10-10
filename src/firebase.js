// src/firebase.js
import { initializeApp } from "firebase/app";
// Agregamos la importación de Firestore
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyDoPqZrPd3ZCZo4AHhBpqN9lLTVEKaEA1c",
  authDomain: "db-didi.firebaseapp.com",
  projectId: "db-didi",
  storageBucket: "db-didi.firebasestorage.app",
  messagingSenderId: "315942559457",
  appId: "1:315942559457:web:0cb9101274e7f45bc7a1a0"
};

// Inicializamos la aplicación de Firebase
const app = initializeApp(firebaseConfig);

// Inicializamos y exportamos la Base de Datos para que otros archivos puedan usarla
export const db = getFirestore(app);

//npm install -g firebase-tools
//firebase init
//firebase deploy
//recordatorio de que esta en moodo prueba