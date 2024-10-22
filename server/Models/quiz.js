const mongoose = require('mongoose');

const learnMitraSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  roadmapDay: {
    type: Number,
    required: true,
  },
  quiz: {
    questions: [
      {
        questionText: String,
        options: [String],
        correctAnswer: String,
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    userAnswers: [
      {
        questionText: String,
        selectedAnswer: String,
        isCorrect: Boolean,
      },
    ],
  },
  progress: {
    percentageCompleted: {
      type: Number,
      default: 0,
    },
    daysCompleted: [Number],
  },
});

const LearnMitra = mongoose.model('LearnMitra', learnMitraSchema);

module.exports = LearnMitra;
