const mongoose = require('mongoose');

const ChatbotResponseSchema = new mongoose.Schema({
    prompt: { type: String, required: true },
    response: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const ChatbotResponse = mongoose.model('ChatbotResponse', ChatbotResponseSchema);

module.exports = ChatbotResponse;
