const Roadmap = require('../Models/roadmap');
const aiService = require('../services/aiService'); // Hypothetical AI service

// Create a new roadmap
exports.createRoadmap = async (req, res) => {
  try {
    const roadmap = new Roadmap({ ...req.body, owner: req.user._id });
    await roadmap.save();
    res.status(201).send(roadmap);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all roadmaps for a user
exports.getUserRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ owner: req.user._id });
    res.send(roadmaps);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get specific roadmap details
exports.getRoadmapById = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ _id: req.params.id, owner: req.user._id });
    if (!roadmap) {
      return res.status(404).send();
    }
    res.send(roadmap);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Generate roadmap image using AI
exports.generateRoadmapImage = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ _id: req.params.id, owner: req.user._id });
    if (!roadmap) {
      return res.status(404).send();
    }

    const image = await aiService.generateImage(roadmap);
    roadmap.image = image;
    await roadmap.save();
    res.send({ roadmap, image });
  } catch (error) {
    res.status(500).send(error);
  }
};
