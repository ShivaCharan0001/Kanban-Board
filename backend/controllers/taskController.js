const Task = require('../models/Task');

// @desc    Get all tasks for the logged in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    // Fetch all tasks for the user and sort by order ascending
    const tasks = await Task.find({ user: req.user.id }).sort({ order: 1 });
    res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Default category to 'Backlog' if not provided or invalid
    const targetCategory = ['Backlog', 'To Do', 'In Progress', 'Done'].includes(category)
      ? category
      : 'Backlog';

    // Find the current max order in the target column to place the new task at the end
    const lastTask = await Task.findOne({
      user: req.user.id,
      category: targetCategory
    }).sort({ order: -1 });

    const newOrder = lastTask ? lastTask.order + 1 : 0;

    const task = await Task.create({
      user: req.user.id,
      title,
      description: description || '',
      category: targetCategory,
      order: newOrder
    });

    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a task (supports detail updates and reordering/moving)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { title, description, category, order } = req.body;

    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    // Update simple fields if provided
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;

    // Handle ordering and category changes
    const categoryChanged = category !== undefined && category !== task.category;
    const orderChanged = order !== undefined && order !== task.order;

    if (categoryChanged || orderChanged) {
      const oldCategory = task.category;
      const oldOrder = task.order;
      const newCategory = category !== undefined ? category : oldCategory;
      const newOrder = order !== undefined ? order : oldOrder;

      // Validate target category
      if (!['Backlog', 'To Do', 'In Progress', 'Done'].includes(newCategory)) {
        return res.status(400).json({ message: 'Invalid column category' });
      }

      if (oldCategory === newCategory) {
        // Shifting tasks within the same category
        if (newOrder > oldOrder) {
          // Dragged down/right: decrement items in between
          await Task.updateMany(
            {
              user: req.user.id,
              category: oldCategory,
              order: { $gt: oldOrder, $lte: newOrder }
            },
            { $inc: { order: -1 } }
          );
        } else if (newOrder < oldOrder) {
          // Dragged up/left: increment items in between
          await Task.updateMany(
            {
              user: req.user.id,
              category: oldCategory,
              order: { $gte: newOrder, $lt: oldOrder }
            },
            { $inc: { order: 1 } }
          );
        }
      } else {
        // Shifting tasks across different categories
        // 1. Decrement orders in the source (old) column for tasks after the old index
        await Task.updateMany(
          {
            user: req.user.id,
            category: oldCategory,
            order: { $gt: oldOrder }
          },
          { $inc: { order: -1 } }
        );

        // 2. Increment orders in the destination (new) column for tasks at/after the new index
        await Task.updateMany(
          {
            user: req.user.id,
            category: newCategory,
            order: { $gte: newOrder }
          },
          { $inc: { order: 1 } }
        );
      }

      task.category = newCategory;
      task.order = newOrder;
    }

    const updatedTask = await task.save();
    res.status(200).json({ success: true, task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    const category = task.category;
    const order = task.order;

    // Delete the task
    await Task.deleteOne({ _id: req.params.id });

    // Decrement order of all tasks in the same category that had a higher order index
    await Task.updateMany(
      {
        user: req.user.id,
        category,
        order: { $gt: order }
      },
      { $inc: { order: -1 } }
    );

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
