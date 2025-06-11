import Dashboard from '../pages/Dashboard';
import Projects from '../pages/Projects';
import Stories from '../pages/Stories';
import Tasks from '../pages/Tasks';
import Time from '../pages/Time';
import Reports from '../pages/Reports';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    path: '/projects',
    icon: 'FolderOpen',
    component: Projects
  },
  stories: {
    id: 'stories',
    label: 'Stories',
    path: '/stories',
    icon: 'BookOpen',
    component: Stories
  },
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: Tasks
  },
  time: {
    id: 'time',
    label: 'Time',
    path: '/time',
    icon: 'Clock',
    component: Time
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'BarChart3',
    component: Reports
  }
};

export const routeArray = Object.values(routes);