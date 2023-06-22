import firebase from "firebase/app";
import "firebase/firestore"; // If using Firebase database
import "firebase/auth"; // If using Firebase authentication

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSy***************************",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "************",
  appId: "1:************:web:************",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
