import { toast } from 'react-toastify';

class TaskService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task';
    this.updateableFields = ['Name', 'user_story_id', 'project_id', 'title', 'description', 'assignee', 'status', 'deadline', 'priority', 'time_logged'];
    this.allFields = ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'user_story_id', 'project_id', 'title', 'description', 'assignee', 'status', 'deadline', 'priority', 'time_logged'];
  }

  async getAll() {
    try {
      const params = {
        fields: this.allFields,
        orderBy: [{
          fieldName: "CreatedOn",
          SortType: "DESC"
        }]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: this.allFields
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  }

  async create(taskData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (taskData.hasOwnProperty(field) || 
            (field === 'Name' && taskData.hasOwnProperty('title')) ||
            (field === 'user_story_id' && taskData.hasOwnProperty('userStoryId')) ||
            (field === 'project_id' && taskData.hasOwnProperty('projectId')) ||
            (field === 'time_logged' && !taskData.hasOwnProperty('time_logged'))) {
          
          if (field === 'Name' && taskData.hasOwnProperty('title')) {
            filteredData[field] = taskData.title;
          } else if (field === 'user_story_id' && taskData.hasOwnProperty('userStoryId')) {
            filteredData[field] = parseInt(taskData.userStoryId);
          } else if (field === 'project_id' && taskData.hasOwnProperty('projectId')) {
            filteredData[field] = parseInt(taskData.projectId);
          } else if (field === 'time_logged' && !taskData.hasOwnProperty('time_logged')) {
            filteredData[field] = 0.0;
          } else if (field === 'deadline' && taskData.hasOwnProperty('deadline')) {
            filteredData[field] = new Date(taskData.deadline).toISOString();
          } else if (taskData.hasOwnProperty(field)) {
            const value = taskData[field];
            if (field === 'user_story_id' || field === 'project_id') {
              filteredData[field] = parseInt(value);
            } else {
              filteredData[field] = value;
            }
          }
        }
      });

      const params = {
        records: [filteredData]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${failedRecords}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }
      
      throw new Error('No records created');
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async update(id, taskData) {
    try {
      // Filter to only include updateable fields
      const filteredData = { Id: parseInt(id) };
      this.updateableFields.forEach(field => {
        if (taskData.hasOwnProperty(field) || 
            (field === 'Name' && taskData.hasOwnProperty('title')) ||
            (field === 'user_story_id' && taskData.hasOwnProperty('userStoryId')) ||
            (field === 'project_id' && taskData.hasOwnProperty('projectId'))) {
          
          if (field === 'Name' && taskData.hasOwnProperty('title')) {
            filteredData[field] = taskData.title;
          } else if (field === 'user_story_id' && taskData.hasOwnProperty('userStoryId')) {
            filteredData[field] = parseInt(taskData.userStoryId);
          } else if (field === 'project_id' && taskData.hasOwnProperty('projectId')) {
            filteredData[field] = parseInt(taskData.projectId);
          } else if (field === 'deadline' && taskData.hasOwnProperty('deadline')) {
            filteredData[field] = new Date(taskData.deadline).toISOString();
          } else if (taskData.hasOwnProperty(field)) {
            const value = taskData[field];
            if (field === 'user_story_id' || field === 'project_id') {
              filteredData[field] = parseInt(value);
            } else {
              filteredData[field] = value;
            }
          }
        }
      });

      const params = {
        records: [filteredData]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${failedUpdates}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }
      
      throw new Error('No records updated');
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${failedDeletions}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }
}

export default new TaskService();