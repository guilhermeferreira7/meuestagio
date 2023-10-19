import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { firebaseConstants } from '../../constants/firebase';

const firebaseConfig = {
  apiKey: firebaseConstants.apiKey,
  authDomain: firebaseConstants.authDomain,
  projectId: firebaseConstants.projectId,
  storageBucket: firebaseConstants.storageBucket,
  messagingSenderId: firebaseConstants.messagingSenderId,
  appId: firebaseConstants.appId,
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
