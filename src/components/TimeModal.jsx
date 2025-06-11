import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './ApperIcon';

const TimeModal = ({ isOpen, onClose, onSubmit, timeEntry, tasks = [] }) => {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-surface-900">
                    {timeEntry ? 'Edit Time Entry' : 'Log Time'}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Task *
                    </label>
                    <select
                      required
                      value={formData.taskId}
                      onChange={(e) => setFormData(prev => ({ ...prev, taskId: e.target.value }))}
                      className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select a task</option>
                      {tasks.map(task => (
                        <option key={task.id} value={task.id}>
                          {task.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Duration (hours) *
                      </label>
                      <input
                        type="number"
                        step="0.25"
                        min="0.25"
                        max="24"
                        required
                        value={formData.duration}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                        className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="2.5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder="What did you work on?"
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-surface-200">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      {timeEntry ? 'Update Entry' : 'Log Time'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TimeModal;