import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
} from 'firebase/auth';

const hasFirebaseConfig = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'dummy-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'localhost',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'dummy-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

let appInstance: any = null;
let authInstance: any = null;

if (hasFirebaseConfig) {
  try {
    appInstance = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    authInstance = getAuth(appInstance);
  } catch (err) {
    console.warn('Firebase client failed to initialize:', err);
  }
}

export const app = appInstance;
export const auth = authInstance;

export const signInWithGoogle = async () => {
  if (!auth) {
    console.warn('Firebase Auth is not configured with valid credentials.');
    return;
  }
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const signInWithEmail = async (email: string, pass: string) => {
  if (!auth) {
    console.warn('Firebase Auth is not configured with valid credentials.');
    return;
  }
  return signInWithEmailAndPassword(auth, email, pass);
};

export const signUpWithEmail = async (email: string, pass: string) => {
  if (!auth) {
    console.warn('Firebase Auth is not configured with valid credentials.');
    return;
  }
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  await sendEmailVerification(cred.user);
  return cred;
};

export const setupRecaptcha = (elementId: string) => {
  if (!auth) return null;
  return new RecaptchaVerifier(auth, elementId, {
    size: 'invisible',
  });
};

export const signInWithPhone = async (phoneNumber: string, appVerifier: any) => {
  if (!auth) return;
  return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};

export const signOut = async () => {
  if (auth) return firebaseSignOut(auth);
};

export const resetPassword = async (email: string) => {
  if (auth) return sendPasswordResetEmail(auth, email);
};

export const getCurrentUser = () => (auth ? auth.currentUser : null);

export const getIdToken = async (forceRefresh?: boolean) => {
  return auth?.currentUser?.getIdToken(forceRefresh);
};
