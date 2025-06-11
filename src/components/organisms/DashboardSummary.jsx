import React from 'react';
import PropTypes from 'prop-types';
import StatCard from '@/components/molecules/StatCard';

const DashboardSummary = ({ statCards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <StatCard key={stat.title} {...stat} index={index} />
      ))}
    </div>
  );
};

DashboardSummary.propTypes = {
  statCards: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    change: PropTypes.string,
  })).isRequired,
};

export default DashboardSummary;