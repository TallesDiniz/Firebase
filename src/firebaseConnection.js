import { initializeApp  } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBDikSDsoPbdU9O89j_gpLNYE6JPHNGB0Q",
  authDomain: "curso-ef81d.firebaseapp.com",
  projectId: "curso-ef81d",
  storageBucket: "curso-ef81d.firebasestorage.app",
  messagingSenderId: "824888832820",
  appId: "1:824888832820:web:214040b0fcb3fc25c92b61",
  measurementId: "G-NRYP4TGFDW"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

const auth = getAuth(firebaseApp);  

export { db, auth };