import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Priority: .env variables > firebase-applet-config.json fallback
let firebaseConfig: any;
let firestoreDatabaseId: string | undefined;

const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;

if (envApiKey) {
  // Use .env configuration (local dev / production)
  firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
  firestoreDatabaseId = import.meta.env.VITE_FIREBASE_FIRESTORE_DB_ID || undefined;
} else {
  // Fallback: AI Studio applet config
  try {
    const appletConfig = await import('../../firebase-applet-config.json');
    firebaseConfig = appletConfig;
    firestoreDatabaseId = appletConfig.firestoreDatabaseId;
  } catch {
    throw new Error('No Firebase configuration found. Set VITE_FIREBASE_* env vars or provide firebase-applet-config.json');
  }
}

const app = initializeApp(firebaseConfig);
export const db = firestoreDatabaseId
  ? getFirestore(app, firestoreDatabaseId)
  : getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
