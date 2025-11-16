const mongoose = require('mongoose');

const vendorListingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true
  },
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true
  },
  message: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('VendorListing', vendorListingSchema);

