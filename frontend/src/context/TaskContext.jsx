import React, { createContext, useState, useContext, useCallback } from 'react';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all tasks for the logged in user
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (res.ok && data.success) {
        // Already sorted by order ascending from the backend
        setTasks(data.tasks);
      } else {
        throw new Error(data.message || 'Failed to fetch tasks');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new task
  const createTask = async (title, description, category) => {
    setError(null);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTasks((prev) => [...prev, data.task]);
        return { success: true };
      } else {
        throw new Error(data.message || 'Failed to create task');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Update task details (title, description, category, and order)
  const updateTask = async (taskId, updates) => {
    setError(null);
    
    // Save current tasks state for rollback if server request fails
    const originalTasks = [...tasks];

    // Optimistic UI updates
    setTasks((prevTasks) => {
      // Find the moving task
      const targetIndex = prevTasks.findIndex((t) => t._id === taskId);
      if (targetIndex === -1) return prevTasks;

      const movingTask = { ...prevTasks[targetIndex], ...updates };
      let newTasks = prevTasks.filter((t) => t._id !== taskId);

      // If we are updating category or order, re-calculate the sorting order
      if (updates.category !== undefined || updates.order !== undefined) {
        const destCategory = updates.category !== undefined ? updates.category : movingTask.category;
        const destOrder = updates.order !== undefined ? updates.order : movingTask.order;

        // Group tasks in target category
        let destTasks = newTasks.filter((t) => t.category === destCategory).sort((a, b) => a.order - b.order);

        // Insert at new order position
        destTasks.splice(destOrder, 0, movingTask);

        // Reassign the sequential order index to everyone in that column
        destTasks = destTasks.map((t, idx) => ({ ...t, order: idx }));

        // Reassemble all other columns
        const otherTasks = newTasks.filter((t) => t.category !== destCategory);
        newTasks = [...otherTasks, ...destTasks];
      } else {
        // Just text modifications (title/description)
        newTasks.push(movingTask);
      }

      return newTasks.sort((a, b) => a.order - b.order);
    });

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update task');
      }
      
      // Sync state with backend's returned task structure (which may have shifted others)
      // A quick fetch guarantees the client's sequential ordering is fully synchronized
      fetchTasks();
      return { success: true };
    } catch (err) {
      // Rollback to original state on failure
      setTasks(originalTasks);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    setError(null);
    const originalTasks = [...tasks];

    // Optimistic UI update
    setTasks((prev) => prev.filter((t) => t._id !== taskId));

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete task');
      }
      // Re-fetch to ensure order sequence is updated correctly
      fetchTasks();
      return { success: true };
    } catch (err) {
      setTasks(originalTasks);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        setTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
