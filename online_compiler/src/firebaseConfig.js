import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyAzECo-3dANCy1N76LSKClerhe1DpIbsgE",
  authDomain: "online-compiler-c53c4.firebaseapp.com",
  projectId: "online-compiler-c53c4",
  storageBucket: "online-compiler-c53c4.firebasestorage.app",
  messagingSenderId: "607340835812",
  appId: "1:607340835812:web:84e4e2c9baa367bff70df1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
<<<<<<< HEAD
export const db = getFirestore(app);
=======
>>>>>>> b6f9c0763a1770175697db8a0851fbb138c6f30f
