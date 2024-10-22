// models/Feedback.js
const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  feedback: { type: String, required: true },
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
