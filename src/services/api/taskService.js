// ApperClient service for tasks
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  // Get all tasks
  async getAll(params = {}) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // All fields for task table (including system fields for display)
      const allFields = [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'user_story_id', 'project_id', 'title', 'description', 'assignee', 'status', 'deadline', 'priority', 'time_logged'
      ];

      const queryParams = {
        fields: allFields,
        ...params
      };

      const response = await apperClient.fetchRecords('task', queryParams);
      
      if (!response || !response.data) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  // Get task by ID
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
        'user_story_id', 'project_id', 'title', 'description', 'assignee', 'status', 'deadline', 'priority', 'time_logged'
      ];

      const params = { fields: allFields };
      const response = await apperClient.getRecordById('task', id, params);
      
      if (!response || !response.data) {
        throw new Error('Task not found');
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  },

  // Create new task (only Updateable fields)
  async create(taskData) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableFields = ['Name', 'Tags', 'Owner', 'user_story_id', 'project_id', 'title', 'description', 'assignee', 'status', 'deadline', 'priority', 'time_logged'];
      const filteredData = {};
      
      updateableFields.forEach(field => {
        if (taskData[field] !== undefined) {
          // Convert string IDs to integers for lookup fields
          if ((field === 'user_story_id' || field === 'project_id') && typeof taskData[field] === 'string') {
            filteredData[field] = parseInt(taskData[field]);
          } else {
            filteredData[field] = taskData[field];
          }
        }
      });

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.createRecord('task', params);
      
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
      console.error("Error creating task:", error);
      throw error;
    }
  },

  // Update task (only Updateable fields)
  async update(id, taskData) {
    try {
      await delay(350);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields plus Id
      const updateableFields = ['Name', 'Tags', 'Owner', 'user_story_id', 'project_id', 'title', 'description', 'assignee', 'status', 'deadline', 'priority', 'time_logged'];
      const filteredData = { Id: id };
      
      updateableFields.forEach(field => {
        if (taskData[field] !== undefined) {
          // Convert string IDs to integers for lookup fields
          if ((field === 'user_story_id' || field === 'project_id') && typeof taskData[field] === 'string') {
            filteredData[field] = parseInt(taskData[field]);
          } else {
            filteredData[field] = taskData[field];
          }
        }
      });

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.updateRecord('task', params);
      
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
      console.error("Error updating task:", error);
      throw error;
    }
  },

  // Delete task
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

      const response = await apperClient.deleteRecord('task', params);
      
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
      console.error("Error deleting task:", error);
      throw error;
    }
  },

  // Get tasks by project
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
      console.error("Error fetching tasks by project:", error);
      throw error;
    }
  },

  // Get tasks by status
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
      console.error("Error fetching tasks by status:", error);
      throw error;
    }
  },

  // Get tasks by user story
  async getByUserStory(userStoryId) {
    try {
      const params = {
        where: [
          {
            fieldName: "user_story_id",
            operator: "EqualTo",
            values: [parseInt(userStoryId)]
          }
        ]
      };
      return await this.getAll(params);
    } catch (error) {
      console.error("Error fetching tasks by user story:", error);
      throw error;
    }
  },

  // Search tasks
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
      console.error("Error searching tasks:", error);
      throw error;
    }
  },

  // Update status
  async updateStatus(id, status) {
    return this.update(id, { status });
  },

  // Get tasks by assignee
  async getByAssignee(assignee) {
    try {
      const params = {
        where: [
          {
            fieldName: "assignee",
            operator: "ExactMatch",
            values: [assignee]
          }
        ]
      };
      return await this.getAll(params);
    } catch (error) {
      console.error("Error fetching tasks by assignee:", error);
      throw error;
    }
  },

  // Get overdue tasks
  async getOverdue() {
    try {
      const now = new Date().toISOString();
      const params = {
        where: [
          {
            fieldName: "deadline",
            operator: "LessThan",
            values: [now]
          },
          {
            fieldName: "status",
            operator: "NotEqualTo",
            values: ["completed"]
          }
        ]
      };
      return await this.getAll(params);
    } catch (error) {
      console.error("Error fetching overdue tasks:", error);
      throw error;
    }
}
};

export default taskService;