const mongoose = require('mongoose');

const detectionSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    index: true,
  },
  cropType: { type: String, default: '' },
  disease: { type: String, required: true },
  confidence: { type: Number, default: 0 },
  severity: { type: String, default: '' },
  treatment: { type: String, default: '' },
  recommendations: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Detection', detectionSchema);
