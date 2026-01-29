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
    type: Number,
    default: null
  },
  score: {
    type: Number,
    default: null
  },
  personalityFruit: {
    type: String,
    default: null
  },
  personalityGame: {
    type: Boolean,
    default: false
  },
  groupGame: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GameUser', gameUserSchema);