import * as dotenv from 'dotenv';
dotenv.config();

export const firebaseConstants = {
  apiKey: process.env.FIREBASE_API_KEY,
  appId: process.env.FIREBASE_APP_ID,
  messagingSenderId: process.env.FIREBASE_SENDER_ID,
  authDomain: 'meuestagio-images.firebaseapp.com',
  projectId: 'meuestagio-images',
  storageBucket: 'meuestagio-images.appspot.com',
};
