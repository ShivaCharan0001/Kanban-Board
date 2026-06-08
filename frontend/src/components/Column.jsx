import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

const Column = ({
  title,
  category,
  tasks,
  onEditTask,
  onDeleteTask,
  onAddTask,
  draggedTaskId,
  setDraggedTaskId,
  onMoveTask,
  onCardClick
}) => {
  const [isDragOverCol, setIsDragOverCol] = useState(false);
  const [targetCardId, setTargetCardId] = useState(null);

  // Column drag handlers
  const handleDragOverCol = (e) => {
    e.preventDefault();
  };

  const handleDragEnterCol = (e) => {
    e.preventDefault();
    // Only highlight if dragging from elsewhere
    setIsDragOverCol(true);
  };

  const handleDragLeaveCol = (e) => {
    e.preventDefault();
    setIsDragOverCol(false);
  };

  const handleDropCol = (e) => {
    e.preventDefault();
    setIsDragOverCol(false);

    if (!draggedTaskId) return;

    // Check if we dropped on a card or the column body
    if (targetCardId) {
      // The drag handlers on the card will manage this, skip here
      setTargetCardId(null);
      return;
    }

    // Dropped on the column body (outside any card) - append to the end of the column
    onMoveTask(draggedTaskId, category, tasks.length);
  };

  // Card-specific drag and drop handlers passed to TaskCard
  const handleDragStartCard = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    // Required for some browsers
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragEndCard = () => {
    setDraggedTaskId(null);
    setTargetCardId(null);
  };

  const handleDragEnterCard = (e, taskId) => {
    e.preventDefault();
    if (draggedTaskId !== taskId) {
      setTargetCardId(taskId);
    }
  };

  const handleDragOverCard = (e) => {
    e.preventDefault();
  };

  const handleDragLeaveCard = (e, taskId) => {
    e.preventDefault();
    if (targetCardId === taskId) {
      setTargetCardId(null);
    }
  };

  const handleDropCard = (e, targetId, targetCategory, targetOrder) => {
    e.preventDefault();
    e.stopPropagation();
    setTargetCardId(null);
    
    if (!draggedTaskId || draggedTaskId === targetId) return;

    // Move the dragged task to the target card's position (inserting it before the target card)
    onMoveTask(draggedTaskId, targetCategory, targetOrder);
  };

  // Define border color highlights based on category for top heading
  const getHeaderHighlight = () => {
    switch (category) {
      case 'Backlog':
        return 'border-zinc-700 bg-zinc-800/40 text-zinc-400';
      case 'To Do':
        return 'border-blue-900/50 bg-blue-950/20 text-blue-400';
      case 'In Progress':
        return 'border-amber-900/50 bg-amber-950/20 text-amber-400';
      case 'Done':
        return 'border-emerald-900/50 bg-emerald-950/20 text-emerald-400';
      default:
        return 'border-zinc-800 bg-zinc-900/20 text-zinc-400';
    }
  };

  return (
    <div
      onDragOver={handleDragOverCol}
      onDragEnter={handleDragEnterCol}
      onDragLeave={handleDragLeaveCol}
      onDrop={handleDropCol}
      className={`flex flex-col w-full min-w-[270px] max-w-[350px] bg-zinc-900/40 border rounded-2xl p-4 min-h-[500px] max-h-[80vh] overflow-y-auto transition-all duration-200 ${
        isDragOverCol ? 'border-zinc-700 bg-zinc-900/60 shadow-inner' : 'border-zinc-800/80'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className={`px-2.5 py-0.5 text-xs font-semibold font-mono rounded-full border ${getHeaderHighlight()}`}>
            {title}
          </span>
          <span className="text-xs text-zinc-500 font-medium">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask(category)}
          className="p-1 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-850 transition-colors"
          title={`Add task to ${title}`}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Task Cards List */}
      <div className="flex-1 space-y-3 min-h-[200px]">
        {tasks.map((task) => (
          <div key={task._id} className="relative">
            <TaskCard
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onDragStart={handleDragStartCard}
              onDragEnd={handleDragEndCard}
              onDragEnterCard={handleDragEnterCard}
              onDragOverCard={handleDragOverCard}
              onDragLeaveCard={handleDragLeaveCard}
              onDropCard={handleDropCard}
              isDragging={draggedTaskId === task._id}
              isDragTarget={targetCardId === task._id && draggedTaskId !== task._id}
              onCardClick={onCardClick}
            />
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 border border-dashed border-zinc-800/80 rounded-xl p-4 text-center">
            <span className="text-xs text-zinc-600 font-light">No tasks here</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;
