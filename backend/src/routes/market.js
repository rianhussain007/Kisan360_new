const express = require('express');
const axios = require('axios');
const router = express.Router();

const AGMARKNET_RESOURCE = '9ef84268-d588-465a-a308-a864a43d0070';
const AGMARKNET_BASE = 'https://api.data.gov.in/resource';

// GET /api/market/prices - Live AGMARKNET mandi prices
router.get('/prices', async (req, res) => {
  try {
    const apiKey = process.env.AGMARKNET_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'AGMARKNET API key not configured' });
    }

    const { crop, state, market, search, limit = 50, offset = 0 } = req.query;

    const params = {
      'api-key': apiKey,
      format: 'json',
      limit: Math.min(parseInt(limit) || 50, 1000),
      offset: parseInt(offset) || 0,
    };

    const filters = {};
    if (crop) filters['filters[commodity]'] = crop;
    if (state) filters['filters[state]'] = state;
    if (market) filters['filters[market]'] = market;

    const allParams = { ...params, ...filters };

    const apiRes = await axios.get(`${AGMARKNET_BASE}/${AGMARKNET_RESOURCE}`, {
      params: allParams,
      timeout: 10000,
    });

    let records = apiRes.data.records || [];

    if (search) {
      const q = search.toLowerCase();
      records = records.filter(r =>
        (r.commodity || '').toLowerCase().includes(q) ||
        (r.variety || '').toLowerCase().includes(q) ||
        (r.market || '').toLowerCase().includes(q) ||
        (r.state || '').toLowerCase().includes(q)
      );
    }

    const prices = records.map(r => ({
      crop: r.commodity,
      variety: r.variety,
      grade: r.grade || '',
      minPrice: r.min_price,
      maxPrice: r.max_price,
      modalPrice: r.modal_price,
      market: r.market,
      district: r.district || '',
      state: r.state,
      arrivalDate: r.arrival_date,
    }));

    res.json({
      success: true,
      total: apiRes.data.total || records.length,
      count: prices.length,
      prices,
      source: 'agmarknet_live',
    });
  } catch (error) {
    console.error('Market price error:', error.message);
    if (error.response) {
      console.error('API response:', error.response.status, error.response.data);
    }
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market prices',
    });
  }
});

module.exports = router;
