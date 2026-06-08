import React from 'react';
import { X, Calendar } from 'lucide-react';

const TaskViewModal = ({ isOpen, onClose, task }) => {
  if (!isOpen || !task) return null;

  const formattedDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 overflow-hidden transform transition-all duration-300 scale-100 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3 shrink-0">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-0.5 text-xs font-semibold font-mono rounded-full border border-zinc-700 bg-zinc-800/40 text-zinc-400">
              {task.category}
            </span>
            {formattedDate && (
              <span className="flex items-center text-xs text-zinc-500 space-x-1">
                <Calendar size={12} />
                <span>{formattedDate}</span>
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 my-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          <h3 className="text-xl font-semibold text-zinc-100 leading-relaxed">
            {task.title}
          </h3>

          <div className="space-y-1.5">
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Description
            </h4>
            <p className="text-sm text-zinc-300 font-light leading-relaxed whitespace-pre-wrap">
              {task.description || (
                <span className="text-zinc-600 italic">No description provided.</span>
              )}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-zinc-800/60 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-zinc-950 bg-zinc-100 hover:bg-zinc-200 active:scale-95 rounded-lg transition-all shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskViewModal;
