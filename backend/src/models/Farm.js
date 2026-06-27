const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    index: true,
  },
  name: { type: String, required: true, trim: true },
  location: { type: String, default: '' },
  area: { type: Number, default: 0 },
  unit: { type: String, enum: ['acres', 'hectares', 'bigha'], default: 'acres' },
  soilType: { type: String, default: 'loam' },
  crops: [{ type: String }],
  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Farm', farmSchema);
