import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDP7tRC7Xw0yyoKTkFyPDKcKn_cakoEZWM",
  authDomain: "shopping-cart-c5a3c.firebaseapp.com",
  projectId: "shopping-cart-c5a3c",
  storageBucket: "shopping-cart-c5a3c.firebasestorage.app",
  messagingSenderId: "358249081131",
  appId: "1:358249081131:web:b8489d9fa4e9200a4bbd6e",
 
};

// ✅ Initialize ONCE
const app = initializeApp(firebaseConfig);

// ✅ Firestore
export const db = getFirestore(app);
