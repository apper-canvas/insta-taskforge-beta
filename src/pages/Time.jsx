import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { timeEntryService, taskService, projectService } from '../services';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import TimeModal from '../components/TimeModal';

const Time = () => {
  const [timeEntries, setTimeEntries] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [entriesData, tasksData, projectsData] = await Promise.all([
        timeEntryService.getAll(),
        taskService.getAll(),
        projectService.getAll()
      ]);
      setTimeEntries(entriesData);
      setTasks(tasksData);
      setProjects(projectsData);
    } catch (err) {
      setError(err.message || 'Failed to load time entries');
      toast.error('Failed to load time entries');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEntry = async (entryData) => {
    try {
      const newEntry = await timeEntryService.create(entryData);
      setTimeEntries(prev => [newEntry, ...prev]);
      
      // Update task's logged time
      const task = tasks.find(t => t.id === entryData.taskId);
      if (task) {
        const updatedTask = {
          ...task,
          timeLogged: (task.timeLogged || 0) + entryData.duration
        };
        // This would update the task in the task service
        setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
      }
      
      setIsModalOpen(false);
      toast.success('Time entry created successfully');
    } catch (err) {
      toast.error('Failed to create time entry');
    }
  };

  const handleUpdateEntry = async (entryData) => {
    try {
      const oldEntry = editingEntry;
      const updatedEntry = await timeEntryService.update(editingEntry.id, entryData);
      setTimeEntries(prev => prev.map(e => e.id === editingEntry.id ? updatedEntry : e));
      
      // Update task's logged time
      const task = tasks.find(t => t.id === entryData.taskId);
      if (task) {
        const timeDifference = entryData.duration - oldEntry.duration;
        const updatedTask = {
          ...task,
          timeLogged: Math.max(0, (task.timeLogged || 0) + timeDifference)
        };
        setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
      }
      
      setEditingEntry(null);
      setIsModalOpen(false);
      toast.success('Time entry updated successfully');
    } catch (err) {
      toast.error('Failed to update time entry');
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (window.confirm('Are you sure you want to delete this time entry?')) {
      try {
        const entry = timeEntries.find(e => e.id === entryId);
        await timeEntryService.delete(entryId);
        setTimeEntries(prev => prev.filter(e => e.id !== entryId));
        
        // Update task's logged time
        if (entry) {
          const task = tasks.find(t => t.id === entry.taskId);
          if (task) {
            const updatedTask = {
              ...task,
              timeLogged: Math.max(0, (task.timeLogged || 0) - entry.duration)
            };
            setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
          }
        }
        
        toast.success('Time entry deleted successfully');
      } catch (err) {
        toast.error('Failed to delete time entry');
      }
    }
  };

  const openEditModal = (entry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEntry(null);
  };

  const getTaskTitle = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    return task ? task.title : 'Unknown Task';
  };

  const getProjectName = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return 'Unknown Project';
    const project = projects.find(p => p.id === task.projectId);
    return project ? project.name : 'Unknown Project';
  };

  const getFilteredEntries = () => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (selectedPeriod) {
      case 'today':
        return timeEntries.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= startOfToday;
        });
      case 'week':
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
        return timeEntries.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= startOfWeek;
        });
      case 'month':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return timeEntries.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= startOfMonth;
        });
      default:
        return timeEntries;
    }
  };

  const filteredEntries = getFilteredEntries();
  const totalHours = filteredEntries.reduce((sum, entry) => sum + entry.duration, 0);

  if (loading) {
    return <SkeletonLoader count={4} />;
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={loadData}
      />
    );
  }

  if (timeEntries.length === 0) {
    return (
      <EmptyState 
        title="No time entries found"
        description="Start tracking time on your tasks to monitor progress and productivity"
        actionLabel="Log Time"
        onAction={() => setIsModalOpen(true)}
        icon="Clock"
      />
    );
  }

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-surface-900">Time Tracking</h2>
          <p className="text-surface-600 mt-1">Monitor time spent on tasks and projects</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Log Time
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Total Time ({selectedPeriod})</p>
              <p className="text-3xl font-bold text-surface-900 mt-2">{totalHours.toFixed(1)}h</p>
            </div>
            <div className="bg-primary p-3 rounded-lg">
              <ApperIcon name="Clock" className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Entries ({selectedPeriod})</p>
              <p className="text-3xl font-bold text-surface-900 mt-2">{filteredEntries.length}</p>
            </div>
            <div className="bg-secondary p-3 rounded-lg">
              <ApperIcon name="Calendar" className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Avg per Entry</p>
              <p className="text-3xl font-bold text-surface-900 mt-2">
                {filteredEntries.length > 0 ? (totalHours / filteredEntries.length).toFixed(1) : '0'}h
              </p>
            </div>
            <div className="bg-accent p-3 rounded-lg">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-surface-700">Period:</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Time Entries List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border border-surface-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-surface-900 break-words">
                        {getTaskTitle(entry.taskId)}
                      </h3>
                      <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                        {entry.duration}h
                      </span>
                    </div>
                    <p className="text-sm text-surface-600 mb-2">
                      Project: {getProjectName(entry.taskId)}
                    </p>
                    {entry.description && (
                      <p className="text-surface-700 break-words">
                        {entry.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 ml-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openEditModal(entry)}
                      className="p-2 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-lg transition-colors"
                    >
                      <ApperIcon name="Edit2" className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="p-2 text-surface-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-surface-500 pt-4 border-t border-surface-200">
                  <span>Logged on {new Date(entry.date).toLocaleDateString()}</span>
                  <span>Entry ID: {entry.id.slice(-8)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredEntries.length === 0 && timeEntries.length > 0 && (
        <div className="text-center py-8 text-surface-500">
          <ApperIcon name="Filter" className="w-12 h-12 mx-auto mb-2" />
          <p>No time entries match the selected period</p>
        </div>
      )}

      {/* Time Modal */}
      <TimeModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingEntry ? handleUpdateEntry : handleCreateEntry}
        timeEntry={editingEntry}
        tasks={tasks}
      />
    </div>
  );
};

export default Time;