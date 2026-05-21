const mongoose = require('mongoose');

const CredentialSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  count: {
    type: Number,
    default: 1
  },

  firstSeen: {
    type: Date,
    default: Date.now
  },

  lastSeen: {
    type: Date,
    default: Date.now
  },

  sourceIPs: [String],

  pwned: {
    type: Boolean,
    default: false
  }

});

CredentialSchema.index(
  { username: 1, password: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  'Credential',
  CredentialSchema
);