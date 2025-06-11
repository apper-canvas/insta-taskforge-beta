import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './ApperIcon';

const StoryModal = ({ isOpen, onClose, onSubmit, story, projects = [] }) => {
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
        projectId: story.projectId || ''
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredCriteria = formData.acceptanceCriteria.filter(criteria => criteria.trim() !== '');
    onSubmit({
      ...formData,
      acceptanceCriteria: filteredCriteria
    });
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
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-surface-900">
                    {story ? 'Edit User Story' : 'Create New User Story'}
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
                      Project *
                    </label>
                    <select
                      required
                      value={formData.projectId}
                      onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
                      className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select a project</option>
                      {projects.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Story Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="As a [user], I want [feature] so that [benefit]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder="Provide detailed description of the user story"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Acceptance Criteria
                    </label>
                    <div className="space-y-3">
                      {formData.acceptanceCriteria.map((criteria, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={criteria}
                            onChange={(e) => handleCriteriaChange(index, e.target.value)}
                            className="flex-1 px-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder={`Criteria ${index + 1}`}
                          />
                          {formData.acceptanceCriteria.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCriteria(index)}
                              className="p-2 text-surface-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addCriteria}
                        className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
                        Add Criteria
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
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
                      {story ? 'Update Story' : 'Create Story'}
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

export default StoryModal;