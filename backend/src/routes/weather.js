const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE = 'https://api.openweathermap.org/data/2.5';

// GET /api/weather - Get weather data for agricultural planning
router.get('/', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        error: 'Latitude and longitude are required'
      });
    }

    if (!API_KEY) {
      return res.status(500).json({ error: 'OpenWeather API key not configured' });
    }

    const [currentRes, forecastRes] = await Promise.all([
      axios.get(`${BASE}/weather`, {
        params: { lat: latitude, lon: longitude, appid: API_KEY, units: 'metric' },
        timeout: 5000,
      }),
      axios.get(`${BASE}/forecast`, {
        params: { lat: latitude, lon: longitude, appid: API_KEY, units: 'metric', cnt: 8 },
        timeout: 5000,
      }),
    ]);

    const c = currentRes.data;
    const f = forecastRes.data;

    const dailyForecast = [];
    const seen = new Set();
    for (const item of f.list) {
      const date = item.dt_txt.split(' ')[0];
      if (!seen.has(date)) {
        seen.add(date);
        dailyForecast.push({
          date: new Date(item.dt * 1000).toISOString(),
          temperature: { min: item.main.temp_min, max: item.main.temp_max },
          precipitation: (item.pop || 0) * 100,
          condition: item.weather[0].main,
          description: item.weather[0].description,
        });
      }
    }

    const temp = c.main.temp;
    const advice = [];
    if (temp > 35) advice.push('High temperature stress — ensure adequate irrigation');
    else if (temp > 30) advice.push('Warm conditions — monitor soil moisture');
    else if (temp < 10) advice.push('Cold conditions — protect sensitive crops');
    else advice.push('Temperatures favorable for crop growth');

    if (c.main.humidity > 80) advice.push('High humidity — watch for fungal diseases');
    else if (c.main.humidity < 30) advice.push('Low humidity — increase irrigation frequency');

    if (c.rain?.['1h'] || c.rain?.['3h']) advice.push('Rain expected — delay fertilizer application');
    else if (dailyForecast.some(d => d.precipitation > 50)) advice.push('Rain in forecast — plan planting accordingly');

    const weatherData = {
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        name: c.name,
      },
      current: {
        temperature: Math.round(temp),
        feelsLike: Math.round(c.main.feels_like),
        humidity: c.main.humidity,
        precipitation: c.rain?.['1h'] || c.rain?.['3h'] || 0,
        windSpeed: Math.round(c.wind.speed * 3.6),
        condition: c.weather[0].main,
        description: c.weather[0].description,
        icon: c.weather[0].icon,
      },
      forecast: dailyForecast.slice(0, 5),
      agriculturalAdvice: advice,
      timestamp: new Date().toISOString(),
    };

    res.json(weatherData);
  } catch (error) {
    if (error.response?.status === 401) {
      return res.status(500).json({ error: 'Invalid OpenWeather API key' });
    }
    console.error('Weather error:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

module.exports = router;
