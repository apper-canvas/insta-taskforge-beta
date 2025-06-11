import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const ProgressBar = ({ progress, className = '', animate = false, animationDelay = 0.5 }) => {
  const bar = (
    <div className="w-16 h-2 bg-surface-200 rounded-full overflow-hidden">
      {animate ? (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: animationDelay }}
          className={`h-full bg-primary rounded-full ${className}`}
        />
      ) : (
        <div
          className={`h-full bg-primary rounded-full transition-all ${className}`}
          style={{ width: `${progress}%` }}
        />
      )}
    </div>
  );
  return bar;
};

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  className: PropTypes.string,
  animate: PropTypes.bool,
  animationDelay: PropTypes.number,
};

export default ProgressBar;