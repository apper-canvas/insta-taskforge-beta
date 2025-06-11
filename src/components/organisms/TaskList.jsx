import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import TaskCard from '@/components/molecules/TaskCard'; // Reusing TaskCard, but it will render differently
import ApperIcon from '@/components/ApperIcon';

const TaskList = ({ tasks, onEditTask, onDeleteTask, getStoryTitle, getProjectName, getPriorityColor }) => {
  return (
    <div className="space-y-4">
      <AnimatePresence>
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-lg border-l-4 ${getPriorityColor(task.priority)} shadow-sm hover:shadow-md transition-all duration-200`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-surface-900 break-words">
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-surface-600 mt-1 break-words">
                      {task.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-1 ml-4">
                  <TaskCard
                    task={task}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    getStoryTitle={getStoryTitle}
                    getPriorityColor={getPriorityColor}
                    type="list" // Indicate list type rendering
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-surface-500">Status:</span>
                  <p className="font-medium text-surface-900 capitalize">
                    {task.status?.replace('-', ' ') || 'To Do'}
</p>
                </div>
                <div>
                  <span className="text-surface-500">Story:</span>
                  <p className="font-medium text-surface-900 break-words">
                    {getStoryTitle(task.user_story_id || task.userStoryId)}
                  </p>
                </div>
</div>
                <div>
                  <span className="text-surface-500">Project:</span>
                  <p className="font-medium text-surface-900 break-words">
                    {getProjectName(task.project_id || task.projectId)}
                  </p>
                </div>
                {task.assignee && (
                  <div>
                    <span className="text-surface-500">Assignee:</span>
                    <p className="font-medium text-surface-900">{task.assignee}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-surface-500 pt-4 mt-4 border-t border-surface-200">
                <span>ID: {task.id.slice(-8)}</span>
                {task.deadline && (
<span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                )}
                {(task.time_logged || task.timeLogged) > 0 && (
                  <span>Time logged: {task.time_logged || task.timeLogged}h</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEditTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  getStoryTitle: PropTypes.func.isRequired,
  getProjectName: PropTypes.func.isRequired,
  getPriorityColor: PropTypes.func.isRequired,
};

export default TaskList;