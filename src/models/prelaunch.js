const mongoose = require('mongoose');

const prelaunchSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  wishes: {
    type: String,
    required: true
  },
  suggestion: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Prelaunch', prelaunchSchema);