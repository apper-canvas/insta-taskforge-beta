import React from 'react';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
import Card from './Card';

const StatCard = ({ title, value, icon, color, change, subtitle, index }) => {
  return (
    <Card
      animate
      initial={{ opacity: 0, y: 20 }}
      animateProps={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-surface-600">{title}</p>
          <p className="text-3xl font-bold text-surface-900 mt-2">{value}</p>
          {change && <p className="text-sm text-accent mt-1">{change} from last month</p>}
          {subtitle && <p className="text-sm text-surface-500 mt-1 break-words">{subtitle}</p>}
        </div>
        <div className={`${color} p-3 rounded-lg flex-shrink-0`}>
          <ApperIcon name={icon} className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  change: PropTypes.string,
  subtitle: PropTypes.string,
  index: PropTypes.number,
};

export default StatCard;