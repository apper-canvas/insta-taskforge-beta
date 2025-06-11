import userStoriesData from '../mockData/userStories.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserStoryService {
  constructor() {
    this.userStories = [...userStoriesData];
  }

  async getAll() {
    await delay(300);
    return [...this.userStories];
  }

  async getById(id) {
    await delay(200);
    const story = this.userStories.find(s => s.id === id);
    if (!story) {
      throw new Error('User story not found');
    }
    return { ...story };
  }

  async create(storyData) {
    await delay(400);
    const newStory = {
      id: Date.now().toString(),
      ...storyData,
      createdAt: Date.now()
    };
    this.userStories.unshift(newStory);
    return { ...newStory };
  }

  async update(id, storyData) {
    await delay(300);
    const index = this.userStories.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('User story not found');
    }
    const updatedStory = {
      ...this.userStories[index],
      ...storyData
    };
    this.userStories[index] = updatedStory;
    return { ...updatedStory };
  }

  async delete(id) {
    await delay(250);
    const index = this.userStories.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('User story not found');
    }
    this.userStories.splice(index, 1);
    return true;
  }
}

export default new UserStoryService();