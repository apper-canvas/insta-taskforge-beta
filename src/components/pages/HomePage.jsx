import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { projectService, userStoryService, taskService } from '@/services';
import LoadingIndicator from '@/components/molecules/LoadingIndicator';
import MessageState from '@/components/molecules/MessageState';
import DashboardSummary from '@/components/organisms/DashboardSummary';
import DashboardChartsSection from '@/components/organisms/DashboardChartsSection';
import RecentProjectsSection from '@/components/organisms/RecentProjectsSection';

const HomePage = () => {
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
    return <LoadingIndicator count={6} />;
  }

  if (error) {
    return (
      <MessageState
        type="error"
        title="Dashboard Error"
        description={error}
        actionLabel="Try Again"
        onAction={() => window.location.reload()}
        icon="AlertCircle"
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
      <DashboardSummary statCards={statCards} />
      <DashboardChartsSection
        taskStatusData={taskStatusData}
        projectProgressData={projectProgressData}
        tasksCount={tasks.length}
        projectsCount={projects.length}
      />
      <RecentProjectsSection projects={projects} tasks={tasks} />
    </div>
  );
};

export default HomePage;