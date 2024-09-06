// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getFirestore,doc,setDoc } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyD-GdimwcZwU2SfrapTTBINo3g5lo9no9U",
  authDomain: "finance-tracker-376d8.firebaseapp.com",
  projectId: "finance-tracker-376d8",
  storageBucket: "finance-tracker-376d8.appspot.com",
  messagingSenderId: "335839541496",
  appId: "1:335839541496:web:f97ab6eb5a13e88308a30d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const fireDB = getFirestore(app);
const provider = new GoogleAuthProvider();

export {fireDB,auth,provider,doc,setDoc};