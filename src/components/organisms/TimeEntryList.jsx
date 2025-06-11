import React from 'react';
import { AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import TimeEntryCard from '@/components/molecules/TimeEntryCard';
import ApperIcon from '@/components/ApperIcon';

const TimeEntryList = ({ entries, onEdit, onDelete, getTaskTitle, getProjectName, hasInitialEntries }) => {
  if (entries.length === 0 && hasInitialEntries) {
    return (
      <div className="text-center py-8 text-surface-500">
        <ApperIcon name="Filter" className="w-12 h-12 mx-auto mb-2" />
        <p>No time entries match the selected period</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {entries.map((entry, index) => (
          <TimeEntryCard
            key={entry.id}
            entry={entry}
            onEdit={onEdit}
            onDelete={onDelete}
            getTaskTitle={getTaskTitle}
            getProjectName={getProjectName}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

TimeEntryList.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  getTaskTitle: PropTypes.func.isRequired,
  getProjectName: PropTypes.func.isRequired,
  hasInitialEntries: PropTypes.bool.isRequired,
};

export default TimeEntryList;