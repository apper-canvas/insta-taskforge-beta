import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
import ProgressBar from '@/components/molecules/ProgressBar';
import Card from '@/components/molecules/Card';

const ProjectPerformanceTable = ({ projects, tasks, userStories, timeEntries }) => {
  return (
    <Card
      animate
      initial={{ opacity: 0, y: 20 }}
      animateProps={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
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
                        <ProgressBar progress={progress} />
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
    </Card>
  );
};

ProjectPerformanceTable.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  userStories: PropTypes.arrayOf(PropTypes.object).isRequired,
  timeEntries: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ProjectPerformanceTable;