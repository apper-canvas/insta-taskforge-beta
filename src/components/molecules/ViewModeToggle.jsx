import React from 'react';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ViewModeToggle = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex items-center space-x-1 bg-surface-100 rounded-lg p-1">
      <Button
        onClick={() => setViewMode('kanban')}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          viewMode === 'kanban'
            ? 'bg-white text-surface-900 shadow-sm'
            : 'text-surface-600 hover:text-surface-900'
        }`}
        whileHover={{ scale: 1 }} // Override default Button scale animation
        whileTap={{ scale: 1 }}
      >
        <ApperIcon name="Columns" className="w-4 h-4 mr-1 inline" />
        Kanban
      </Button>
      <Button
        onClick={() => setViewMode('list')}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          viewMode === 'list'
            ? 'bg-white text-surface-900 shadow-sm'
            : 'text-surface-600 hover:text-surface-900'
        }`}
        whileHover={{ scale: 1 }} // Override default Button scale animation
        whileTap={{ scale: 1 }}
      >
        <ApperIcon name="List" className="w-4 h-4 mr-1 inline" />
        List
      </Button>
    </div>
  );
};

ViewModeToggle.propTypes = {
  viewMode: PropTypes.oneOf(['kanban', 'list']).isRequired,
  setViewMode: PropTypes.func.isRequired,
};

export default ViewModeToggle;