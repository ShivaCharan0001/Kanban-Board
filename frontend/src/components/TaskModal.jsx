import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSubmit, task = null, initialCategory = 'Backlog' }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Backlog');
  const [error, setError] = useState('');

  // Sync state if editing a task
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setCategory(task.category);
    } else {
      setTitle('');
      setDescription('');
      setCategory(initialCategory);
    }
    setError('');
  }, [task, isOpen, initialCategory]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 overflow-hidden transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-zinc-100 bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent">
            {task ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design Landing Page"
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-700 text-zinc-100 placeholder-zinc-600 transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this task..."
              rows={4}
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-700 text-zinc-100 placeholder-zinc-600 resize-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
              Column
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-700 text-zinc-100 transition-colors cursor-pointer"
            >
              <option value="Backlog">Backlog</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-zinc-950 bg-zinc-100 hover:bg-zinc-200 active:scale-95 rounded-lg transition-all shadow-md font-semibold"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
