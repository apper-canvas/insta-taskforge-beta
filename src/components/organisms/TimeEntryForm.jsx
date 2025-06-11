import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ModalBase from '@/components/molecules/ModalBase';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const TimeEntryForm = ({ isOpen, onClose, onSubmit, timeEntry, tasks = [] }) => {
  const [formData, setFormData] = useState({
    taskId: '',
    duration: '',
    date: '',
    description: ''
  });

  useEffect(() => {
    if (timeEntry) {
      setFormData({
        taskId: timeEntry.taskId || '',
        duration: timeEntry.duration || '',
        date: timeEntry.date ? new Date(timeEntry.date).toISOString().split('T')[0] : '',
        description: timeEntry.description || ''
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        taskId: tasks.length > 0 ? tasks[0].id : '',
        duration: '',
        date: today,
        description: ''
      });
    }
  }, [timeEntry, tasks, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      duration: parseFloat(formData.duration),
      date: new Date(formData.date).getTime(),
      userId: 'current-user' // This would come from auth context in a real app
    };
    onSubmit(submitData);
  };

  const taskOptions = tasks.map(task => ({ value: task.id, label: task.title }));

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title={timeEntry ? 'Edit Time Entry' : 'Log Time'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Task"
          name="taskId"
          type="select"
          value={formData.taskId}
          onChange={handleInputChange}
          options={taskOptions}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Duration (hours)"
            name="duration"
            type="number"
            step="0.25"
            min="0.25"
            max="24"
            value={formData.duration}
            onChange={handleInputChange}
            placeholder="2.5"
            required
          />
          <FormField
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>

        <FormField
          label="Description"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="What did you work on?"
          rows={3}
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
            {timeEntry ? 'Update Entry' : 'Log Time'}
          </Button>
        </div>
      </form>
    </ModalBase>
  );
};

TimeEntryForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  timeEntry: PropTypes.object, // Can be null for creation
  tasks: PropTypes.arrayOf(PropTypes.object),
};

export default TimeEntryForm;