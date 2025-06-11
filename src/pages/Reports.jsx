import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Chart from 'react-apexcharts';
import ApperIcon from '../components/ApperIcon';
import { projectService, userStoryService, taskService, timeEntryService } from '../services';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';

const Reports = () => {
  const [projects, setProjects] = useState([]);
  const [userStories, setUserStories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [timeEntries, setTimeEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState('all');

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectsData, storiesData, tasksData, timeData] = await Promise.all([
        projectService.getAll(),
        userStoryService.getAll(),
        taskService.getAll(),
        timeEntryService.getAll()
      ]);
      setProjects(projectsData);
      setUserStories(storiesData);
      setTasks(tasksData);
      setTimeEntries(timeData);
    } catch (err) {
      setError(err.message || 'Failed to load report data');
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <SkeletonLoader count={6} />;
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={loadReportData}
      />
    );
  }

  const filteredTasks = selectedProject === 'all' 
    ? tasks 
    : tasks.filter(task => task.projectId === selectedProject);

  const filteredStories = selectedProject === 'all' 
    ? userStories 
    : userStories.filter(story => story.projectId === selectedProject);

  const filteredTimeEntries = selectedProject === 'all'
    ? timeEntries
    : timeEntries.filter(entry => {
        const task = tasks.find(t => t.id === entry.taskId);
        return task && task.projectId === selectedProject;
      });

  // Task Status Distribution
  const taskStatusData = {
    series: [
      filteredTasks.filter(t => t.status === 'todo').length,
      filteredTasks.filter(t => t.status === 'in-progress').length,
      filteredTasks.filter(t => t.status === 'completed').length
    ],
    options: {
      chart: { type: 'donut' },
      labels: ['To Do', 'In Progress', 'Completed'],
      colors: ['#F59E0B', '#4F46E5', '#10B981'],
      legend: { position: 'bottom' },
      plotOptions: {
        pie: {
          donut: {
            size: '65%'
          }
        }
      }
    }
  };

  // Story Priority Distribution
  const storyPriorityData = {
    series: [
      filteredStories.filter(s => s.priority === 'high').length,
      filteredStories.filter(s => s.priority === 'medium').length,
      filteredStories.filter(s => s.priority === 'low').length
    ],
    options: {
      chart: { type: 'pie' },
      labels: ['High Priority', 'Medium Priority', 'Low Priority'],
      colors: ['#EF4444', '#F59E0B', '#10B981'],
      legend: { position: 'bottom' }
    }
  };

  // Time Distribution by Project
  const projectTimeData = {
    series: [{
      name: 'Hours Logged',
      data: projects.map(project => {
        const projectTasks = tasks.filter(t => t.projectId === project.id);
        const projectTimeEntries = timeEntries.filter(entry => 
          projectTasks.some(task => task.id === entry.taskId)
        );
        return projectTimeEntries.reduce((sum, entry) => sum + entry.duration, 0);
      })
    }],
    options: {
      chart: { type: 'bar' },
      xaxis: {
        categories: projects.map(p => p.name)
      },
      colors: ['#7C3AED'],
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: '55%',
        }
      },
      yaxis: {
        title: { text: 'Hours' }
      }
    }
  };

  // Weekly Time Trend
  const getWeeklyTimeData = () => {
    const weeklyData = {};
    const last7Days = Array.from({length: 7}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    last7Days.forEach(date => {
      weeklyData[date] = 0;
    });

    filteredTimeEntries.forEach(entry => {
      const entryDate = new Date(entry.date).toISOString().split('T')[0];
      if (weeklyData.hasOwnProperty(entryDate)) {
        weeklyData[entryDate] += entry.duration;
      }
    });

    return {
      series: [{
        name: 'Hours',
        data: Object.values(weeklyData)
      }],
      options: {
        chart: { type: 'line' },
        xaxis: {
          categories: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' }))
        },
        colors: ['#4F46E5'],
        stroke: {
          curve: 'smooth',
          width: 3
        },
        markers: {
          size: 5
        }
      }
    };
  };

  const weeklyTimeData = getWeeklyTimeData();

  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(t => t.status === 'completed').length;
  const totalStories = filteredStories.length;
  const completedStories = filteredStories.filter(s => s.status === 'completed').length;
  const totalHours = filteredTimeEntries.reduce((sum, entry) => sum + entry.duration, 0);

  const reportCards = [
    {
      title: 'Task Completion Rate',
      value: `${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%`,
      subtitle: `${completedTasks}/${totalTasks} tasks completed`,
      icon: 'CheckCircle',
      color: 'bg-accent'
    },
    {
      title: 'Story Completion Rate',
      value: `${totalStories > 0 ? Math.round((completedStories / totalStories) * 100) : 0}%`,
      subtitle: `${completedStories}/${totalStories} stories completed`,
      icon: 'BookOpen',
      color: 'bg-primary'
    },
    {
      title: 'Total Time Logged',
      value: `${totalHours.toFixed(1)}h`,
      subtitle: `Across ${filteredTimeEntries.length} entries`,
      icon: 'Clock',
      color: 'bg-secondary'
    },
    {
      title: 'Average Task Time',
      value: `${completedTasks > 0 ? (totalHours / completedTasks).toFixed(1) : '0'}h`,
      subtitle: 'Per completed task',
      icon: 'TrendingUp',
      color: 'bg-blue-500'
    }
  ];

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-surface-900">Reports & Analytics</h2>
          <p className="text-surface-600 mt-1">Track project progress and team productivity</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-4 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-600">{card.title}</p>
                <p className="text-3xl font-bold text-surface-900 mt-2">{card.value}</p>
                <p className="text-sm text-surface-500 mt-1 break-words">{card.subtitle}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg flex-shrink-0`}>
                <ApperIcon name={card.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Task Status Distribution</h3>
          {filteredTasks.length > 0 ? (
            <Chart
              options={taskStatusData.options}
              series={taskStatusData.series}
              type="donut"
              height={300}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-surface-500">
              <div className="text-center">
                <ApperIcon name="PieChart" className="w-12 h-12 mx-auto mb-2" />
                <p>No task data available</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Story Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Story Priority Distribution</h3>
          {filteredStories.length > 0 ? (
            <Chart
              options={storyPriorityData.options}
              series={storyPriorityData.series}
              type="pie"
              height={300}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-surface-500">
              <div className="text-center">
                <ApperIcon name="PieChart" className="w-12 h-12 mx-auto mb-2" />
                <p>No story data available</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Weekly Time Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Weekly Time Trend</h3>
          <Chart
            options={weeklyTimeData.options}
            series={weeklyTimeData.series}
            type="line"
            height={300}
          />
        </motion.div>

        {/* Time by Project */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Time by Project</h3>
          {projects.length > 0 ? (
            <Chart
              options={projectTimeData.options}
              series={projectTimeData.series}
              type="bar"
              height={300}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-surface-500">
              <div className="text-center">
                <ApperIcon name="BarChart3" className="w-12 h-12 mx-auto mb-2" />
                <p>No project data available</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Project Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
      >
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Project Performance</h3>
        {projects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-surface-500 uppercase bg-surface-50">
                <tr>
                  <th className="px-6 py-3">Project</th>
                  <th className="px-6 py-3">Tasks</th>
                  <th className="px-6 py-3">Stories</th>
                  <th className="px-6 py-3">Time Logged</th>
                  <th className="px-6 py-3">Progress</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => {
                  const projectTasks = tasks.filter(t => t.projectId === project.id);
                  const projectStories = userStories.filter(s => s.projectId === project.id);
                  const projectTimeEntries = timeEntries.filter(entry => 
                    projectTasks.some(task => task.id === entry.taskId)
                  );
                  const completedProjectTasks = projectTasks.filter(t => t.status === 'completed');
                  const progress = projectTasks.length > 0 ? 
                    Math.round((completedProjectTasks.length / projectTasks.length) * 100) : 0;
                  const totalTime = projectTimeEntries.reduce((sum, entry) => sum + entry.duration, 0);

                  return (
                    <tr key={project.id} className="bg-white border-b border-surface-200 hover:bg-surface-50">
                      <td className="px-6 py-4 font-medium text-surface-900 break-words">
                        {project.name}
                      </td>
                      <td className="px-6 py-4">
                        {completedProjectTasks.length}/{projectTasks.length}
                      </td>
                      <td className="px-6 py-4">
                        {projectStories.length}
                      </td>
                      <td className="px-6 py-4">
                        {totalTime.toFixed(1)}h
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-2 bg-surface-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{progress}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-surface-500">
            <ApperIcon name="Table" className="w-12 h-12 mx-auto mb-2" />
            <p>No project data available</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Reports;