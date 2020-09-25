import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// firebase init - add your own config here
const firebaseConfig = {
  apiKey: "AIzaSyDM43nhf434o1lPXz1aPXv2h3cbvObEim0",
  authDomain: "vuegram-task1.firebaseapp.com",
  databaseURL: "https://vuegram-task1.firebaseio.com",
  projectId: "vuegram-task1",
  storageBucket: "vuegram-task1.appspot.com",
  messagingSenderId: "409085401084",
  appId: "1:409085401084:web:98898f6f99227509a08479",
  measurementId: "G-9ELJ8NHSZZ"
};
firebase.initializeApp(firebaseConfig);

// utils
const db = firebase.firestore();
const auth = firebase.auth();
const AppDB = firebase.database().ref("budget");
// const AppDB = db.ref("budget");
// const AppStorage = firebase.storage();

// collection references
const usersCollection = db.collection("users");
const postsCollection = db.collection("posts");
const commentsCollection = db.collection("comments");
const likesCollection = db.collection("likes");

// export utils/refs
export {
  db,
  auth,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection,
  AppDB,
  // AppStorage
};
