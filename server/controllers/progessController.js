const Progress = require('../Models/progress');

// Function to calculate the percentage of completion
function calculateProgress(progress) {
  const totalDays = progress.totalDays;  // Assuming totalDays is stored in the progress document
  const completedDays = progress.daysCompleted.length;

  if (totalDays === 0) {
    return 0;
  }

  const percentageCompleted = (completedDays / totalDays) * 100;
  return Math.round(percentageCompleted);
}

// Update user progress for a specific day
exports.updateProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ roadmapId: req.body.roadmapId, owner: req.user._id });
    if (!progress) {
      return res.status(404).send({ error: 'Progress not found' });
    }

    // Add the dayId to the daysCompleted array if it's not already there
    if (!progress.daysCompleted.includes(req.body.dayId)) {
      progress.daysCompleted.push(req.body.dayId);
    }

    // Calculate the percentage of completion
    progress.percentageCompleted = calculateProgress(progress);
    await progress.save();

    res.send(progress);
  } catch (error) {
    res.status(500).send({ error: 'An error occurred while updating progress' });
  }
};

// Get overall progress for a user
exports.getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ owner: req.user._id });
    if (!progress.length) {
      return res.status(404).send({ error: 'No progress found for this user' });
    }
    res.send(progress);
  } catch (error) {
    res.status(500).send({ error: 'An error occurred while fetching user progress' });
  }
};

// Get progress for a specific roadmap
exports.getRoadmapProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ roadmapId: req.params.roadmapId, owner: req.user._id });
    if (!progress) {
      return res.status(404).send({ error: 'Progress for this roadmap not found' });
    }
    res.send(progress);
  } catch (error) {
    res.status(500).send({ error: 'An error occurred while fetching roadmap progress' });
  }
};
