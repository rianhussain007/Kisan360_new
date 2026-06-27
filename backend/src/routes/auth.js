const express = require('express');
const { verifyIdToken } = require('../config/firebase');
const { authenticateUser } = require('../middleware/auth');
const router = express.Router();

// POST /api/auth/verify - Verify Firebase token
router.post('/verify', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({
        success: false,
        error: 'ID token is required'
      });
    }

    const decodedToken = await verifyIdToken(idToken);
    
    res.json({
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

// GET /api/auth/me - Get current user
router.get('/me', authenticateUser, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get user information'
    });
  }
});

module.exports = router;
