import React from 'react';
import PropTypes from 'prop-types';
import ChartWrapper from '@/components/molecules/ChartWrapper';

const DashboardChartsSection = ({ taskStatusData, projectProgressData, tasksCount, projectsCount }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartWrapper
        title="Task Distribution"
        chartOptions={taskStatusData.options}
        chartSeries={taskStatusData.series}
        type="donut"
        hasData={tasksCount > 0}
        noDataMessage="No task data available"
        noDataIcon="PieChart"
        delay={0.5}
      />

      <ChartWrapper
        title="Project Progress"
        chartOptions={projectProgressData.options}
        chartSeries={projectProgressData.series}
        type="bar"
        hasData={projectsCount > 0}
        noDataMessage="No project data available"
        noDataIcon="BarChart3"
        delay={0.6}
      />
    </div>
  );
};

DashboardChartsSection.propTypes = {
  taskStatusData: PropTypes.object.isRequired,
  projectProgressData: PropTypes.object.isRequired,
  tasksCount: PropTypes.number.isRequired,
  projectsCount: PropTypes.number.isRequired,
};

export default DashboardChartsSection;