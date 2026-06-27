const { admin } = require('../config/firebase');

const isFirebaseReady = () => admin.apps && admin.apps.length > 0;

const authenticateUser = async (req, res, next) => {
  if (!isFirebaseReady()) {
    // Dev fallback: accept a user ID from header or skip auth
    const devUser = req.headers['x-user-id'];
    if (devUser) {
      req.user = { uid: devUser, email: `${devUser}@dev.local` };
      return next();
    }
    return res.status(503).json({ error: 'Firebase not initialized. Set FIREBASE_SERVICE_ACCOUNT_KEY in .env' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const optionalAuth = async (req, res, next) => {
  if (!isFirebaseReady()) {
    const devUser = req.headers['x-user-id'];
    if (devUser) {
      req.user = { uid: devUser, email: `${devUser}@dev.local` };
    }
    return next();
  }

  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      req.user = await admin.auth().verifyIdToken(token);
    }
  } catch {}
  next();
};

module.exports = { authenticateUser, optionalAuth };
