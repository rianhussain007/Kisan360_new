const express = require('express');
const router = express.Router();
const axios = require('axios');

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:8001';

// GET /api/advisory - Get AI-powered agricultural advisory via RAG
router.get('/', async (req, res) => {
  try {
    const { location, crop, query, temperature, humidity, condition } = req.query;

    if (!location || !crop) {
      return res.status(400).json({
        error: 'Location and crop parameters are required'
      });
    }

    const params = { crop, location };
    if (query) params.query = query;
    if (temperature) params.temperature = parseFloat(temperature);
    if (humidity) params.humidity = parseFloat(humidity);
    if (condition) params.condition = condition;

    try {
      const headers = {};
      if (process.env.GROQ_API_KEY) {
        headers['X-Groq-Key'] = process.env.GROQ_API_KEY;
      }

      const ragRes = await axios.get(`${RAG_SERVICE_URL}/advisory`, {
        params,
        headers,
        timeout: 30000,
      });

      return res.json({
        ...ragRes.data,
        timestamp: new Date().toISOString(),
        source: 'rag',
      });
    } catch (ragErr) {
      console.error('RAG service unavailable, using fallback:', ragErr.message);

      const fallback = {
        location,
        crop,
        recommendations: [
          `Apply balanced fertilizer (NPK) for ${crop} based on soil test`,
          `Ensure proper irrigation during critical growth stages of ${crop}`,
          'Monitor for common pests and diseases regularly',
          'Practice crop rotation to maintain soil health',
          'Consult local agricultural extension officer for region-specific advice'
        ],
        pestAlerts: [],
        diseaseInfo: [],
        weatherAdvisories: [],
        timestamp: new Date().toISOString(),
        source: 'fallback',
      };

      return res.json(fallback);
    }
  } catch (error) {
    console.error('Advisory error:', error);
    res.status(500).json({ error: 'Failed to fetch advisory' });
  }
});

module.exports = router;
