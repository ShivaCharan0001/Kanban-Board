const mongoose = require('mongoose');

const connectDB = async () => {
  // If connection is already open or opening, reuse it
  if (mongoose.connection.readyState >= 1) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
