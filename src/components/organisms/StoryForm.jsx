import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ModalBase from '@/components/molecules/ModalBase';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Label from '@/components/atoms/Label';

const StoryForm = ({ isOpen, onClose, onSubmit, story, projects = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    acceptanceCriteria: [''],
    priority: 'medium',
    status: 'todo',
    projectId: ''
  });

  useEffect(() => {
    if (story) {
      setFormData({
        title: story.title || '',
        description: story.description || '',
        acceptanceCriteria: story.acceptanceCriteria && story.acceptanceCriteria.length > 0 ? story.acceptanceCriteria : [''],
        priority: story.priority || 'medium',
        status: story.status || 'todo',
        projectId: story.projectId || (projects.length > 0 ? projects[0].id : '')
      });
    } else {
      setFormData({
        title: '',
        description: '',
        acceptanceCriteria: [''],
        priority: 'medium',
        status: 'todo',
        projectId: projects.length > 0 ? projects[0].id : ''
      });
    }
  }, [story, projects, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCriteriaChange = (index, value) => {
    const newCriteria = [...formData.acceptanceCriteria];
    newCriteria[index] = value;
    setFormData(prev => ({ ...prev, acceptanceCriteria: newCriteria }));
  };

  const addCriteria = () => {
    setFormData(prev => ({ ...prev, acceptanceCriteria: [...prev.acceptanceCriteria, ''] }));
  };

  const removeCriteria = (index) => {
    if (formData.acceptanceCriteria.length > 1) {
      const newCriteria = formData.acceptanceCriteria.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, acceptanceCriteria: newCriteria }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredCriteria = formData.acceptanceCriteria.filter(criteria => criteria.trim() !== '');
    onSubmit({
      ...formData,
      acceptanceCriteria: filteredCriteria
    });
  };

  const projectOptions = projects.map(p => ({ value: p.id, label: p.name }));
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
      title={story ? 'Edit User Story' : 'Create New User Story'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
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
          label="Story Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="As a [user], I want [feature] so that [benefit]"
          required
        />
        <FormField
          label="Description"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Provide detailed description of the user story"
          rows={4}
        />

        <div>
          <Label>Acceptance Criteria</Label>
          <div className="space-y-3">
            {formData.acceptanceCriteria.map((criteria, index) => (
              <div key={index} className="flex items-center space-x-2">
                <FormField
                  type="text"
                  name={`criteria-${index}`}
                  value={criteria}
                  onChange={(e) => handleCriteriaChange(index, e.target.value)}
                  placeholder={`Criteria ${index + 1}`}
                  inputClassName="flex-1 px-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  label=""
                />
                {formData.acceptanceCriteria.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeCriteria(index)}
                    className="p-2 text-surface-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              onClick={addCriteria}
              className="text-sm text-primary hover:text-primary/80 bg-transparent hover:bg-transparent"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
              Add Criteria
            </Button>
          </div>
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
            {story ? 'Update Story' : 'Create Story'}
          </Button>
        </div>
      </form>
    </ModalBase>
  );
};

StoryForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  story: PropTypes.object,
  projects: PropTypes.arrayOf(PropTypes.object),
};

export default StoryForm;