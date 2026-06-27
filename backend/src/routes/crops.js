const express = require('express');
const { authenticateUser } = require('../middleware/auth');
const router = express.Router();

// GET /api/crops - Get crops
router.get('/', authenticateUser, async (req, res) => {
  try {
    const crops = [
      {
        id: '1',
        name: 'Wheat',
        variety: 'HD-2967',
        plantingDate: '2024-01-15',
        expectedHarvest: '2024-04-15',
        status: 'Growing'
      }
    ];

    res.json({
      success: true,
      crops
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch crops'
    });
  }
});

module.exports = router;
