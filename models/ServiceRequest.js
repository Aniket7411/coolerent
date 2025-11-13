const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  acType: {
    type: String,
    required: [true, 'AC type is required'],
    enum: ['Split', 'Window', 'Central']
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true
  },
  images: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Job Completed'],
    default: 'New'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);

