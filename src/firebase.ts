import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { Channel, Message } from './interfaces';

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

/**
 * `db.collection('foo').add(obj)` is not type safe.
 * This is the preferred method of adding an item to the apps collections.
 */
export const DbWrite = {
  channels(entry: Omit<Channel, 'id'>) {
    return db.collection(DbPath.Channels).add(entry);
  },
  messages(entry: Omit<Message, 'id'>) {
    return db.collection(DbPath.Messages).add(entry);
  },
};
