import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
import Card from './Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const StoryCard = ({ story, onEdit, onDelete, getProjectName, index }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-surface-100 text-surface-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-accent/10 text-accent';
      case 'in-progress': return 'bg-primary/10 text-primary';
      case 'todo': return 'bg-surface-100 text-surface-700';
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
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-surface-900 break-words">
              {story.title}
            </h3>
            <Badge className={getPriorityColor(story.priority)}>
              {story.priority || 'Medium'}
            </Badge>
            <Badge className={getStatusColor(story.status)}>
              {story.status || 'To Do'}
            </Badge>
          </div>
          <p className="text-sm text-surface-600 mb-2">
            Project: {getProjectName(story.projectId)}
          </p>
          <p className="text-surface-700 break-words">
            {story.description}
          </p>
        </div>
        <div className="flex items-center space-x-1 ml-4">
          <Button
            onClick={() => onEdit(story)}
            className="p-2 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onDelete(story.id)}
            className="p-2 text-surface-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {story.acceptanceCriteria && story.acceptanceCriteria.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-surface-900 mb-2">Acceptance Criteria:</h4>
          <ul className="space-y-1">
            {story.acceptanceCriteria.map((criteria, criteriaIndex) => (
              <li key={criteriaIndex} className="text-sm text-surface-700 flex items-start">
                <ApperIcon name="CheckCircle2" className="w-4 h-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                <span className="break-words">{criteria}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-surface-500 pt-4 mt-4 border-t border-surface-200">
        <span>Created {new Date(story.createdAt).toLocaleDateString()}</span>
        <div className="flex items-center space-x-4">
          <span>ID: {story.id.slice(-8)}</span>
        </div>
      </div>
    </Card>
  );
};

StoryCard.propTypes = {
  story: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    acceptanceCriteria: PropTypes.arrayOf(PropTypes.string),
    priority: PropTypes.string,
    status: PropTypes.string,
    projectId: PropTypes.string.isRequired,
    createdAt: PropTypes.number,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  getProjectName: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default StoryCard;