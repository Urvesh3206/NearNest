import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
// Make sure FIREBASE_PRIVATE_KEY is correctly formatted in .env
try {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
  console.log('Firebase Admin initialized successfully.');
} catch (error) {
  console.error('Firebase Admin initialization error', error);
}

export const firebaseAdmin = admin;
