import HomePage from '@/components/pages/HomePage';
import ProjectsPage from '@/components/pages/ProjectsPage';
import StoriesPage from '@/components/pages/StoriesPage';
import TasksPage from '@/components/pages/TasksPage';
import TimePage from '@/components/pages/TimePage';
import ReportsPage from '@/components/pages/ReportsPage';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
component: HomePage
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    path: '/projects',
    icon: 'FolderOpen',
component: ProjectsPage
  },
  stories: {
    id: 'stories',
    label: 'Stories',
    path: '/stories',
    icon: 'BookOpen',
component: StoriesPage
  },
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
component: TasksPage
  },
  time: {
    id: 'time',
    label: 'Time',
    path: '/time',
    icon: 'Clock',
component: TimePage
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'BarChart3',
component: ReportsPage
  }
};

export const routeArray = Object.values(routes);