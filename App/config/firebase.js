
// import { initializeApp } from "firebase/app";
// import { getAuth, getReactNativePersistence } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// const firebaseConfig = {
//   apiKey: "AIzaSyD2rxOI5kpIopMkyBXRZ-4OXs0dC2fMjkA",
//   authDomain: "comew-21e0b.firebaseapp.com",
//   projectId: "comew-21e0b",
//   storageBucket: "comew-21e0b.appspot.com",
//   messagingSenderId: "257152396141",
//   appId: "1:257152396141:web:28c3454086a62c26060864",
//   measurementId: "G-JKG3BT4Q4K"
// };


// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const storage = getStorage(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfBzycrKyy1lLxQAbrXd2K8bnUtPlwqtE",
  authDomain: "mopmap-ec79c.firebaseapp.com",
  projectId: "mopmap-ec79c",
  storageBucket: "mopmap-ec79c.appspot.com",
  messagingSenderId: "1087896828771",
  appId: "1:1087896828771:web:09611a03544661f5773156",
  measurementId: "G-3J1W6KSVKT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

