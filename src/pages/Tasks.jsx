import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ApperIcon from '../components/ApperIcon';
import { taskService, userStoryService, projectService } from '../services';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import TaskModal from '../components/TaskModal';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [userStories, setUserStories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-surface-50' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-50' },
    { id: 'completed', title: 'Completed', color: 'bg-green-50' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, storiesData, projectsData] = await Promise.all([
        taskService.getAll(),
        userStoryService.getAll(),
        projectService.getAll()
      ]);
      setTasks(tasksData);
      setUserStories(storiesData);
      setProjects(projectsData);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
      setIsModalOpen(false);
      toast.success('Task created successfully');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const updatedTask = await taskService.update(editingTask.id, taskData);
      setTasks(prev => prev.map(t => t.id === editingTask.id ? updatedTask : t));
      setEditingTask(null);
      setIsModalOpen(false);
      toast.success('Task updated successfully');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(taskId);
        setTasks(prev => prev.filter(t => t.id !== taskId));
        toast.success('Task deleted successfully');
      } catch (err) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    const task = tasks.find(t => t.id === draggableId);
    if (!task) return;

    try {
      const updatedTask = await taskService.update(task.id, {
        ...task,
        status: destination.droppableId
      });
      
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
      toast.success('Task status updated');
    } catch (err) {
      toast.error('Failed to update task status');
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const getStoryTitle = (storyId) => {
    const story = userStories.find(s => s.id === storyId);
    return story ? story.title : 'Unknown Story';
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-surface-300';
    }
  };

  if (loading) {
    return <SkeletonLoader count={6} />;
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={loadData}
      />
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState 
        title="No tasks found"
        description="Create your first task to start tracking work items"
        actionLabel="Create Task"
        onAction={() => setIsModalOpen(true)}
        icon="CheckSquare"
      />
    );
  }

  const TaskCard = ({ task, index }) => (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg border-l-4 ${getPriorityColor(task.priority)} shadow-sm hover:shadow-md transition-all duration-200 ${
            snapshot.isDragging ? 'shadow-lg scale-105' : ''
          }`}
        >
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-surface-900 break-words flex-1">
                {task.title}
              </h4>
              <div className="flex items-center space-x-1 ml-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => openEditModal(task)}
                  className="p-1 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded transition-colors"
                >
                  <ApperIcon name="Edit2" className="w-3 h-3" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-1 text-surface-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <ApperIcon name="Trash2" className="w-3 h-3" />
                </motion.button>
              </div>
            </div>
            
            {task.description && (
              <p className="text-sm text-surface-600 mb-3 break-words">
                {task.description}
              </p>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-surface-500">Story:</span>
                <span className="text-surface-700 break-words">
                  {getStoryTitle(task.userStoryId)}
                </span>
              </div>
              
              {task.assignee && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-surface-500">Assignee:</span>
                  <span className="text-surface-700">{task.assignee}</span>
                </div>
              )}

              {task.deadline && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-surface-500">Due:</span>
                  <span className="text-surface-700">
                    {new Date(task.deadline).toLocaleDateString()}
                  </span>
                </div>
              )}

              {task.timeLogged > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-surface-500">Time:</span>
                  <span className="text-surface-700">{task.timeLogged}h</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-surface-900">Tasks</h2>
          <p className="text-surface-600 mt-1">Track and manage work items</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <div className="flex items-center space-x-1 bg-surface-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white text-surface-900 shadow-sm'
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <ApperIcon name="Columns" className="w-4 h-4 mr-1 inline" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-surface-900 shadow-sm'
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <ApperIcon name="List" className="w-4 h-4 mr-1 inline" />
              List
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            New Task
          </motion.button>
        </div>
      </div>

      {/* Kanban Board */}
      {viewMode === 'kanban' && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-x-auto">
            {columns.map((column) => {
              const columnTasks = tasks.filter(task => task.status === column.id);
              
              return (
                <div key={column.id} className={`${column.color} rounded-lg p-4 min-h-96`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-surface-900">{column.title}</h3>
                    <span className="bg-surface-200 text-surface-700 text-xs px-2 py-1 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                  
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-3 min-h-80 ${
                          snapshot.isDraggingOver ? 'bg-surface-100 rounded-lg' : ''
                        }`}
                      >
                        <AnimatePresence>
                          {columnTasks.map((task, index) => (
                            <motion.div
                              key={task.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <TaskCard task={task} index={index} />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          <AnimatePresence>
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-lg border-l-4 ${getPriorityColor(task.priority)} shadow-sm hover:shadow-md transition-all duration-200`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-surface-900 break-words">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-surface-600 mt-1 break-words">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openEditModal(task)}
                        className="p-2 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-lg transition-colors"
                      >
                        <ApperIcon name="Edit2" className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 text-surface-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-surface-500">Status:</span>
                      <p className="font-medium text-surface-900 capitalize">
                        {task.status?.replace('-', ' ') || 'To Do'}
                      </p>
                    </div>
                    <div>
                      <span className="text-surface-500">Story:</span>
                      <p className="font-medium text-surface-900 break-words">
                        {getStoryTitle(task.userStoryId)}
                      </p>
                    </div>
                    <div>
                      <span className="text-surface-500">Project:</span>
                      <p className="font-medium text-surface-900 break-words">
                        {getProjectName(task.projectId)}
                      </p>
                    </div>
                    {task.assignee && (
                      <div>
                        <span className="text-surface-500">Assignee:</span>
                        <p className="font-medium text-surface-900">{task.assignee}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-surface-500 pt-4 mt-4 border-t border-surface-200">
                    <span>ID: {task.id.slice(-8)}</span>
                    {task.deadline && (
                      <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                    )}
                    {task.timeLogged > 0 && (
                      <span>Time logged: {task.timeLogged}h</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
        userStories={userStories}
        projects={projects}
      />
    </div>
  );
};

export default Tasks;