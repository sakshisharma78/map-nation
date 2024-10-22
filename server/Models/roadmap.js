const mongoose = require("mongoose");

const RoadmapSchema = new mongoose.Schema({
  languageName: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  roadmapData: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Roadmap", RoadmapSchema);
