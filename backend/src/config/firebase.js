const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    if (!admin.apps.length) {
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
        : null;

      if (serviceAccount) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        });
        console.log('✅ Firebase Admin SDK initialized');
      } else {
        console.log('⚠️ Firebase service account not configured — auth middleware will use dev fallback');
      }
    }
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
  }
};

module.exports = { admin, initializeFirebase };
