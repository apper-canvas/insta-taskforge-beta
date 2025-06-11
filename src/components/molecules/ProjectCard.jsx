import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/molecules/Card';
import Button from '@/components/atoms/Button';

const ProjectCard = ({ project, onEdit, onDelete, index }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-accent/10 text-accent';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-surface-100 text-surface-700';
    }
  };

  return (
    <Card
      animate
      initial={{ opacity: 0, y: 20 }}
      animateProps={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex items-start justify-between mb-4">
<div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-surface-900 break-words">
            {project.Name || project.name}
          </h3>
          <p className="text-sm text-surface-600 mt-1 break-words">
            {project.description}
          </p>
        </div>
        <div className="flex items-center space-x-1 ml-2">
          <Button
            onClick={() => onEdit(project)}
            className="p-2 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon name="Edit2" className="w-4 h-4" />
</Button>
          <Button
            onClick={() => onDelete(project.id || project.Id)}
            className="p-2 text-surface-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-surface-600">Status</span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
            {project.status || 'Draft'}
          </span>
        </div>

        {project.scope && (
          <div>
            <span className="text-sm text-surface-600">Scope</span>
            <p className="text-sm text-surface-900 mt-1 break-words">{project.scope}</p>
          </div>
        )}

        {project.goals && project.goals.length > 0 && (
          <div>
            <span className="text-sm text-surface-600">Goals</span>
            <ul className="mt-1 space-y-1">
              {project.goals.slice(0, 2).map((goal, goalIndex) => (
                <li key={goalIndex} className="text-sm text-surface-900 flex items-start">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="break-words">{goal}</span>
                </li>
              ))}
              {project.goals.length > 2 && (
                <li className="text-sm text-surface-500">
                  +{project.goals.length - 2} more goals
                </li>
              )}
            </ul>
          </div>
        )}

<div className="flex items-center justify-between text-xs text-surface-500 pt-3 border-t border-surface-200">
          <span>Created {new Date(project.CreatedOn || project.createdAt || Date.now()).toLocaleDateString()}</span>
          {(project.ModifiedOn || project.updatedAt) && (project.ModifiedOn !== project.CreatedOn || project.updatedAt !== project.createdAt) && (
            <span>Updated {new Date(project.ModifiedOn || project.updatedAt || Date.now()).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </Card>
  );
};

ProjectCard.propTypes = {
project: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    Id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    Name: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
    scope: PropTypes.string,
    goals: PropTypes.arrayOf(PropTypes.string),
    createdAt: PropTypes.number,
    updatedAt: PropTypes.number,
    CreatedOn: PropTypes.string,
    ModifiedOn: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default ProjectCard;