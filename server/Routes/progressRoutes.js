const express = require('express');
const router = express.Router();
const ProgressController = require('..//controllers/progessController');

// Update user progress for a specific day
router.put('/progress/update', ProgressController.updateProgress);

// Get overall progress for a user
router.get('/progress', ProgressController.getUserProgress);

// Get progress for a specific roadmap
router.get('/progress/:roadmapId', ProgressController.getRoadmapProgress);

module.exports = router;
