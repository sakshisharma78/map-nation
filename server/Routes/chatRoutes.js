const express = require('express');
const router = express.Router();
const run = require('../utils/chatgeminiapi'); // Adjust the path based on your project structure
const ChatbotResponse = require('../Models/chatbot'); // Adjust the path based on your project structure

// Route to generate chatbot response and save it
router.post('/generate-response', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const responseText = await run(prompt);

        // Save the response to the database
        const chatbotResponse = new ChatbotResponse({
            prompt: prompt,
            response: responseText,
        });

        await chatbotResponse.save();

        res.json({ response: responseText });
    } catch (error) {
        console.error("Error generating or saving chatbot response:", error);
        res.status(500).json({ error: 'Failed to generate or save response' });
    }
});

module.exports = router;
