const express = require('express');
const { authenticateUser } = require('../middleware/auth');
const Detection = require('../models/Detection');
const router = express.Router();

// All routes require authentication
router.use(authenticateUser);

// GET /api/detections — list user's recent detections
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const detections = await Detection.find({ firebaseUid: req.user.uid })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json({ success: true, detections });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch detections' });
  }
});

// POST /api/detections — save a detection result
router.post('/', async (req, res) => {
  try {
    const detection = await Detection.create({ ...req.body, firebaseUid: req.user.uid });
    res.status(201).json({ success: true, detection });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to save detection' });
  }
});

module.exports = router;
