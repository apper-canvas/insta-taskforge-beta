import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ModalBase from '@/components/molecules/ModalBase';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Label from '@/components/atoms/Label';

const ProjectForm = ({ isOpen, onClose, onSubmit, project }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    scope: '',
    goals: [''],
    status: 'active'
  });

useEffect(() => {
    if (project) {
      setFormData({
        name: project.Name || project.name || '',
        description: project.description || '',
        scope: project.scope || '',
        goals: project.goals && project.goals.length > 0 ? project.goals : [''],
        status: project.status || 'active'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        scope: '',
        goals: [''],
        status: 'active'
      });
    }
  }, [project, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGoalChange = (index, value) => {
    const newGoals = [...formData.goals];
    newGoals[index] = value;
    setFormData(prev => ({ ...prev, goals: newGoals }));
  };

  const addGoal = () => {
    setFormData(prev => ({ ...prev, goals: [...prev.goals, ''] }));
  };

  const removeGoal = (index) => {
    if (formData.goals.length > 1) {
      const newGoals = formData.goals.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, goals: newGoals }));
    }
  };

const handleSubmit = (e) => {
    e.preventDefault();
    const filteredGoals = formData.goals.filter(goal => goal.trim() !== '');
    onSubmit({
      Name: formData.name,
      description: formData.description,
      scope: formData.scope,
      goals: filteredGoals,
      status: formData.status
    });
  };

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Edit Project' : 'Create New Project'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Project Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter project name"
          required
        />
        <FormField
          label="Description"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe the project"
          rows={3}
        />
        <FormField
          label="Project Scope"
          name="scope"
          type="textarea"
          value={formData.scope}
          onChange={handleInputChange}
          placeholder="Define project scope and boundaries"
          rows={3}
        />

        <div>
          <Label>Project Goals</Label>
          <div className="space-y-3">
            {formData.goals.map((goal, index) => (
              <div key={index} className="flex items-center space-x-2">
                <FormField
                  type="text"
                  name={`goal-${index}`} // Unique name for each goal input
                  value={goal}
                  onChange={(e) => handleGoalChange(index, e.target.value)}
                  placeholder={`Goal ${index + 1}`}
                  inputClassName="flex-1 px-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  label="" // No label for individual goal inputs
                />
                {formData.goals.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeGoal(index)}
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
              onClick={addGoal}
              className="text-sm text-primary hover:text-primary/80 bg-transparent hover:bg-transparent"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
              Add Goal
            </Button>
          </div>
        </div>

        <FormField
          label="Status"
          name="status"
          type="select"
          value={formData.status}
          onChange={handleInputChange}
          options={statusOptions}
        />

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
            {project ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </ModalBase>
  );
};

ProjectForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  project: PropTypes.object, // Can be null for creation
};

export default ProjectForm;