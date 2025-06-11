import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { projectService } from '@/services';
import LoadingIndicator from '@/components/molecules/LoadingIndicator';
import MessageState from '@/components/molecules/MessageState';
import PageHeader from '@/components/organisms/PageHeader';
import ProjectForm from '@/components/organisms/ProjectForm';
import ProjectGrid from '@/components/organisms/ProjectGrid';

const ProjectsPage = () => {
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

  const openCreateModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
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
    return <LoadingIndicator count={4} />;
  }

  if (error) {
    return (
      <MessageState
        type="error"
        title="Project Load Error"
        description={error}
        actionLabel="Try Again"
        onAction={loadProjects}
        icon="AlertCircle"
      />
    );
  }

  if (projects.length === 0) {
    return (
      <MessageState
        type="empty"
        title="No projects found"
        description="Create your first project to get started with task management"
        actionLabel="Create Project"
        onAction={openCreateModal}
        icon="FolderOpen"
      />
    );
  }

  return (
    <div className="space-y-6 max-w-full">
      <PageHeader
        title="Projects"
        description="Manage your development projects"
        actionLabel="New Project"
        onAction={openCreateModal}
        actionIcon="Plus"
      />

      <ProjectGrid
        projects={projects}
        onEdit={openEditModal}
        onDelete={handleDeleteProject}
      />

      <ProjectForm
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
        project={editingProject}
      />
    </div>
  );
};

export default ProjectsPage;