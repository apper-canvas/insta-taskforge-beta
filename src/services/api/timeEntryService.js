import timeEntriesData from '../mockData/timeEntries.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TimeEntryService {
  constructor() {
    this.timeEntries = [...timeEntriesData];
  }

  async getAll() {
    await delay(300);
    return [...this.timeEntries];
  }

  async getById(id) {
    await delay(200);
    const entry = this.timeEntries.find(e => e.id === id);
    if (!entry) {
      throw new Error('Time entry not found');
    }
    return { ...entry };
  }

  async create(entryData) {
    await delay(400);
    const newEntry = {
      id: Date.now().toString(),
      ...entryData
    };
    this.timeEntries.unshift(newEntry);
    return { ...newEntry };
  }

  async update(id, entryData) {
    await delay(300);
    const index = this.timeEntries.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Time entry not found');
    }
    const updatedEntry = {
      ...this.timeEntries[index],
      ...entryData
    };
    this.timeEntries[index] = updatedEntry;
    return { ...updatedEntry };
  }

  async delete(id) {
    await delay(250);
    const index = this.timeEntries.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Time entry not found');
    }
    this.timeEntries.splice(index, 1);
    return true;
  }
}

export default new TimeEntryService();