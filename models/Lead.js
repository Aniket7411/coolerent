const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
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
  interest: {
    type: String,
    required: [true, 'Interest is required'],
    enum: ['rental', 'service']
  },
  source: {
    type: String,
    required: [true, 'Source is required'],
    enum: ['browse', 'contact']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lead', leadSchema);

