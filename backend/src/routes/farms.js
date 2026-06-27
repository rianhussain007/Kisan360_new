const express = require('express');
const { authenticateUser } = require('../middleware/auth');
const Farm = require('../models/Farm');
const router = express.Router();

// All routes require authentication
router.use(authenticateUser);

// GET /api/farms — list user's farms
router.get('/', async (req, res) => {
  try {
    const farms = await Farm.find({ firebaseUid: req.user.uid }).sort({ createdAt: -1 });
    res.json({ success: true, farms });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch farms' });
  }
});

// POST /api/farms — create a farm
router.post('/', async (req, res) => {
  try {
    const farm = await Farm.create({ ...req.body, firebaseUid: req.user.uid });
    res.status(201).json({ success: true, farm });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create farm' });
  }
});

// PUT /api/farms/:id — update a farm
router.put('/:id', async (req, res) => {
  try {
    const farm = await Farm.findOneAndUpdate(
      { _id: req.params.id, firebaseUid: req.user.uid },
      req.body,
      { new: true, runValidators: true }
    );
    if (!farm) return res.status(404).json({ success: false, error: 'Farm not found' });
    res.json({ success: true, farm });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update farm' });
  }
});

// DELETE /api/farms/:id — delete a farm
router.delete('/:id', async (req, res) => {
  try {
    const farm = await Farm.findOneAndDelete({ _id: req.params.id, firebaseUid: req.user.uid });
    if (!farm) return res.status(404).json({ success: false, error: 'Farm not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete farm' });
  }
});

module.exports = router;
