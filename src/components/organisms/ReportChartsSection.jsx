import React from 'react';
import PropTypes from 'prop-types';
import ChartWrapper from '@/components/molecules/ChartWrapper';

const ReportChartsSection = ({ taskStatusData, storyPriorityData, weeklyTimeData, projectTimeData, filteredTasksCount, filteredStoriesCount, projectsCount }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartWrapper
        title="Task Status Distribution"
        chartOptions={taskStatusData.options}
        chartSeries={taskStatusData.series}
        type="donut"
        hasData={filteredTasksCount > 0}
        noDataMessage="No task data available"
        noDataIcon="PieChart"
        delay={0.5}
      />

      <ChartWrapper
        title="Story Priority Distribution"
        chartOptions={storyPriorityData.options}
        chartSeries={storyPriorityData.series}
        type="pie"
        hasData={filteredStoriesCount > 0}
        noDataMessage="No story data available"
        noDataIcon="PieChart"
        delay={0.6}
      />

      <ChartWrapper
        title="Weekly Time Trend"
        chartOptions={weeklyTimeData.options}
        chartSeries={weeklyTimeData.series}
        type="line"
        hasData={true} // Line chart usually has data, even if 0
        noDataMessage="No time trend data available"
        noDataIcon="LineChart" // Assuming LineChart icon is available
        delay={0.7}
      />

      <ChartWrapper
        title="Time by Project"
        chartOptions={projectTimeData.options}
        chartSeries={projectTimeData.series}
        type="bar"
        hasData={projectsCount > 0}
        noDataMessage="No project data available"
        noDataIcon="BarChart3"
        delay={0.8}
      />
    </div>
  );
};

ReportChartsSection.propTypes = {
  taskStatusData: PropTypes.object.isRequired,
  storyPriorityData: PropTypes.object.isRequired,
  weeklyTimeData: PropTypes.object.isRequired,
  projectTimeData: PropTypes.object.isRequired,
  filteredTasksCount: PropTypes.number.isRequired,
  filteredStoriesCount: PropTypes.number.isRequired,
  projectsCount: PropTypes.number.isRequired,
};

export default ReportChartsSection;