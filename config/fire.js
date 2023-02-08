import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getDatabase } from "firebase/database";
import { initializeApp, getApps, getApp } from "firebase/app";



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcnzBNoBM1DtHJGbGKZ8M35YwQjSv7tEc",
  authDomain: "naropass.firebaseapp.com",
  projectId: "naropass",
  storageBucket: "naropass.appspot.com",
  messagingSenderId: "88703409363",
  appId: "1:88703409363:web:93f0ee88a70638206b8826",
  measurementId: "G-NG5VJNJSZV",
  databaseURL: "https://naropass-default-rtdb.firebaseio.com/",
};

firebase.initializeApp(firebaseConfig);

export const fire = firebase.default.auth();

export const db = getDatabase(!getApps().length ? initializeApp(firebaseConfig) : getApp());