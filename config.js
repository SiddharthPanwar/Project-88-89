import firebase from 'firebase'
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyACtX5r8YGIionEj8iM60IMIgOOg-isdjw",
    authDomain: "barter-system-app-17102007.firebaseapp.com",
    projectId: "barter-system-app-17102007",
    storageBucket: "barter-system-app-17102007.appspot.com",
    messagingSenderId: "208993303735",
    appId: "1:208993303735:web:0639d53c7edb9f173ea132",
    measurementId: "G-DBV83KZWPL"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore()