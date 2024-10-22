const express = require('express');
const run = require('../utils/geminiapi'); // Adjust path as needed
const Roadmap = require('../Models/roadmap'); // Import the Roadmap model

const router = express.Router();

router.post('/generate-roadmap', async (req, res) => {
    const { languageName, duration } = req.body;

    if (!languageName || !duration) {
        return res.status(400).json({ error: 'languageName and duration are required' });
    }

    // Construct the prompt based on user input
    const prompt = `{
        "${languageName}": {
            "Day 1": {
                "Topic": "_____",
                "Description": "___________________",
                "Resources": "(most viewed youtube link for the given topic)",
                "Tasks": "(give 2-3 tasks according to the topic)"
            },
            "Day 2": {
                "Topic": "_____",
                "Description": "_________________"
            },
            ...
        }
    }

    This is the format of giving the response in JSON format.

    When user inputs the Programming language name ${languageName} and duration ${duration} (in days or months).`;

    try {
        const roadmapData = await run(prompt);

        // Parse the AI response if it’s in JSON format
        let parsedRoadmapData;
        try {
            parsedRoadmapData = JSON.parse(roadmapData);
        } catch (error) {
            // Handle the case where the data is not valid JSON
            return res.status(500).json({ error: 'Invalid format of AI response', details: error.message });
        }

        // Save the generated roadmap to the database
        const roadmap = new Roadmap({
            languageName,
            duration,
            roadmapData: parsedRoadmapData
        });

        await roadmap.save();

        res.json({ roadmap });
    } catch (error) {
        console.error('Error generating roadmap:', error);
        res.status(500).json({ error: 'Failed to generate and save roadmap', details: error.message });
    }
});

module.exports = router;
