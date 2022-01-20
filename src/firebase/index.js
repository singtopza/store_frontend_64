// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEw-ckiYoSKR5q-jzO3ffxU0ou7f31Yis",
  authDomain: "fir-react-upload-e0b10.firebaseapp.com",
  projectId: "fir-react-upload-e0b10",
  storageBucket: "fir-react-upload-e0b10.appspot.com",
  messagingSenderId: "256820186750",
  appId: "1:256820186750:web:e759fa9d9018584d20122f",
  measurementId: "G-Y6WRWLBEWF"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebase);
//Export storage
const storage = getStorage(firebase);

export { storage, firebase as default };