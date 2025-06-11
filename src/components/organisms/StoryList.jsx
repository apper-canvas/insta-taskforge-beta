import React from 'react';
import { AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import StoryCard from '@/components/molecules/StoryCard';
import ApperIcon from '@/components/ApperIcon';

const StoryList = ({ stories, onEdit, onDelete, getProjectName, hasInitialStories }) => {
  if (stories.length === 0 && hasInitialStories) {
    return (
      <div className="text-center py-8 text-surface-500">
        <ApperIcon name="Filter" className="w-12 h-12 mx-auto mb-2" />
        <p>No stories match the selected filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {stories.map((story, index) => (
          <StoryCard
            key={story.id}
            story={story}
            onEdit={onEdit}
            onDelete={onDelete}
            getProjectName={getProjectName}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

StoryList.propTypes = {
  stories: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  getProjectName: PropTypes.func.isRequired,
  hasInitialStories: PropTypes.bool.isRequired,
};

export default StoryList;