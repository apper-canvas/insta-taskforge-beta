import { toast } from 'react-toastify';

class UserStoryService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'user_story';
    this.updateableFields = ['Name', 'project_id', 'title', 'description', 'acceptance_criteria', 'priority', 'status', 'created_at'];
    this.allFields = ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'project_id', 'title', 'description', 'acceptance_criteria', 'priority', 'status', 'created_at'];
  }

  async getAll() {
    try {
      const params = {
        fields: this.allFields,
        orderBy: [{
          fieldName: "created_at",
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
      console.error("Error fetching user stories:", error);
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
      console.error(`Error fetching user story with ID ${id}:`, error);
      throw error;
    }
  }

  async create(storyData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (storyData.hasOwnProperty(field) || 
            (field === 'Name' && storyData.hasOwnProperty('title')) ||
            (field === 'project_id' && storyData.hasOwnProperty('projectId')) ||
            (field === 'created_at' && !storyData.hasOwnProperty('created_at'))) {
          
          if (field === 'Name' && storyData.hasOwnProperty('title')) {
            filteredData[field] = storyData.title;
          } else if (field === 'project_id' && storyData.hasOwnProperty('projectId')) {
            filteredData[field] = parseInt(storyData.projectId);
          } else if (field === 'created_at' && !storyData.hasOwnProperty('created_at')) {
            filteredData[field] = new Date().toISOString();
          } else if (storyData.hasOwnProperty(field)) {
            filteredData[field] = field === 'project_id' ? parseInt(storyData[field]) : storyData[field];
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
      console.error("Error creating user story:", error);
      throw error;
    }
  }

  async update(id, storyData) {
    try {
      // Filter to only include updateable fields
      const filteredData = { Id: parseInt(id) };
      this.updateableFields.forEach(field => {
        if (storyData.hasOwnProperty(field) || 
            (field === 'Name' && storyData.hasOwnProperty('title')) ||
            (field === 'project_id' && storyData.hasOwnProperty('projectId'))) {
          
          if (field === 'Name' && storyData.hasOwnProperty('title')) {
            filteredData[field] = storyData.title;
          } else if (field === 'project_id' && storyData.hasOwnProperty('projectId')) {
            filteredData[field] = parseInt(storyData.projectId);
          } else if (storyData.hasOwnProperty(field)) {
            filteredData[field] = field === 'project_id' ? parseInt(storyData[field]) : storyData[field];
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
      console.error("Error updating user story:", error);
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
      console.error("Error deleting user story:", error);
      throw error;
    }
  }
}

export default new UserStoryService();