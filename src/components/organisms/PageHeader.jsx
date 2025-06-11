import React from 'react';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const PageHeader = ({ title, description, actionLabel, onAction, actionIcon }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-surface-900">{title}</h2>
        <p className="text-surface-600 mt-1">{description}</p>
      </div>
      {onAction && actionLabel && (
        <Button
          onClick={onAction}
          className="mt-4 sm:mt-0 bg-primary text-white hover:bg-primary/90"
          icon={actionIcon ? ApperIcon.bind(null, { name: actionIcon }) : null}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  actionIcon: PropTypes.string,
};

export default PageHeader;