import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ModalBase from '@/components/molecules/ModalBase';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const TaskForm = ({ isOpen, onClose, onSubmit, task, userStories = [], projects = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    userStoryId: '',
    projectId: '',
    assignee: '',
    status: 'todo',
    deadline: '',
    priority: 'medium'
  });

useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        userStoryId: task.user_story_id || task.userStoryId || '',
        projectId: task.project_id || task.projectId || '',
        assignee: task.assignee || '',
        status: task.status || 'todo',
        deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
        priority: task.priority || 'medium'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        userStoryId: userStories.length > 0 ? userStories[0].id : '',
        projectId: projects.length > 0 ? projects[0].id : '',
        assignee: '',
        status: 'todo',
        deadline: '',
        priority: 'medium'
      });
    }
  }, [task, userStories, projects, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
};

  const handleStoryChange = (storyId) => {
    const story = userStories.find(s => (s.id || s.Id) === storyId);
    setFormData(prev => ({
      ...prev,
      userStoryId: storyId,
      projectId: story ? (story.project_id || story.projectId) : prev.projectId
    }));
  };
const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      user_story_id: formData.userStoryId,
      project_id: formData.projectId,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null
    };
onSubmit(submitData);
  };

  const projectOptions = projects.map(p => ({ value: p.Id || p.id, label: p.Name || p.name }));
  const availableStories = formData.projectId
    ? userStories.filter(story => (story.project_id || story.projectId) === formData.projectId)
    : userStories;
  const storyOptions = availableStories.map(s => ({ value: s.Id || s.id, label: s.title }));
  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];
  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Task Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter task title"
          required
        />
        <FormField
          label="Description"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe the task"
          rows={3}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Project"
            name="projectId"
            type="select"
            value={formData.projectId}
            onChange={handleInputChange}
            options={projectOptions}
            required
          />
          <FormField
            label="User Story"
            name="userStoryId"
            type="select"
            value={formData.userStoryId}
            onChange={(e) => handleStoryChange(e.target.value)}
            options={storyOptions}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Assignee"
            name="assignee"
            value={formData.assignee}
            onChange={handleInputChange}
            placeholder="Enter assignee name"
          />
          <FormField
            label="Deadline"
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Priority"
            name="priority"
            type="select"
            value={formData.priority}
            onChange={handleInputChange}
            options={priorityOptions}
          />
          <FormField
            label="Status"
            name="status"
            type="select"
            value={formData.status}
            onChange={handleInputChange}
            options={statusOptions}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-surface-200">
          <Button
            type="button"
            onClick={onClose}
            className="border border-surface-300 text-surface-700 bg-transparent hover:bg-surface-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-primary text-white hover:bg-primary/90"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </ModalBase>
  );
};

TaskForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  task: PropTypes.object,
  userStories: PropTypes.arrayOf(PropTypes.object),
  projects: PropTypes.arrayOf(PropTypes.object),
};

export default TaskForm;