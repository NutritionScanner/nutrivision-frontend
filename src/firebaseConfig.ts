// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDGYblLAISRGO8Q-zyrLBf2rzTtM3YJE74',
  authDomain: 'nutritionapp-45ea2.firebaseapp.com',
  projectId: 'nutritionapp-45ea2',
  storageBucket: 'nutritionapp-45ea2.firebasestorage.app',
  messagingSenderId: '720484507236',
  appId: '1:720484507236:android:6d6205b32be6ffe46cc971',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);