import projectsData from '../mockData/projects.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProjectService {
  constructor() {
    this.projects = [...projectsData];
  }

  async getAll() {
    await delay(300);
    return [...this.projects];
  }

  async getById(id) {
    await delay(200);
    const project = this.projects.find(p => p.id === id);
    if (!project) {
      throw new Error('Project not found');
    }
    return { ...project };
  }

  async create(projectData) {
    await delay(400);
    const newProject = {
      id: Date.now().toString(),
      ...projectData,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.projects.unshift(newProject);
    return { ...newProject };
  }

  async update(id, projectData) {
    await delay(300);
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    const updatedProject = {
      ...this.projects[index],
      ...projectData,
      updatedAt: Date.now()
    };
    this.projects[index] = updatedProject;
    return { ...updatedProject };
  }

  async delete(id) {
    await delay(250);
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    this.projects.splice(index, 1);
    return true;
  }
}

export default new ProjectService();