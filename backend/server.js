require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// CORS middleware setup (permits credentials transfer via httpOnly cookies)
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Built-in body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cookie parser for reading httpOnly auth cookies
app.use(cookieParser());

// Route mountings
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Simple status route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Kanban Board API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Only listen when run directly, not in Vercel serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
