const mongoose = require('mongoose');

const gameUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  accessCode: {
    type: String,
    required: true,
    length: 6
  },
  time: {
    type: String,
    default: null
  },
  score: {
    type: String,
    default: null
  },
  personalityFruit: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GameUser', gameUserSchema);