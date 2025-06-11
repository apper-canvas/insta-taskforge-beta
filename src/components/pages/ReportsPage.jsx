import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { projectService, userStoryService, taskService, timeEntryService } from '@/services';
import LoadingIndicator from '@/components/molecules/LoadingIndicator';
import MessageState from '@/components/molecules/MessageState';
import PageHeader from '@/components/organisms/PageHeader';
import ReportSummary from '@/components/organisms/ReportSummary';
import ReportChartsSection from '@/components/organisms/ReportChartsSection';
import ProjectPerformanceTable from '@/components/organisms/ProjectPerformanceTable';
import Select from '@/components/atoms/Select';
import Label from '@/components/atoms/Label';

const ReportsPage = () => {
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
    return <LoadingIndicator count={6} />;
  }

  if (error) {
    return (
      <MessageState
        type="error"
        title="Reports Load Error"
        description={error}
        actionLabel="Try Again"
        onAction={loadReportData}
        icon="AlertCircle"
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

  const projectOptions = [
    { value: 'all', label: 'All Projects' },
    ...projects.map(project => ({ value: project.id, label: project.name }))
  ];

  return (
    <div className="space-y-6 max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Reports & Analytics"
          description="Track project progress and team productivity"
        />
        <div className="mt-4 sm:mt-0">
          <Label htmlFor="project-filter" className="sr-only">Select Project:</Label>
          <Select
            id="project-filter"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            options={projectOptions}
            className="px-4 py-2 text-sm"
          />
        </div>
      </div>

      <ReportSummary reportCards={reportCards} />

      <ReportChartsSection
        taskStatusData={taskStatusData}
        storyPriorityData={storyPriorityData}
        weeklyTimeData={weeklyTimeData}
        projectTimeData={projectTimeData}
        filteredTasksCount={filteredTasks.length}
        filteredStoriesCount={filteredStories.length}
        projectsCount={projects.length}
      />

      <ProjectPerformanceTable
        projects={projects}
        tasks={tasks}
        userStories={userStories}
        timeEntries={timeEntries}
      />
    </div>
  );
};

export default ReportsPage;