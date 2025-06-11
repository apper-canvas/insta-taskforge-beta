import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { timeEntryService, taskService, projectService } from '@/services';
import LoadingIndicator from '@/components/molecules/LoadingIndicator';
import MessageState from '@/components/molecules/MessageState';
import PageHeader from '@/components/organisms/PageHeader';
import TimeEntryForm from '@/components/organisms/TimeEntryForm';
import StatCard from '@/components/molecules/StatCard';
import Select from '@/components/atoms/Select';
import Label from '@/components/atoms/Label';
import TimeEntryList from '@/components/organisms/TimeEntryList';
import ApperIcon from '@/components/ApperIcon';


const TimePage = () => {
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

  const openCreateModal = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
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
    return <LoadingIndicator count={4} />;
  }

  if (error) {
    return (
      <MessageState
        type="error"
        title="Time Entries Load Error"
        description={error}
        actionLabel="Try Again"
        onAction={loadData}
        icon="AlertCircle"
      />
    );
  }

  if (timeEntries.length === 0 && !loading) {
    return (
      <MessageState
        type="empty"
        title="No time entries found"
        description="Start tracking time on your tasks to monitor progress and productivity"
        actionLabel="Log Time"
        onAction={openCreateModal}
        icon="Clock"
      />
    );
  }

  const summaryCards = [
    {
      title: `Total Time (${selectedPeriod})`,
      value: `${totalHours.toFixed(1)}h`,
      icon: 'Clock',
      color: 'bg-primary'
    },
    {
      title: `Entries (${selectedPeriod})`,
      value: filteredEntries.length,
      icon: 'Calendar',
      color: 'bg-secondary',
      delay: 0.1
    },
    {
      title: 'Avg per Entry',
      value: `${filteredEntries.length > 0 ? (totalHours / filteredEntries.length).toFixed(1) : '0'}h`,
      icon: 'TrendingUp',
      color: 'bg-accent',
      delay: 0.2
    }
  ];

  const periodOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'all', label: 'All Time' },
  ];

  return (
    <div className="space-y-6 max-w-full">
      <PageHeader
        title="Time Tracking"
        description="Monitor time spent on tasks and projects"
        actionLabel="Log Time"
        onAction={openCreateModal}
        actionIcon="Plus"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card, index) => (
          <StatCard key={card.title} {...card} index={index} />
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="period-filter">Period:</Label>
          <Select
            id="period-filter"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            options={periodOptions}
            className="px-3 py-2 text-sm"
          />
        </div>
      </div>

      <TimeEntryList
        entries={filteredEntries}
        onEdit={openEditModal}
        onDelete={handleDeleteEntry}
        getTaskTitle={getTaskTitle}
        getProjectName={getProjectName}
        hasInitialEntries={timeEntries.length > 0}
      />

      <TimeEntryForm
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingEntry ? handleUpdateEntry : handleCreateEntry}
        timeEntry={editingEntry}
        tasks={tasks}
      />
    </div>
  );
};

export default TimePage;