import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { userStoryService, projectService } from '../services';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import StoryModal from '../components/StoryModal';

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [selectedProject, setSelectedProject] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [storiesData, projectsData] = await Promise.all([
        userStoryService.getAll(),
        projectService.getAll()
      ]);
      setStories(storiesData);
      setProjects(projectsData);
    } catch (err) {
      setError(err.message || 'Failed to load stories');
      toast.error('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStory = async (storyData) => {
    try {
      const newStory = await userStoryService.create(storyData);
      setStories(prev => [newStory, ...prev]);
      setIsModalOpen(false);
      toast.success('User story created successfully');
    } catch (err) {
      toast.error('Failed to create story');
    }
  };

  const handleUpdateStory = async (storyData) => {
    try {
      const updatedStory = await userStoryService.update(editingStory.id, storyData);
      setStories(prev => prev.map(s => s.id === editingStory.id ? updatedStory : s));
      setEditingStory(null);
      setIsModalOpen(false);
      toast.success('User story updated successfully');
    } catch (err) {
      toast.error('Failed to update story');
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (window.confirm('Are you sure you want to delete this user story?')) {
      try {
        await userStoryService.delete(storyId);
        setStories(prev => prev.filter(s => s.id !== storyId));
        toast.success('User story deleted successfully');
      } catch (err) {
        toast.error('Failed to delete story');
      }
    }
  };

  const openEditModal = (story) => {
    setEditingStory(story);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStory(null);
  };

  const filteredStories = selectedProject === 'all' 
    ? stories 
    : stories.filter(story => story.projectId === selectedProject);

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-surface-100 text-surface-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-accent/10 text-accent';
      case 'in-progress': return 'bg-primary/10 text-primary';
      case 'todo': return 'bg-surface-100 text-surface-700';
      default: return 'bg-surface-100 text-surface-700';
    }
  };

  if (loading) {
    return <SkeletonLoader count={4} />;
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={loadData}
      />
    );
  }

  if (stories.length === 0) {
    return (
      <EmptyState 
        title="No user stories found"
        description="Create your first user story to define features and requirements"
        actionLabel="Create Story"
        onAction={() => setIsModalOpen(true)}
        icon="BookOpen"
      />
    );
  }

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-surface-900">User Stories</h2>
          <p className="text-surface-600 mt-1">Define and track feature requirements</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          New Story
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-surface-700">Project:</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stories List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border border-surface-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-surface-900 break-words">
                        {story.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(story.priority)}`}>
                        {story.priority || 'Medium'}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(story.status)}`}>
                        {story.status || 'To Do'}
                      </span>
                    </div>
                    <p className="text-sm text-surface-600 mb-2">
                      Project: {getProjectName(story.projectId)}
                    </p>
                    <p className="text-surface-700 break-words">
                      {story.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 ml-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openEditModal(story)}
                      className="p-2 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-lg transition-colors"
                    >
                      <ApperIcon name="Edit2" className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteStory(story.id)}
                      className="p-2 text-surface-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {story.acceptanceCriteria && story.acceptanceCriteria.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-surface-900 mb-2">Acceptance Criteria:</h4>
                    <ul className="space-y-1">
                      {story.acceptanceCriteria.map((criteria, criteriaIndex) => (
                        <li key={criteriaIndex} className="text-sm text-surface-700 flex items-start">
                          <ApperIcon name="CheckCircle2" className="w-4 h-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span className="break-words">{criteria}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-surface-500 pt-4 mt-4 border-t border-surface-200">
                  <span>Created {new Date(story.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center space-x-4">
                    <span>ID: {story.id.slice(-8)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredStories.length === 0 && stories.length > 0 && (
        <div className="text-center py-8 text-surface-500">
          <ApperIcon name="Filter" className="w-12 h-12 mx-auto mb-2" />
          <p>No stories match the selected filters</p>
        </div>
      )}

      {/* Story Modal */}
      <StoryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingStory ? handleUpdateStory : handleCreateStory}
        story={editingStory}
        projects={projects}
      />
    </div>
  );
};

export default Stories;