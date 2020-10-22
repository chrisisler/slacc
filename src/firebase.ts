import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const app = firebase.initializeApp({
  apiKey: 'AIzaSyDXPxvO2bTyonaj0T-iTabnFg_b6wnA9sg',
  authDomain: 'slacc1.firebaseapp.com',
  databaseURL: 'https://slacc1.firebaseio.com',
  projectId: 'slacc1',
  storageBucket: 'slacc1.appspot.com',
  messagingSenderId: '270415470843',
  appId: '1:270415470843:web:81bc55c923c570a658105e',
});

// Must be in this order
export const db = app.firestore();
export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();

/**
 * Acceptable collection path strings for `db.collection()`.
 */
export enum DbPath {
  Channels = 'channels',
  Messages = 'messages',
}
