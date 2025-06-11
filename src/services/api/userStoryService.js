// ApperClient service for user stories
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const userStoryService = {
  // Get all user stories
  async getAll(params = {}) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // All fields for user_story table (including system fields for display)
      const allFields = [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'project_id', 'title', 'description', 'acceptance_criteria', 'priority', 'status', 'created_at'
      ];

      const queryParams = {
        fields: allFields,
        ...params
      };

      const response = await apperClient.fetchRecords('user_story', queryParams);
      
      if (!response || !response.data) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching user stories:", error);
      throw error;
    }
  },

  // Get user story by ID
  async getById(id) {
    try {
      await delay(200);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const allFields = [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'project_id', 'title', 'description', 'acceptance_criteria', 'priority', 'status', 'created_at'
      ];

      const params = { fields: allFields };
      const response = await apperClient.getRecordById('user_story', id, params);
      
      if (!response || !response.data) {
        throw new Error('User story not found');
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching user story with ID ${id}:`, error);
      throw error;
    }
  },

  // Create new user story (only Updateable fields)
  async create(storyData) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableFields = ['Name', 'Tags', 'Owner', 'project_id', 'title', 'description', 'acceptance_criteria', 'priority', 'status', 'created_at'];
      const filteredData = {};
      
      updateableFields.forEach(field => {
        if (storyData[field] !== undefined) {
          filteredData[field] = storyData[field];
        }
      });

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.createRecord('user_story', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${failedRecords}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      console.error("Error creating user story:", error);
      throw error;
    }
  },

  // Update user story (only Updateable fields)
  async update(id, storyData) {
    try {
      await delay(350);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields plus Id
      const updateableFields = ['Name', 'Tags', 'Owner', 'project_id', 'title', 'description', 'acceptance_criteria', 'priority', 'status', 'created_at'];
      const filteredData = { Id: id };
      
      updateableFields.forEach(field => {
        if (storyData[field] !== undefined) {
          filteredData[field] = storyData[field];
        }
      });

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.updateRecord('user_story', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${failedUpdates}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      console.error("Error updating user story:", error);
      throw error;
    }
  },

  // Delete user story
  async delete(id) {
    try {
      await delay(250);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('user_story', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${failedDeletions}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting user story:", error);
      throw error;
    }
  },

  // Get stories by project
  async getByProject(projectId) {
    try {
      const params = {
        where: [
          {
            fieldName: "project_id",
            operator: "EqualTo",
            values: [parseInt(projectId)]
          }
        ]
      };
      return await this.getAll(params);
    } catch (error) {
      console.error("Error fetching stories by project:", error);
      throw error;
    }
  },

  // Get stories by status
  async getByStatus(status) {
    try {
      const params = {
        where: [
          {
            fieldName: "status",
            operator: "ExactMatch",
            values: [status]
          }
        ]
      };
      return await this.getAll(params);
    } catch (error) {
      console.error("Error fetching stories by status:", error);
      throw error;
    }
  },

  // Search user stories
  async search(query) {
    try {
      const params = {
        where: [
          {
            fieldName: "title",
            operator: "Contains",
            values: [query]
          }
        ]
      };
      return await this.getAll(params);
    } catch (error) {
      console.error("Error searching user stories:", error);
      throw error;
    }
  },

  // Update status
  async updateStatus(id, status) {
return this.update(id, { status });
  }
};

export default userStoryService;