import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { taskService, userStoryService, projectService } from '@/services';
import LoadingIndicator from '@/components/molecules/LoadingIndicator';
import MessageState from '@/components/molecules/MessageState';
import PageHeader from '@/components/organisms/PageHeader';
import TaskForm from '@/components/organisms/TaskForm';
import KanbanBoard from '@/components/organisms/KanbanBoard';
import TaskList from '@/components/organisms/TaskList';
import ViewModeToggle from '@/components/molecules/ViewModeToggle';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';


const TasksPage = () => {
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

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
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
    return <LoadingIndicator count={6} />;
  }

  if (error) {
    return (
      <MessageState
        type="error"
        title="Tasks Load Error"
        description={error}
        actionLabel="Try Again"
        onAction={loadData}
        icon="AlertCircle"
      />
    );
  }

  if (tasks.length === 0 && !loading) {
    return (
      <MessageState
        type="empty"
        title="No tasks found"
        description="Create your first task to start tracking work items"
        actionLabel="Create Task"
        onAction={openCreateModal}
        icon="CheckSquare"
      />
    );
  }

  return (
    <div className="space-y-6 max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Tasks"
          description="Track and manage work items"
          actionLabel="" // Handled by separate button below
          actionIcon=""
        />
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
          <Button
            onClick={openCreateModal}
            className="bg-primary text-white hover:bg-primary/90"
            icon={ApperIcon.bind(null, { name: 'Plus' })}
          >
            New Task
          </Button>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <KanbanBoard
          columns={columns}
          tasks={tasks}
          onDragEnd={handleDragEnd}
          onEditTask={openEditModal}
          onDeleteTask={handleDeleteTask}
          getStoryTitle={getStoryTitle}
          getPriorityColor={getPriorityColor}
        />
      ) : (
        <TaskList
          tasks={tasks}
          onEditTask={openEditModal}
          onDeleteTask={handleDeleteTask}
          getStoryTitle={getStoryTitle}
          getProjectName={getProjectName}
          getPriorityColor={getPriorityColor}
        />
      )}

      <TaskForm
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

export default TasksPage;