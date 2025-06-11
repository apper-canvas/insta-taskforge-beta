import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const MessageState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  type = 'empty', // 'empty' or 'error'
  className = ''
}) => {
  const iconColor = type === 'error' ? 'text-red-500' : 'text-surface-300';
  const iconAnimation = type === 'error' ? {
    rotate: [0, 5, -5, 0],
    scale: [1, 1.1, 1]
  } : {
    y: [0, -10, 0]
  };
  const iconTransition = type === 'error' ? {
    duration: 2,
    repeat: Infinity,
    repeatType: "reverse"
  } : {
    repeat: Infinity,
    duration: 3
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <motion.div animate={iconAnimation} transition={iconTransition}>
        <ApperIcon name={icon} className={`w-16 h-16 mx-auto mb-4 ${iconColor}`} />
      </motion.div>

      <h3 className="text-xl font-semibold text-surface-900 mb-2">{title}</h3>
      <p className="text-surface-600 mb-6 max-w-md mx-auto break-words">{description}</p>

      {onAction && (
        <Button onClick={onAction} className="bg-primary text-white hover:bg-primary/90">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

MessageState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  icon: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['empty', 'error']),
  className: PropTypes.string,
};

export default MessageState;