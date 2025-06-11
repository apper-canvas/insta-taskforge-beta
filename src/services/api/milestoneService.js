// ApperClient service for milestones
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const milestoneService = {
  // Get all milestones
  async getAll(params = {}) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // All fields for milestone table (including system fields for display)
      const allFields = [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'Description', 'DueDate', 'Status', 'ProjectId'
      ];

      const queryParams = {
        fields: allFields,
        ...params
      };

      const response = await apperClient.fetchRecords('milestone', queryParams);
      
      if (!response || !response.data) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching milestones:", error);
      throw error;
    }
  },

  // Get milestone by ID
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
        'Description', 'DueDate', 'Status', 'ProjectId'
      ];

      const params = { fields: allFields };
      const response = await apperClient.getRecordById('milestone', id, params);
      
      if (!response || !response.data) {
        throw new Error('Milestone not found');
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching milestone with ID ${id}:`, error);
      throw error;
    }
  },

  // Create new milestone (only Updateable fields)
  async create(milestoneData) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableFields = ['Name', 'Tags', 'Owner', 'Description', 'DueDate', 'Status', 'ProjectId'];
      const filteredData = {};
      
      updateableFields.forEach(field => {
        if (milestoneData[field] !== undefined) {
          // Convert string IDs to integers for lookup fields
          if (field === 'ProjectId' && typeof milestoneData[field] === 'string') {
            filteredData[field] = parseInt(milestoneData[field]);
          } else {
            filteredData[field] = milestoneData[field];
          }
        }
      });

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.createRecord('milestone', params);
      
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
      console.error("Error creating milestone:", error);
      throw error;
    }
  },

  // Update milestone (only Updateable fields)
  async update(id, milestoneData) {
    try {
      await delay(350);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields plus Id
      const updateableFields = ['Name', 'Tags', 'Owner', 'Description', 'DueDate', 'Status', 'ProjectId'];
      const filteredData = { Id: id };
      
      updateableFields.forEach(field => {
        if (milestoneData[field] !== undefined) {
          // Convert string IDs to integers for lookup fields
          if (field === 'ProjectId' && typeof milestoneData[field] === 'string') {
            filteredData[field] = parseInt(milestoneData[field]);
          } else {
            filteredData[field] = milestoneData[field];
          }
        }
      });

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.updateRecord('milestone', params);
      
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
      console.error("Error updating milestone:", error);
      throw error;
    }
  },

  // Delete milestone
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

      const response = await apperClient.deleteRecord('milestone', params);
      
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
      console.error("Error deleting milestone:", error);
      throw error;
    }
  },

  // Get milestones by project
  async getByProject(projectId) {
    try {
      const params = {
        where: [
          {
            fieldName: "ProjectId",
            operator: "EqualTo",
            values: [parseInt(projectId)]
          }
        ]
      };
      return await this.getAll(params);
    } catch (error) {
      console.error("Error fetching milestones by project:", error);
      throw error;
    }
  },

  // Get milestones by status
  async getByStatus(status) {
    try {
      const params = {
        where: [
          {
            fieldName: "Status",
            operator: "ExactMatch",
            values: [status]
          }
        ]
      };
      return await this.getAll(params);
    } catch (error) {
      console.error("Error fetching milestones by status:", error);
      throw error;
    }
  }
};

export default milestoneService;