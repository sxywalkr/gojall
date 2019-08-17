import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyDLalpOZO3xDwiTGiIiKJUuD0zQq5JecLU",
  authDomain: "apprijal2019.firebaseapp.com",
  databaseURL: "https://apprijal2019.firebaseio.com",
  projectId: "apprijal2019",
  storageBucket: "",
  messagingSenderId: "953482080513",
  appId: "1:953482080513:web:f452787cdb5adbaa"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();
const authEmailProvider = firebase.auth.EmailAuthProvider;

export {
  db,
  auth,
  storage,
  authEmailProvider,
};
