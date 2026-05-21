const mongoose = require('mongoose');

const AttackSchema = new mongoose.Schema({

  ip: String,

  sensor: String,

  port: Number,

  username: String,

  password: String,

  command: String,

  sessionId: String,

  timestamp: {
    type: Date,
    default: Date.now,
  },

  threatScore: {
    type: Number,
    default: 0,
  },

  fingerprint: {
    type: String,
    default: 'bot',
  },

  country: {
    type: String,
    default: 'Unknown',
  },

  city: {
    type: String,
    default: 'Unknown',
  },

  lat: {
    type: Number,
    default: 0,
  },

  lng: {
    type: Number,
    default: 0,
  },

});

module.exports = mongoose.model('Attack', AttackSchema);