import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
import Card from './Card';
import Button from '@/components/atoms/Button';

const TimeEntryCard = ({ entry, onEdit, onDelete, getTaskTitle, getProjectName, index }) => {
  return (
    <Card
      animate
      initial={{ opacity: 0, y: 20 }}
      animateProps={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-surface-900 break-words">
              {getTaskTitle(entry.taskId)}
            </h3>
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
              {entry.duration}h
            </span>
          </div>
          <p className="text-sm text-surface-600 mb-2">
            Project: {getProjectName(entry.taskId)}
          </p>
          {entry.description && (
            <p className="text-surface-700 break-words">
              {entry.description}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-1 ml-4">
          <Button
            onClick={() => onEdit(entry)}
            className="p-2 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onDelete(entry.id)}
            className="p-2 text-surface-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-surface-500 pt-4 border-t border-surface-200">
        <span>Logged on {new Date(entry.date).toLocaleDateString()}</span>
        <span>Entry ID: {entry.id.slice(-8)}</span>
      </div>
    </Card>
  );
};

TimeEntryCard.propTypes = {
  entry: PropTypes.shape({
    id: PropTypes.string.isRequired,
    taskId: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    date: PropTypes.number.isRequired,
    description: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  getTaskTitle: PropTypes.func.isRequired,
  getProjectName: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default TimeEntryCard;