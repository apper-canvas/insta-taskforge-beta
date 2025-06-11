import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const Card = ({ children, className = '', animate = false, initial = {}, animateProps = {}, transition = {}, ...rest }) => {
  const cardContent = (
    <div className={`bg-white rounded-lg p-6 shadow-sm border border-surface-200 hover:shadow-md transition-all duration-200 ${className}`} {...rest}>
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={initial}
        animate={animateProps}
        transition={transition}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  animate: PropTypes.bool,
  initial: PropTypes.object,
  animateProps: PropTypes.object,
  transition: PropTypes.object,
};

export default Card;