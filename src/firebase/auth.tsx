import { AsyncStorage } from 'react-native';
import { auth, authEmailProvider } from './firebase';
// import { promisify } from 'es6-promisify';

// Sign Up
export const doCreateUserWithEmailAndPassword = (email, password) =>
  auth.createUserWithEmailAndPassword(email, password);

// Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
  auth.signInWithEmailAndPassword(email, password);

// Sign Out
export const doSignOut = async () => {
  auth.signOut();
  // try {
  //   AsyncStorage.clear();
  //   // await AsyncStorage.setItem("@HEC2:key", "nok");
  //   } catch (error) {
  //   // Error saving data
  //   }
};

// IsAuthUser?
export const doAuthUser = (authUser) =>
  auth.onAuthStateChanged(authUser);

// isChangePassword
export const doChangePassword = (email, oldPwd, newPwd) => 
  // const cred = authEmailProvider.credential(email, oldPwd);
  auth.currentUser.reauthenticateAndRetrieveDataWithCredential(
    authEmailProvider.credential(email, oldPwd)
  )
    .then(() => auth.currentUser.updatePassword(newPwd))
    // .catch((err) => console.log(err))    
