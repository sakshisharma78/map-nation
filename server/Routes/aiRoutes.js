const express = require('express');
const router = express.Router();
const {
  generateRoadmap,
  createBibTeX,
  generateQuiz,
  evaluateQuiz,
  generateDashboardImage
} = require('../controllers/aiController'); // Ensure correct path
const { protect } = require('../Middleware/authMiddleware'); // Ensure correct path

// Route to generate a roadmap using AI
router.post('/generate-roadmap', protect, generateRoadmap);

// Route to create a BibTeX file based on the roadmap
router.post('/create-bibtex', protect, createBibTeX);

// Route to generate a quiz based on completed resources
router.post('/generate-quiz', protect, generateQuiz);

// Route to evaluate a completed quiz
router.post('/evaluate-quiz', protect, evaluateQuiz);

// Route to generate an image for the dashboard
router.post('/generate-dashboard-image', protect, generateDashboardImage);

module.exports = router;
