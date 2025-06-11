import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { projectService, userStoryService, taskService } from '../services';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import Chart from 'react-apexcharts';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [userStories, setUserStories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [projectsData, storiesData, tasksData] = await Promise.all([
          projectService.getAll(),
          userStoryService.getAll(),
          taskService.getAll()
        ]);
        setProjects(projectsData);
        setUserStories(storiesData);
        setTasks(tasksData);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading) {
    return <SkeletonLoader count={6} />;
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalStories = userStories.length;
  const completedStories = userStories.filter(s => s.status === 'completed').length;

  const taskStatusData = {
    series: [
      tasks.filter(t => t.status === 'todo').length,
      tasks.filter(t => t.status === 'in-progress').length,
      tasks.filter(t => t.status === 'completed').length
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

  const projectProgressData = {
    series: [{
      name: 'Progress',
      data: projects.map(p => {
        const projectTasks = tasks.filter(t => t.projectId === p.id);
        const completed = projectTasks.filter(t => t.status === 'completed').length;
        return projectTasks.length > 0 ? Math.round((completed / projectTasks.length) * 100) : 0;
      })
    }],
    options: {
      chart: { type: 'bar' },
      xaxis: {
        categories: projects.map(p => p.name)
      },
      colors: ['#4F46E5'],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
        }
      },
      yaxis: {
        title: { text: 'Progress (%)' }
      }
    }
  };

  const statCards = [
    {
      title: 'Active Projects',
      value: activeProjects,
      icon: 'FolderOpen',
      color: 'bg-primary',
      change: '+12%'
    },
    {
      title: 'Total Stories',
      value: totalStories,
      icon: 'BookOpen',
      color: 'bg-secondary',
      change: '+8%'
    },
    {
      title: 'Completed Tasks',
      value: completedTasks,
      icon: 'CheckCircle',
      color: 'bg-accent',
      change: '+15%'
    },
    {
      title: 'Story Completion',
      value: `${totalStories > 0 ? Math.round((completedStories / totalStories) * 100) : 0}%`,
      icon: 'TrendingUp',
      color: 'bg-blue-500',
      change: '+5%'
    }
  ];

  return (
    <div className="space-y-6 max-w-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-surface-200 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-600">{stat.title}</p>
                <p className="text-3xl font-bold text-surface-900 mt-2">{stat.value}</p>
                <p className="text-sm text-accent mt-1">{stat.change} from last month</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <ApperIcon name={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Task Distribution</h3>
          {tasks.length > 0 ? (
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

        {/* Project Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Project Progress</h3>
          {projects.length > 0 ? (
            <Chart
              options={projectProgressData.options}
              series={projectProgressData.series}
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

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
      >
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Recent Projects</h3>
        {projects.length > 0 ? (
          <div className="space-y-4">
            {projects.slice(0, 5).map((project) => {
              const projectTasks = tasks.filter(t => t.projectId === project.id);
              const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
              const progress = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;
              
              return (
                <div key={project.id} className="flex items-center justify-between p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ApperIcon name="FolderOpen" className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-surface-900">{project.name}</h4>
                      <p className="text-sm text-surface-600 break-words">{project.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-surface-900">{Math.round(progress)}%</div>
                      <div className="text-xs text-surface-500">{completedTasks}/{projectTasks.length} tasks</div>
                    </div>
                    <div className="w-16 h-2 bg-surface-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-surface-500">
            <ApperIcon name="FolderOpen" className="w-12 h-12 mx-auto mb-2" />
            <p>No projects available</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;