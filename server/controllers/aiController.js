// controllers/aiController.js

const AIService = require('../services/aiService'); // Adjust path if needed

// Controller to generate a roadmap
exports.generateRoadmap = async (req, res) => {
  try {
    const { duration, dailyLearningTime, topics, level } = req.body;
    const roadmap = await AIService.generateRoadmap({ duration, dailyLearningTime, topics, level });
    res.json({ roadmap });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to create a BibTeX file
exports.createBibTeX = async (req, res) => {
  try {
    // Logic to create BibTeX
    res.json({ bibtex: 'Your BibTeX content here' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to generate a quiz
exports.generateQuiz = async (req, res) => {
  try {
    // Logic to generate quiz
    res.json({ quiz: 'Your quiz content here' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to evaluate a quiz
exports.evaluateQuiz = async (req, res) => {
  try {
    // Logic to evaluate quiz
    res.json({ evaluation: 'Your evaluation result here' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to generate a dashboard image
exports.generateDashboardImage = async (req, res) => {
  try {
    // Logic to generate dashboard image
    res.json({ image: 'Your image URL here' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
