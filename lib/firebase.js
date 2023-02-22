import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDIwPMmGqwf3dniVzpmXboPuk4cmBtmfN8",
    authDomain: "boulder-ce8e1.firebaseapp.com",
    projectId: "boulder-ce8e1",
    storageBucket: "boulder-ce8e1.appspot.com",
    messagingSenderId: "940458675085",
    appId: "1:940458675085:web:c24027cb665f00a5e30bc4",
    measurementId: "G-Y0VBTNBVX3"
  };


if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
};

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();

export const storage = firebase.storage();