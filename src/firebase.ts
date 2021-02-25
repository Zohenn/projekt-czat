import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBcvnUOXQs_Ner49XVSnwgdbwWrGodPCBw",
  authDomain: "projekt-czat.firebaseapp.com",
  projectId: "projekt-czat",
  storageBucket: "projekt-czat.appspot.com",
  messagingSenderId: "1040157403497",
  appId: "1:1040157403497:web:109c6693620cd3f6dff5f8"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();
