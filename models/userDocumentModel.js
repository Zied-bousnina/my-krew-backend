const mongoose = require('mongoose');

const userDocumentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  documentName: {
    type: String,
    required: true,
  },
  documentUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserDocument = mongoose.model('UserDocument', userDocumentSchema);
module.exports = UserDocument;
