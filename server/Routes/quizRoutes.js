const express = require('express');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const auth = require('../Middleware/authMiddleware'); // Your authentication middleware
const LearnMitra = require('../Models/quiz'); // The combined model

const router = express.Router();

const client = new GoogleGenerativeAI({
  apiKey: "AIzaSyDIwRTkZgCLi4FeaF3R-nscpVsvAGB2UK4",
});

// Generate Quiz and Start a New Day
router.get('/generate/:day', auth, async (req, res) => {
  try {
    const day = req.params.day;
    const userId = req.user._id;

    // Check if the quiz already exists for the day
    let learnMitra = await LearnMitra.findOne({ roadmapDay: day, user: userId });
    if (learnMitra) {
      return res.status(200).json(learnMitra);
    }

    // AI to generate quiz questions
    const response = await client.generateQuiz({
      input: `Generate quiz questions for day ${day}`,
    });

    const questions = response.data.questions.map((question) => ({
      questionText: question.text,
      options: question.options,
      correctAnswer: question.correctAnswer,
    }));

    learnMitra = new LearnMitra({
      user: userId,
      roadmapDay: day,
      quiz: { questions },
    });

    await learnMitra.save();
    res.status(200).json(learnMitra);
  } catch (error) {
    res.status(500).json({ message: 'Error generating quiz', error });
  }
});

// Submit Quiz and Update Progress
router.post('/submit/:day', auth, async (req, res) => {
  try {
    const day = req.params.day;
    const userId = req.user._id;
    const { answers } = req.body;

    const learnMitra = await LearnMitra.findOne({ roadmapDay: day, user: userId });
    if (!learnMitra) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let score = 0;
    const userAnswers = answers.map((answer, index) => {
      const isCorrect = learnMitra.quiz.questions[index].correctAnswer === answer.selectedAnswer;
      if (isCorrect) {
        score += 1;
      }
      return {
        questionText: learnMitra.quiz.questions[index].questionText,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
      };
    });

    learnMitra.quiz.score = score;
    learnMitra.quiz.userAnswers = userAnswers;

    // Update progress
    learnMitra.progress.daysCompleted.push(day);
    learnMitra.progress.percentageCompleted = (learnMitra.progress.daysCompleted.length / day) * 100;

    await learnMitra.save();
    res.status(200).json(learnMitra);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting quiz', error });
  }
});

// Get Progress
router.get('/progress', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const progress = await LearnMitra.find({ user: userId }).select('progress roadmapDay');
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress', error });
  }
});

module.exports = router;
