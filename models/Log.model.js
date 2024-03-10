// models/log.js
const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  action: { type: String, required: true },
  details: { type: String },

},{
    timestamps: true,
  });

module.exports = mongoose.model('Log', logSchema);
