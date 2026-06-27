const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const advisoryRoutes = require('./routes/advisory');
const diseaseRoutes = require('./routes/disease');
const weatherRoutes = require('./routes/weather');
const notificationRoutes = require('./routes/notifications');
const marketRoutes = require('./routes/market');
const farmRoutes = require('./routes/farms');
const detectionRoutes = require('./routes/detections');

// Initialize Firebase Admin SDK
const { initializeFirebase } = require('./config/firebase');
initializeFirebase();

// Connect to MongoDB
const connectDB = require('./config/mongodb');
connectDB().catch(err => console.error('❌ MongoDB connection failed:', err.message));

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Kisan360 Backend is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/advisory', advisoryRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/detections', detectionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Kisan360 Backend server is running on port ${PORT}`);
  console.log(`📊 Health check available at: http://localhost:${PORT}/health`);
});
