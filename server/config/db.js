
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Replace 'learnmitra' with your desired database name
    const conn = await mongoose.connect('mongodb://localhost:27017/mapnation', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
