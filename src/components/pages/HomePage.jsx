import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, parseISO } from 'date-fns';
import { projectService, taskService, userStoryService, timeEntryService, userService } from '@/services';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/molecules/Card';
import StatCard from '@/components/molecules/StatCard';
import ChartWrapper from '@/components/molecules/ChartWrapper';
import ProgressBar from '@/components/molecules/ProgressBar';
import LoadingIndicator from '@/components/molecules/LoadingIndicator';
import MessageState from '@/components/molecules/MessageState';
import Button from '@/components/atoms/Button';

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    projects: [],
    tasks: [],
    userStories: [],
    timeEntries: [],
    users: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projects, tasks, userStories, timeEntries, users] = await Promise.all([
        projectService.getAll(),
        taskService.getAll(),
        userStoryService.getAll(),
        timeEntryService.getAll(),
        userService.getAll()
      ]);

      setDashboardData({
        projects: projects || [],
        tasks: tasks || [],
        userStories: userStories || [],
        timeEntries: timeEntries || [],
        users: users || []
      });
    } catch (err) {
      console.error('Dashboard load error:', err);
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

// Calculate statistics with enhanced metrics
  const getStats = () => {
    const { projects, tasks, userStories, timeEntries, users } = dashboardData;
    
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const activeTasks = tasks.filter(t => t.status !== 'completed').length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalStories = userStories.length;
    const activeUsers = users.filter(u => u.status === 'active').length;

    // Calculate this week's time entries
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    
    const thisWeekEntries = timeEntries.filter(entry => {
      try {
        const entryDate = parseISO(entry.date);
        return entryDate >= weekStart && entryDate <= weekEnd;
      } catch {
        return false;
      }
    });
    
    const thisWeekHours = thisWeekEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);

    return [
      { 
        title: 'Total Projects', 
        value: projects.length, 
        icon: 'FolderOpen', 
        color: 'text-blue-600', 
        change: activeProjects > 0 ? `${activeProjects} active` : 'No active projects'
      },
      { 
        title: 'Active Tasks', 
        value: activeTasks, 
        icon: 'CheckSquare', 
        color: 'text-green-600', 
        change: `${completedTasks} completed`
      },
      { 
        title: 'Team Members', 
        value: activeUsers, 
        icon: 'Users', 
        color: 'text-purple-600', 
        change: userStories.filter(s => s.status === 'in-progress').length + ' stories in progress'
      },
      { 
        title: 'This Week', 
        value: Math.round(thisWeekHours) + 'h', 
        icon: 'Clock', 
        color: 'text-yellow-600', 
        change: `${thisWeekEntries.length} time entries`
      }
    ];
  };

  // Task distribution for chart
  const getTaskDistribution = () => {
    const { tasks } = dashboardData;
    const todoTasks = tasks.filter(t => t.status === 'todo').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;

    return {
      series: [completedTasks, inProgressTasks, todoTasks],
      options: {
        chart: {
          type: 'donut',
          height: 350
        },
        labels: ['Completed', 'In Progress', 'To Do'],
        colors: ['#10B981', '#3B82F6', '#F59E0B'],
        legend: {
          position: 'bottom'
        },
        plotOptions: {
          pie: {
            donut: {
              size: '65%'
            }
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 300
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      }
    };
  };

  // Project progress chart
  const getProjectProgress = () => {
    const { projects, tasks } = dashboardData;
    
    const projectsWithProgress = projects.slice(0, 6).map(project => {
      const projectTasks = tasks.filter(t => parseInt(t.project_id) === parseInt(project.Id));
      const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
      const progress = projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0;
      
      return {
        name: project.Name || 'Unnamed Project',
        progress
      };
    });

    return {
      series: [{
        name: 'Progress %',
        data: projectsWithProgress.map(p => p.progress)
      }],
      options: {
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            show: false
          }
        },
        xaxis: {
          categories: projectsWithProgress.map(p => p.name.length > 10 ? p.name.substring(0, 10) + '...' : p.name)
        },
        colors: ['#4F46E5'],
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: false,
          }
        },
        dataLabels: {
          enabled: false
        },
        yaxis: {
          max: 100
}
      }
    };
  };

  // Weekly timesheet data
  const getWeeklyTimesheet = () => {
    const { timeEntries } = dashboardData;
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekDays = eachDayOfInterval({ start: weekStart, end: endOfWeek(now) });
    
    const dailyHours = weekDays.map(day => {
      const dayEntries = timeEntries.filter(entry => {
        try {
          const entryDate = parseISO(entry.date);
          return format(entryDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
        } catch {
          return false;
        }
      });
      
      return {
        day: format(day, 'EEE'),
hours: dayEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0)
      };
    });

    return {
      series: [{
        name: 'Hours Logged',
        data: dailyHours.map(d => Math.round(d.hours * 10) / 10)
      }],
      options: {
        chart: {
          type: 'column',
          height: 300,
          toolbar: { show: false }
        },
        xaxis: {
          categories: dailyHours.map(d => d.day)
        },
        colors: ['#8B5CF6'],
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: '60%'
          }
        },
        dataLabels: { enabled: false },
        grid: { strokeDashArray: 3 }
      }
    };
  };

  // Team performance metrics
  const getTeamPerformance = () => {
    const { users, timeEntries, tasks } = dashboardData;
    
    return users.slice(0, 6).map(user => {
      const userTimeEntries = timeEntries.filter(entry => parseInt(entry.user_id) === user.Id);
      const userTasks = tasks.filter(task => task.assignee === user.Name || parseInt(task.Owner) === user.Id);
      const completedTasks = userTasks.filter(task => task.status === 'completed').length;
      const totalHours = userTimeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
      
      return {
        ...user,
        hoursLogged: Math.round(totalHours * 10) / 10,
        tasksCompleted: completedTasks,
        activeTasks: userTasks.filter(task => task.status !== 'completed').length
      };
    });
  };

  // Project time allocation
  const getProjectTimeAllocation = () => {
    const { projects, timeEntries, tasks } = dashboardData;
    
    const projectHours = projects.slice(0, 6).map(project => {
      const projectTasks = tasks.filter(t => parseInt(t.project_id) === parseInt(project.Id));
      const projectTime = timeEntries.filter(entry => 
        projectTasks.some(task => parseInt(task.Id) === parseInt(entry.task_id))
      ).reduce((sum, entry) => sum + (entry.duration || 0), 0);
      
      return {
        name: project.Name?.substring(0, 12) + (project.Name?.length > 12 ? '...' : '') || 'Unnamed',
        hours: Math.round(projectTime * 10) / 10
      };
    }).filter(p => p.hours > 0);

    return {
      series: projectHours.map(p => p.hours),
      options: {
        chart: { type: 'pie', height: 300 },
        labels: projectHours.map(p => p.name),
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'],
        legend: { position: 'bottom' },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: { width: 280 },
            legend: { position: 'bottom' }
          }
        }]
      }
    };
  };

  // Recent projects with progress
  const getRecentProjects = () => {
    const { projects, tasks } = dashboardData;
    
    return projects.slice(0, 5).map(project => {
      const projectTasks = tasks.filter(t => parseInt(t.project_id) === parseInt(project.Id));
      const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
      const progress = projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0;
      
      return {
        id: project.Id,
        name: project.Name || 'Unnamed Project',
        description: project.description || 'No description available',
        progress,
        tasks: {
          completed: completedTasks,
          total: projectTasks.length
        },
        status: project.status || 'active'
      };
});
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'new-project':
        navigate('/projects');
        break;
      case 'add-task':
        navigate('/tasks');
        break;
      case 'track-time':
        navigate('/time');
        break;
      case 'view-reports':
        navigate('/reports');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return <LoadingIndicator count={8} />;
  }

  if (error) {
    return (
      <MessageState
        type="error"
        title="Dashboard Load Error"
        description={error}
        actionLabel="Try Again"
        onAction={loadDashboardData}
        icon="AlertCircle"
      />
    );
}

  const stats = getStats();
  const taskDistribution = getTaskDistribution();
  const projectProgress = getProjectProgress();
  const weeklyTimesheet = getWeeklyTimesheet();
  const teamPerformance = getTeamPerformance();
  const projectTimeAllocation = getProjectTimeAllocation();
  const recentProjects = getRecentProjects();

  return (
    <div className="space-y-6 max-w-full">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Project Dashboard</h1>
        <p className="text-surface-600">Welcome back! Here's what's happening with your projects and team.</p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} index={index} />
        ))}
</div>

      {/* Charts Section - Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          animate
          initial={{ opacity: 0, x: -20 }}
          animateProps={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Task Distribution</h3>
          {dashboardData.tasks.length > 0 ? (
            <ChartWrapper
              type="donut"
              series={taskDistribution.series}
              options={taskDistribution.options}
              height={300}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-surface-500">
              <div className="text-center">
                <ApperIcon name="CheckSquare" className="w-12 h-12 mx-auto mb-2" />
                <p>No tasks to display</p>
              </div>
            </div>
          )}
        </Card>

        <Card
          animate
          initial={{ opacity: 0, x: 20 }}
          animateProps={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Weekly Timesheet</h3>
          {dashboardData.timeEntries.length > 0 ? (
            <ChartWrapper
              type="bar"
              series={weeklyTimesheet.series}
              options={weeklyTimesheet.options}
              height={300}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-surface-500">
              <div className="text-center">
                <ApperIcon name="Clock" className="w-12 h-12 mx-auto mb-2" />
                <p>No time entries this week</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Charts Section - Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          animate
          initial={{ opacity: 0, x: -20 }}
          animateProps={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Project Progress</h3>
          {dashboardData.projects.length > 0 ? (
            <ChartWrapper
              type="bar"
              series={projectProgress.series}
              options={projectProgress.options}
              height={300}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-surface-500">
              <div className="text-center">
                <ApperIcon name="FolderOpen" className="w-12 h-12 mx-auto mb-2" />
                <p>No projects to display</p>
              </div>
            </div>
          )}
        </Card>

        <Card
          animate
          initial={{ opacity: 0, x: 20 }}
          animateProps={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Project Time Allocation</h3>
          {projectTimeAllocation.series.length > 0 ? (
            <ChartWrapper
              type="pie"
              series={projectTimeAllocation.series}
              options={projectTimeAllocation.options}
              height={300}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-surface-500">
              <div className="text-center">
                <ApperIcon name="PieChart" className="w-12 h-12 mx-auto mb-2" />
                <p>No time data available</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Team Overview */}
      <Card
        animate
        initial={{ opacity: 0, y: 20 }}
        animateProps={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Team Overview</h3>
        {teamPerformance.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamPerformance.map((member) => (
              <div key={member.Id} className="bg-surface-50 rounded-lg p-4 border border-surface-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      {member.Name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-surface-900">{member.Name}</h4>
                    <p className="text-sm text-surface-600">{member.role}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-600">Hours Logged:</span>
                    <span className="font-medium text-surface-900">{member.hoursLogged}h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-600">Tasks Completed:</span>
                    <span className="font-medium text-surface-900">{member.tasksCompleted}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-600">Active Tasks:</span>
                    <span className="font-medium text-surface-900">{member.activeTasks}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-surface-500">
            <ApperIcon name="Users" className="w-12 h-12 mx-auto mb-2" />
            <p>No team members available</p>
          </div>
        )}
</Card>

      {/* Recent Projects */}
      <Card
        animate
        initial={{ opacity: 0, y: 20 }}
        animateProps={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Recent Projects</h3>
        {recentProjects.length > 0 ? (
          <div className="space-y-4">
            {recentProjects.map((project) => (
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
                    <div className="text-sm font-medium text-surface-900">{project.progress}%</div>
                    <div className="text-xs text-surface-500">{project.tasks.completed}/{project.tasks.total} tasks</div>
                  </div>
                  <ProgressBar progress={project.progress} animate animationDelay={0.5} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-surface-500">
            <ApperIcon name="FolderOpen" className="w-12 h-12 mx-auto mb-2" />
            <p>No projects available</p>
            <Button
              onClick={() => navigate('/projects')}
              className="mt-4 bg-primary text-white hover:bg-primary/90"
            >
              Create Your First Project
            </Button>
          </div>
        )}
</Card>

      {/* Quick Actions */}
      <Card
        animate
        initial={{ opacity: 0, y: 20 }}
        animateProps={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'New Project', icon: 'Plus', color: 'bg-blue-500 hover:bg-blue-600', action: 'new-project' },
            { title: 'Add Task', icon: 'CheckSquare', color: 'bg-green-500 hover:bg-green-600', action: 'add-task' },
            { title: 'Track Time', icon: 'Clock', color: 'bg-purple-500 hover:bg-purple-600', action: 'track-time' },
            { title: 'View Reports', icon: 'BarChart3', color: 'bg-orange-500 hover:bg-orange-600', action: 'view-reports' }
          ].map((action) => (
            <motion.button
              key={action.title}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickAction(action.action)}
              className={`${action.color} text-white p-4 rounded-lg flex items-center space-x-3 transition-colors`}
            >
              <ApperIcon name={action.icon} className="w-5 h-5" />
              <span className="font-medium">{action.title}</span>
            </motion.button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default HomePage;