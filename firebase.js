import { initializeApp,getApp,getApps} from "@firebase/app";
import {getAuth} from "@firebase/auth";
import {getFirestore} from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCICT3vPX4doMwylgo8VCQ6C4P2o4OBsOU",
  authDomain: "signal-clone-7571.firebaseapp.com",
  projectId: "signal-clone-7571",
  storageBucket: "signal-clone-7571.appspot.com",
  messagingSenderId: "538355842034",
  appId: "1:538355842034:web:324d1c00ae710c43f2896b"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);

export {db,auth};