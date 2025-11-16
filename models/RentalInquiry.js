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
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    enum: ['Monthly', 'Quarterly', 'Yearly']
  },
  message: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'In-Progress', 'Resolved', 'Rejected'],
    default: 'New'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('RentalInquiry', rentalInquirySchema);

