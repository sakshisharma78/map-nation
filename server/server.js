const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('./config/db'); // Import the database connection

const userRoutes = require('./Routes/userRoutes.js');
const feedbackRoutes = require('./Routes/feedbackRoutes.js');
const profileRoutes = require('./Routes/profileRoutes.js');
const chatbotRoutes = require('./Routes/chatRoutes.js');
const roadmapRoutes = require('./Routes/roadmapRoutes.js');
const progressRoutes = require('./Routes/progressRoutes.js');
// const {  errorHandler, notFound } = require('./Middleware/authMiddleware'); // Import error handling middleware
const protect = require('./Middleware/authMiddleware');

dotenv.config(); // Load environment variables from .env file

// Initialize express app
const app = express();

// Body parser middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define routes
app.use('/api/users', userRoutes);
app.use('/api/profile', protect, profileRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Error Handling Middleware
// // Handle other errors

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}

// Set the server to listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
