// ApperClient service for time entries
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const timeEntryService = {
  // Get all time entries
  async getAll(params = {}) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // All fields for time_entry table (including system fields for display)
      const allFields = [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'duration', 'date', 'description', 'task_id', 'user_id'
      ];

      const queryParams = {
        fields: allFields,
        ...params
      };

      const response = await apperClient.fetchRecords('time_entry', queryParams);
      
      if (!response || !response.data) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching time entries:", error);
      throw error;
    }
  },

  // Get time entry by ID
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
        'duration', 'date', 'description', 'task_id', 'user_id'
      ];

      const params = { fields: allFields };
      const response = await apperClient.getRecordById('time_entry', id, params);
      
      if (!response || !response.data) {
        throw new Error('Time entry not found');
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching time entry with ID ${id}:`, error);
      throw error;
    }
  },

  // Create new time entry (only Updateable fields)
  async create(entryData) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableFields = ['Name', 'Tags', 'Owner', 'duration', 'date', 'description', 'task_id', 'user_id'];
      const filteredData = {};
      
      updateableFields.forEach(field => {
        if (entryData[field] !== undefined) {
          // Convert string IDs to integers for lookup fields
          if ((field === 'task_id' || field === 'user_id') && typeof entryData[field] === 'string') {
            filteredData[field] = parseInt(entryData[field]);
          } else {
            filteredData[field] = entryData[field];
          }
        }
      });

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.createRecord('time_entry', params);
      
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
      console.error("Error creating time entry:", error);
      throw error;
    }
  },

  // Update time entry (only Updateable fields)
  async update(id, entryData) {
    try {
      await delay(350);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields plus Id
      const updateableFields = ['Name', 'Tags', 'Owner', 'duration', 'date', 'description', 'task_id', 'user_id'];
      const filteredData = { Id: id };
      
      updateableFields.forEach(field => {
        if (entryData[field] !== undefined) {
          // Convert string IDs to integers for lookup fields
          if ((field === 'task_id' || field === 'user_id') && typeof entryData[field] === 'string') {
            filteredData[field] = parseInt(entryData[field]);
          } else {
            filteredData[field] = entryData[field];
          }
        }
      });

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.updateRecord('time_entry', params);
      
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
      console.error("Error updating time entry:", error);
      throw error;
    }
  },

  // Delete time entry
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

      const response = await apperClient.deleteRecord('time_entry', params);
      
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
      console.error("Error deleting time entry:", error);
      throw error;
    }
  },

  // Get time entries by task
  async getByTask(taskId) {
    try {
      const params = {
        where: [
          {
            fieldName: "task_id",
            operator: "EqualTo",
            values: [parseInt(taskId)]
          }
        ]
      };
      return await this.getAll(params);
    } catch (error) {
      console.error("Error fetching time entries by task:", error);
      throw error;
    }
  },

  // Get time entries by user
  async getByUser(userId) {
    try {
      const params = {
        where: [
          {
            fieldName: "user_id",
            operator: "EqualTo",
            values: [parseInt(userId)]
          }
        ]
      };
      return await this.getAll(params);
    } catch (error) {
      console.error("Error fetching time entries by user:", error);
      throw error;
    }
  },

  // Get time entries by date range
  async getByDateRange(startDate, endDate) {
    try {
      const params = {
        where: [
          {
            fieldName: "date",
            operator: "GreaterThanOrEqualTo",
            values: [startDate]
          },
          {
            fieldName: "date",
            operator: "LessThanOrEqualTo",
            values: [endDate]
          }
        ]
      };
      return await this.getAll(params);
    } catch (error) {
      console.error("Error fetching time entries by date range:", error);
      throw error;
    }
  }
};

export default timeEntryService;