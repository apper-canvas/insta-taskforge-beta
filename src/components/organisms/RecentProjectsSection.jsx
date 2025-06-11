import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/molecules/Card';
import ProgressBar from '@/components/molecules/ProgressBar';
const RecentProjectsSection = ({ projects, tasks }) => {
  const getProjectProgress = (projectId) => {
    const projectTasks = tasks.filter(t => (parseInt(t.project_id) || parseInt(t.projectId)) === parseInt(projectId));
    const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
    return projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;
  };

  const getCompletedTaskCount = (projectId) => {
    const projectTasks = tasks.filter(t => (parseInt(t.project_id) || parseInt(t.projectId)) === parseInt(projectId));
    const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
    return { completed: completedTasks, total: projectTasks.length };
  };

  return (
    <Card
      animate
      initial={{ opacity: 0, y: 20 }}
      animateProps={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <h3 className="text-lg font-semibold text-surface-900 mb-4">Recent Projects</h3>
{projects.length > 0 ? (
        <div className="space-y-4">
          {projects.slice(0, 5).map((project) => {
            const projectId = project.Id || project.id;
            const progress = getProjectProgress(projectId);
            const { completed, total } = getCompletedTaskCount(projectId);

            return (
              <div key={projectId} className="flex items-center justify-between p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name="FolderOpen" className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-surface-900">{project.Name || project.name}</h4>
                    <p className="text-sm text-surface-600 break-words">{project.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-surface-900">{Math.round(progress)}%</div>
                    <div className="text-xs text-surface-500">{completed}/{total} tasks</div>
                  </div>
                  <ProgressBar progress={progress} animate animationDelay={0.5} />
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
    </Card>
  );
};

RecentProjectsSection.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default RecentProjectsSection;