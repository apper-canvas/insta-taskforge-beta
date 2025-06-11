import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { userStoryService, projectService } from '@/services';
import LoadingIndicator from '@/components/molecules/LoadingIndicator';
import MessageState from '@/components/molecules/MessageState';
import PageHeader from '@/components/organisms/PageHeader';
import StoryForm from '@/components/organisms/StoryForm';
import StoryList from '@/components/organisms/StoryList';
import Select from '@/components/atoms/Select';
import Label from '@/components/atoms/Label';

const StoriesPage = () => {
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

  const openCreateModal = () => {
    setEditingStory(null);
    setIsModalOpen(true);
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

  if (loading) {
    return <LoadingIndicator count={4} />;
  }

  if (error) {
    return (
      <MessageState
        type="error"
        title="Stories Load Error"
        description={error}
        actionLabel="Try Again"
        onAction={loadData}
        icon="AlertCircle"
      />
    );
  }

  if (stories.length === 0 && !loading) {
    return (
      <MessageState
        type="empty"
        title="No user stories found"
        description="Create your first user story to define features and requirements"
        actionLabel="Create Story"
        onAction={openCreateModal}
        icon="BookOpen"
      />
    );
  }

  const projectOptions = [
    { value: 'all', label: 'All Projects' },
    ...projects.map(project => ({ value: project.id, label: project.name }))
  ];

  return (
    <div className="space-y-6 max-w-full">
      <PageHeader
        title="User Stories"
        description="Define and track feature requirements"
        actionLabel="New Story"
        onAction={openCreateModal}
        actionIcon="Plus"
      />

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="project-filter">Project:</Label>
          <Select
            id="project-filter"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            options={projectOptions}
            className="px-3 py-2 text-sm"
          />
        </div>
      </div>

      <StoryList
        stories={filteredStories}
        onEdit={openEditModal}
        onDelete={handleDeleteStory}
        getProjectName={getProjectName}
        hasInitialStories={stories.length > 0}
      />

      <StoryForm
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingStory ? handleUpdateStory : handleCreateStory}
        story={editingStory}
        projects={projects}
      />
    </div>
  );
};

export default StoriesPage;