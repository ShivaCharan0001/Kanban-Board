import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragEnterCard,
  onDragOverCard,
  onDragLeaveCard,
  onDropCard,
  isDragging,
  isDragTarget,
  onCardClick
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task._id)}
      onDragEnd={onDragEnd}
      onDragEnter={(e) => onDragEnterCard(e, task._id)}
      onDragOver={onDragOverCard}
      onDragLeave={(e) => onDragLeaveCard(e, task._id)}
      onDrop={(e) => onDropCard(e, task._id, task.category, task.order)}
      onClick={() => onCardClick(task)}
      className={`group relative bg-zinc-900 border border-zinc-800 hover:border-zinc-700/80 rounded-xl p-4 shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing hover:-translate-y-0.5 hover:shadow-lg ${
        isDragging ? 'opacity-40 border-zinc-700 border-dashed bg-zinc-950/20' : ''
      } ${
        isDragTarget ? 'shadow-[0_-4px_0_0_rgba(161,161,170,0.8)] border-t-zinc-600 scale-[0.98]' : ''
      }`}
    >
      <div className="flex flex-col space-y-2">
        {/* Title & Actions */}
        <div className="flex items-start justify-between gap-4">
          <h4 className="font-medium text-zinc-200 line-clamp-2 leading-relaxed">
            {task.title}
          </h4>
          <div className="flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              title="Edit Task"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task._id);
              }}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
              title="Delete Task"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-zinc-400 font-light line-clamp-3 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
