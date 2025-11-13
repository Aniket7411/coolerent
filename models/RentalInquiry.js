const mongoose = require('mongoose');

const rentalInquirySchema = new mongoose.Schema({
  acId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AC',
    required: [true, 'AC ID is required']
  },
  acDetails: {
    id: {
      type: String,
      required: true
    },
    brand: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
    },
    capacity: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    price: {
      monthly: {
        type: Number,
        required: true
      },
      quarterly: {
        type: Number,
        required: true
      },
      yearly: {
        type: Number,
        required: true
      }
    }
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Contacted', 'Completed', 'Cancelled'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('RentalInquiry', rentalInquirySchema);

