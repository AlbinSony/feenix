import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with interceptor for auth token
const apiClient = axios.create({
  baseURL: API_URL,
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Group {
  _id: string;
  name: string;
  description: string;
  fee: number;
  frequency: 'Monthly' | 'One-Time';
  students: number;
  collected: number;
  dues: number;
  lastPaymentDate?: string;
  nextDueDate?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupData {
  name: string;
  description?: string;
  fee: number;
  frequency: 'Monthly' | 'One-Time';
}

export const groupApi = {
  getAll: async (): Promise<Group[]> => {
    try {
      const response = await apiClient.get('/groups');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching groups:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch groups');
    }
  },

  getById: async (id: string): Promise<Group> => {
    try {
      const response = await apiClient.get(`/groups/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching group:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch group');
    }
  },

  create: async (groupData: CreateGroupData): Promise<Group> => {
    try {
      const response = await apiClient.post('/groups', groupData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating group:', error);
      throw new Error(error.response?.data?.message || 'Failed to create group');
    }
  },

  update: async (id: string, groupData: Partial<CreateGroupData>): Promise<Group> => {
    try {
      const response = await apiClient.patch(`/groups/${id}`, groupData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating group:', error);
      throw new Error(error.response?.data?.message || 'Failed to update group');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/groups/${id}`);
    } catch (error: any) {
      console.error('Error deleting group:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete group');
    }
  },

  // Add method to get group with student count
  getWithStats: async (id: string): Promise<Group> => {
    try {
      const response = await apiClient.get(`/groups/${id}/stats`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching group with stats:', error);
      // Fallback to regular getById if stats endpoint doesn't exist
      return await groupApi.getById(id);
    }
  },

  // Add method to get groups with updated counts
  getAllWithStats: async (): Promise<Group[]> => {
    try {
      const response = await apiClient.get('/groups?includeStats=true');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching groups with stats:', error);
      // Fallback to regular getAll if stats query doesn't exist
      return await groupApi.getAll();
    }
  },
};
