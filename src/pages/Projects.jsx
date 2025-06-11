import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { projectService } from '../services';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import ProjectModal from '../components/ProjectModal';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await projectService.getAll();
      setProjects(result);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const newProject = await projectService.create(projectData);
      setProjects(prev => [newProject, ...prev]);
      setIsModalOpen(false);
      toast.success('Project created successfully');
    } catch (err) {
      toast.error('Failed to create project');
    }
  };

  const handleUpdateProject = async (projectData) => {
    try {
      const updatedProject = await projectService.update(editingProject.id, projectData);
      setProjects(prev => prev.map(p => p.id === editingProject.id ? updatedProject : p));
      setEditingProject(null);
      setIsModalOpen(false);
      toast.success('Project updated successfully');
    } catch (err) {
      toast.error('Failed to update project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.delete(projectId);
        setProjects(prev => prev.filter(p => p.id !== projectId));
        toast.success('Project deleted successfully');
      } catch (err) {
        toast.error('Failed to delete project');
      }
    }
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  if (loading) {
    return <SkeletonLoader count={4} />;
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={loadProjects}
      />
    );
  }

  if (projects.length === 0) {
    return (
      <EmptyState 
        title="No projects found"
        description="Create your first project to get started with task management"
        actionLabel="Create Project"
        onAction={() => setIsModalOpen(true)}
        icon="FolderOpen"
      />
    );
  }

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-surface-900">Projects</h2>
          <p className="text-surface-600 mt-1">Manage your development projects</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          New Project
        </motion.button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border border-surface-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-surface-900 break-words">
                      {project.name}
                    </h3>
                    <p className="text-sm text-surface-600 mt-1 break-words">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openEditModal(project)}
                      className="p-2 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-lg transition-colors"
                    >
                      <ApperIcon name="Edit2" className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-2 text-surface-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-surface-600">Status</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      project.status === 'active' 
                        ? 'bg-accent/10 text-accent' 
                        : project.status === 'completed'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-surface-100 text-surface-700'
                    }`}>
                      {project.status || 'Draft'}
                    </span>
                  </div>

                  {project.scope && (
                    <div>
                      <span className="text-sm text-surface-600">Scope</span>
                      <p className="text-sm text-surface-900 mt-1 break-words">{project.scope}</p>
                    </div>
                  )}

                  {project.goals && project.goals.length > 0 && (
                    <div>
                      <span className="text-sm text-surface-600">Goals</span>
                      <ul className="mt-1 space-y-1">
                        {project.goals.slice(0, 2).map((goal, goalIndex) => (
                          <li key={goalIndex} className="text-sm text-surface-900 flex items-start">
                            <span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            <span className="break-words">{goal}</span>
                          </li>
                        ))}
                        {project.goals.length > 2 && (
                          <li className="text-sm text-surface-500">
                            +{project.goals.length - 2} more goals
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-surface-500 pt-3 border-t border-surface-200">
                    <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                    {project.updatedAt && project.updatedAt !== project.createdAt && (
                      <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
        project={editingProject}
      />
    </div>
  );
};

export default Projects;