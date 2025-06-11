import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import ApperIcon from '@/components/ApperIcon';
import Card from './Card';

const ChartWrapper = ({ title, chartOptions, chartSeries, type, height = 300, hasData, noDataMessage, noDataIcon, delay = 0.5 }) => {
  return (
    <Card
      animate
      initial={{ opacity: 0, y: 20 }}
      animateProps={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <h3 className="text-lg font-semibold text-surface-900 mb-4">{title}</h3>
      {hasData ? (
        <Chart
          options={chartOptions}
          series={chartSeries}
          type={type}
          height={height}
        />
      ) : (
        <div className="flex items-center justify-center h-64 text-surface-500">
          <div className="text-center">
            <ApperIcon name={noDataIcon} className="w-12 h-12 mx-auto mb-2" />
            <p>{noDataMessage}</p>
          </div>
        </div>
      )}
    </Card>
  );
};

ChartWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  chartOptions: PropTypes.object.isRequired,
  chartSeries: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  height: PropTypes.number,
  hasData: PropTypes.bool.isRequired,
  noDataMessage: PropTypes.string.isRequired,
  noDataIcon: PropTypes.string.isRequired,
  delay: PropTypes.number,
};

export default ChartWrapper;