import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface FeePlan {
  _id: string;
  name: string;
  amount: number;
  frequency: 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly' | 'One-time';
  createdAt: string;
}

export interface CreateFeePlanData {
  name: string;
  amount: number;
  frequency: 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly' | 'One-time';
}

export const feePlanApi = {
  getAll: async (): Promise<FeePlan[]> => {
    try {
      const response = await apiClient.get('/fee-plans');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching fee plans:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch fee plans');
    }
  },

  create: async (data: CreateFeePlanData): Promise<FeePlan> => {
    try {
      const response = await apiClient.post('/fee-plans', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating fee plan:', error);
      throw new Error(error.response?.data?.error || 'Failed to create fee plan');
    }
  },

  update: async (id: string, data: Partial<CreateFeePlanData>): Promise<FeePlan> => {
    try {
      const response = await apiClient.patch(`/fee-plans/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating fee plan:', error);
      throw new Error(error.response?.data?.error || 'Failed to update fee plan');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/fee-plans/${id}`);
    } catch (error: any) {
      console.error('Error deleting fee plan:', error);
      throw new Error(error.response?.data?.error || 'Failed to delete fee plan');
    }
  },
};