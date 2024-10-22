const Quiz = require('../Models/quiz');
const aiService = require('../services/aiService'); // Hypothetical AI service

// Generate a quiz for a specific day in the roadmap
exports.generateQuiz = async (req, res) => {
  try {
    const quiz = await aiService.generateQuiz(req.body.topics);
    const newQuiz = new Quiz({ ...quiz, owner: req.user._id });
    await newQuiz.save();
    res.status(201).send(newQuiz);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get quiz for a specific day
exports.getQuizByDay = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.dayId, owner: req.user._id });
    if (!quiz) {
      return res.status(404).send();
    }
    res.send(quiz);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Submit quiz answers and get score
exports.submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.quizId, owner: req.user._id });
    if (!quiz) {
      return res.status(404).send();
    }

    const score = await aiService.evaluateQuiz(req.body.answers, quiz.correctAnswers);
    quiz.score = score;
    await quiz.save();

    res.send({ quiz, score });
  } catch (error) {
    res.status(500).send(error);
  }
};
