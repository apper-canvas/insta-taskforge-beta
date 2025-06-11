import React from 'react';
import PropTypes from 'prop-types';

const KanbanColumnHeader = ({ title, count }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-surface-900">{title}</h3>
      <span className="bg-surface-200 text-surface-700 text-xs px-2 py-1 rounded-full">
        {count}
      </span>
    </div>
  );
};

KanbanColumnHeader.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
};

export default KanbanColumnHeader;