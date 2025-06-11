import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const TaskCard = ({ task, onEdit, onDelete, getStoryTitle, getPriorityColor, draggableProvided, snapshot, type = 'kanban' }) => {
  const content = (
    <div
      className={`bg-white rounded-lg border-l-4 ${getPriorityColor(task.priority)} shadow-sm hover:shadow-md transition-all duration-200 ${
        type === 'kanban' && snapshot?.isDragging ? 'shadow-lg scale-105' : ''
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-surface-900 break-words flex-1">
            {task.title}
          </h4>
          <div className="flex items-center space-x-1 ml-2">
            <Button
              onClick={() => onEdit(task)}
              className="p-1 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ApperIcon name="Edit2" className="w-3 h-3" />
            </Button>
            <Button
              onClick={() => onDelete(task.id)}
              className="p-1 text-surface-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ApperIcon name="Trash2" className="w-3 h-3" />
            </Button>
          </div>
        </div>
{task.description && (
          <p className="text-sm text-surface-600 mb-3 break-words">
            {task.description}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-surface-500">Story:</span>
            <span className="text-surface-700 break-words">
              {getStoryTitle(task.user_story_id || task.userStoryId)}
            </span>
          </div>

          {task.assignee && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-surface-500">Assignee:</span>
              <span className="text-surface-700">{task.assignee}</span>
            </div>
          )}
{task.deadline && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-surface-500">Due:</span>
              <span className="text-surface-700">
                {new Date(task.deadline).toLocaleDateString()}
              </span>
            </div>
)}

          {(task.time_logged || task.timeLogged) > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-surface-500">Time:</span>
              <span className="text-surface-700">{task.time_logged || task.timeLogged}h</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (type === 'kanban' && draggableProvided) {
    return (
      <div
        ref={draggableProvided.innerRef}
        {...draggableProvided.draggableProps}
        {...draggableProvided.dragHandleProps}
      >
        {content}
      </div>
    );
  }

  return content;
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    userStoryId: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    assignee: PropTypes.string,
    status: PropTypes.string,
    deadline: PropTypes.number,
    priority: PropTypes.string,
    timeLogged: PropTypes.number,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  getStoryTitle: PropTypes.func.isRequired,
  getPriorityColor: PropTypes.func.isRequired,
  draggableProvided: PropTypes.object, // For react-beautiful-dnd
  snapshot: PropTypes.object, // For react-beautiful-dnd
  type: PropTypes.oneOf(['kanban', 'list']),
};

export default TaskCard;