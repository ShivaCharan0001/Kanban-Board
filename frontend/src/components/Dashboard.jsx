import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { LogOut, LayoutGrid, Plus } from 'lucide-react';
import Column from './Column';
import TaskModal from './TaskModal';
import TaskViewModal from './TaskViewModal';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { tasks, fetchTasks, createTask, updateTask, deleteTask } = useTasks();

  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalInitialCategory, setModalInitialCategory] = useState('Backlog');
  
  // States for read-only card view modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [taskToView, setTaskToView] = useState(null);

  // Load user tasks on dashboard load
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const columns = [
    { title: 'Backlog', category: 'Backlog' },
    { title: 'To Do', category: 'To Do' },
    { title: 'In Progress', category: 'In Progress' },
    { title: 'Done', category: 'Done' }
  ];

  // Open modal for task creation
  const handleOpenAddTask = (category = 'Backlog') => {
    setSelectedTask(null);
    setModalInitialCategory(category);
    setIsModalOpen(true);
  };

  // Open modal for task editing
  const handleOpenEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Create or Update task handler from modal
  const handleModalSubmit = async (formData) => {
    if (selectedTask) {
      await updateTask(selectedTask._id, formData);
    } else {
      await createTask(formData.title, formData.description, formData.category);
    }
  };

  // Handle Drag & Drop move/reorder task action
  const handleMoveTask = async (taskId, targetCategory, targetOrder) => {
    const taskToMove = tasks.find((t) => t._id === taskId);
    if (!taskToMove) return;

    // Clear dragging state immediately to restore card opacity on drop
    setDraggedTaskId(null);

    // Check if anything actually changed
    if (taskToMove.category === targetCategory && taskToMove.order === targetOrder) {
      return;
    }

    // Call context to perform optimistic state updates and api operations
    await updateTask(taskId, { category: targetCategory, order: targetOrder });
  };

  // Open read-only view modal
  const handleCardClick = (task) => {
    setTaskToView(task);
    setIsViewModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Global Navbar */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg">
              <LayoutGrid size={20} className="text-zinc-300" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent tracking-wide">
              Kanban Board
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-zinc-500 font-light">Authenticated as</p>
              <p className="text-sm font-medium text-zinc-200">{user?.name}</p>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700/80 bg-zinc-900/40 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-all text-sm font-medium"
              title="Sign Out"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 flex flex-col space-y-6">
        {/* Workspace Title & Add Option */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-100">My Workspace</h2>
            <p className="text-sm text-zinc-400 font-light mt-0.5">
              Drag, drop, and organize your tasks in real time
            </p>
          </div>

          <button
            onClick={() => handleOpenAddTask('Backlog')}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-zinc-100 text-zinc-950 hover:bg-zinc-200 active:scale-[0.98] rounded-xl text-sm font-semibold transition-all shadow-md self-start sm:self-auto"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Create Task</span>
          </button>
        </div>

        {/* Board Columns Grid */}
        <div className="flex-1 flex gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          {columns.map((col) => {
            // Filter tasks for this column and sort them by order
            const columnTasks = tasks
              .filter((task) => task.category === col.category)
              .sort((a, b) => a.order - b.order);

            return (
              <Column
                key={col.category}
                title={col.title}
                category={col.category}
                tasks={columnTasks}
                onEditTask={handleOpenEditTask}
                onDeleteTask={deleteTask}
                onAddTask={handleOpenAddTask}
                draggedTaskId={draggedTaskId}
                setDraggedTaskId={setDraggedTaskId}
                onMoveTask={handleMoveTask}
                onCardClick={handleCardClick}
              />
            );
          })}
        </div>
      </main>

      {/* Task Creation & Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        task={selectedTask}
        initialCategory={modalInitialCategory}
      />

      {/* Task Read-Only Details View Modal */}
      <TaskViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        task={taskToView}
      />
    </div>
  );
};

export default Dashboard;
