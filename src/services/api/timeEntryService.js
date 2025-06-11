import { toast } from 'react-toastify';

class TimeEntryService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'time_entry';
    this.updateableFields = ['Name', 'duration', 'date', 'description', 'task_id', 'user_id'];
    this.allFields = ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'duration', 'date', 'description', 'task_id', 'user_id'];
  }

  async getAll() {
    try {
      const params = {
        fields: this.allFields,
        orderBy: [{
          fieldName: "date",
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
      console.error("Error fetching time entries:", error);
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
      console.error(`Error fetching time entry with ID ${id}:`, error);
      throw error;
    }
  }

  async create(entryData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (entryData.hasOwnProperty(field) || 
            (field === 'Name' && entryData.hasOwnProperty('description')) ||
            (field === 'task_id' && entryData.hasOwnProperty('taskId')) ||
            (field === 'user_id' && entryData.hasOwnProperty('userId'))) {
          
          if (field === 'Name' && entryData.hasOwnProperty('description')) {
            filteredData[field] = entryData.description.substring(0, 50); // Use first 50 chars of description as name
          } else if (field === 'task_id' && entryData.hasOwnProperty('taskId')) {
            filteredData[field] = parseInt(entryData.taskId);
          } else if (field === 'user_id' && entryData.hasOwnProperty('userId')) {
            filteredData[field] = parseInt(entryData.userId);
          } else if (field === 'date' && entryData.hasOwnProperty('date')) {
            filteredData[field] = new Date(entryData.date).toISOString();
          } else if (entryData.hasOwnProperty(field)) {
            const value = entryData[field];
            if (field === 'task_id' || field === 'user_id') {
              filteredData[field] = parseInt(value);
            } else if (field === 'duration') {
              filteredData[field] = parseFloat(value);
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
      console.error("Error creating time entry:", error);
      throw error;
    }
  }

  async update(id, entryData) {
    try {
      // Filter to only include updateable fields
      const filteredData = { Id: parseInt(id) };
      this.updateableFields.forEach(field => {
        if (entryData.hasOwnProperty(field) || 
            (field === 'Name' && entryData.hasOwnProperty('description')) ||
            (field === 'task_id' && entryData.hasOwnProperty('taskId')) ||
            (field === 'user_id' && entryData.hasOwnProperty('userId'))) {
          
          if (field === 'Name' && entryData.hasOwnProperty('description')) {
            filteredData[field] = entryData.description.substring(0, 50);
          } else if (field === 'task_id' && entryData.hasOwnProperty('taskId')) {
            filteredData[field] = parseInt(entryData.taskId);
          } else if (field === 'user_id' && entryData.hasOwnProperty('userId')) {
            filteredData[field] = parseInt(entryData.userId);
          } else if (field === 'date' && entryData.hasOwnProperty('date')) {
            filteredData[field] = new Date(entryData.date).toISOString();
          } else if (entryData.hasOwnProperty(field)) {
            const value = entryData[field];
            if (field === 'task_id' || field === 'user_id') {
              filteredData[field] = parseInt(value);
            } else if (field === 'duration') {
              filteredData[field] = parseFloat(value);
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
      console.error("Error updating time entry:", error);
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
      console.error("Error deleting time entry:", error);
      throw error;
    }
  }
}

export default new TimeEntryService();