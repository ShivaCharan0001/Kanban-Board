const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    category: {
      type: String,
      enum: ['Backlog', 'To Do', 'In Progress', 'Done'],
      default: 'Backlog'
    },
    order: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Task', taskSchema);
