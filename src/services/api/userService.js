import usersData from '../mockData/users.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserService {
  async getAll() {
    await delay(300);
    return [...usersData];
  }

  async getById(id) {
    await delay(200);
    const user = usersData.find(user => user.Id === parseInt(id));
    return user ? { ...user } : null;
  }

  async create(userData) {
    await delay(400);
    const newUser = {
      ...userData,
      Id: Date.now(),
      CreatedOn: new Date().toISOString(),
      ModifiedOn: new Date().toISOString()
    };
    usersData.push(newUser);
    return { ...newUser };
  }

  async update(id, userData) {
    await delay(350);
    const index = usersData.findIndex(user => user.Id === parseInt(id));
    if (index !== -1) {
      usersData[index] = {
        ...usersData[index],
        ...userData,
        ModifiedOn: new Date().toISOString()
      };
      return { ...usersData[index] };
    }
    throw new Error('User not found');
  }

  async delete(id) {
    await delay(300);
    const index = usersData.findIndex(user => user.Id === parseInt(id));
    if (index !== -1) {
      const deletedUser = usersData.splice(index, 1)[0];
      return { ...deletedUser };
    }
    throw new Error('User not found');
  }
}

export default new UserService();