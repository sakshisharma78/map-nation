// routes/feedback.js
const express = require('express');
const router = express.Router();
const Feedback = require('../Models/feedback');

// POST endpoint for feedback
router.post('/feedback', async (req, res) => {
  try {
    const { name, subject, feedback } = req.body;
    const newFeedback = new Feedback({ name, subject, feedback });
    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
