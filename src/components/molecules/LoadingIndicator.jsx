import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const LoadingIndicator = ({ count = 3, type = 'card' }) => {
  const skeletonItems = Array.from({ length: count }, (_, index) => index);

  if (type === 'table') {
    return (
      <div className="bg-white rounded-lg border border-surface-200 shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-surface-200 rounded w-1/4"></div>
          {skeletonItems.map((index) => (
            <div key={index} className="flex items-center space-x-4 py-3">
              <div className="h-3 bg-surface-200 rounded w-1/4"></div>
              <div className="h-3 bg-surface-200 rounded w-1/6"></div>
              <div className="h-3 bg-surface-200 rounded w-1/6"></div>
              <div className="h-3 bg-surface-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {skeletonItems.map((index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg border border-surface-200 shadow-sm p-6"
        >
          <div className="animate-pulse space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-6 bg-surface-200 rounded w-1/3"></div>
              <div className="h-4 bg-surface-200 rounded w-16"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-surface-200 rounded w-3/4"></div>
              <div className="h-4 bg-surface-200 rounded w-1/2"></div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-surface-200">
              <div className="h-3 bg-surface-200 rounded w-24"></div>
              <div className="h-3 bg-surface-200 rounded w-20"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

LoadingIndicator.propTypes = {
  count: PropTypes.number,
  type: PropTypes.oneOf(['card', 'table']),
};

export default LoadingIndicator;