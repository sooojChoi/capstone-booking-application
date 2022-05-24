import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from 'firebase/database';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB6An1-FsVHwYMf9PlP00HaO8pcETL6PeM",
  authDomain: "capstone-booking-application.firebaseapp.com",
  projectId: "capstone-booking-application",
  storageBucket: "capstone-booking-application.appspot.com",
  messagingSenderId: "195828736700",
  appId: "1:195828736700:web:d3bc9f5b9f2a263bc566b9"
};

const app = initializeApp(firebaseConfig);


const auth = getAuth(app);
const db = getFirestore(app);
const storageDb = getStorage(app);

export { auth, db ,storageDb};

