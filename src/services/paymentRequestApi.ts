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

export interface PaymentRequest {
  updatedAt: string;
  _id: string;
  student: {
    _id: string;
    name: string;
    phone: string;
    group?: {
      _id: string;
      name: string;
      fee: number;
      frequency: string;
    };
  };
  feePlan?: {
    _id: string;
    name: string;
    amount: number;
    frequency: string;
  };
  group?: {
    _id: string;
    name: string;
    fee: number;
    frequency: string;
  };
  amount: number;
  status: 'Pending' | 'Paid' | 'Overdue';
  dueDate: string;
  paidAt?: string;
  createdAt: string;
}

export interface CreatePaymentRequestData {
  student: string;
  feePlan?: string; // Make this truly optional
  dueDate: string;
}

export const paymentRequestApi = {
  getAll: async (): Promise<PaymentRequest[]> => {
    try {
      const response = await apiClient.get('/payment-requests');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching payment requests:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch payment requests');
    }
  },

  create: async (data: CreatePaymentRequestData): Promise<PaymentRequest> => {
    try {
      // Clean the data to remove empty strings
      const cleanData = {
        student: data.student,
        dueDate: data.dueDate,
        ...(data.feePlan && data.feePlan.trim() !== '' && { feePlan: data.feePlan })
      };
      
      const response = await apiClient.post('/payment-requests', cleanData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating payment request:', error);
      throw new Error(error.response?.data?.error || 'Failed to create payment request');
    }
  },

  update: async (id: string, data: Partial<PaymentRequest>): Promise<PaymentRequest> => {
    try {
      const response = await apiClient.put(`/payment-requests/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating payment request:', error);
      throw new Error(error.response?.data?.error || 'Failed to update payment request');
    }
  },
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/payment-requests/${id}`);
    } catch (error: any) {
      console.error('Error deleting payment request:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete payment request');
    }
  },

  // Bulk create payment requests for multiple students
  createBulk: async (requests: CreatePaymentRequestData[]): Promise<PaymentRequest[]> => {
    try {
      const response = await apiClient.post('/payment-requests/bulk', { requests });
      return response.data;
    } catch (error: any) {
      console.error('Error creating bulk payment requests:', error);
      throw new Error(error.response?.data?.message || 'Failed to create payment requests');
    }
  },

  // Add method to create payment requests for a group
  createGroupPaymentRequests: async (groupId: string, feePlanId: string, dueDate: string): Promise<PaymentRequest[]> => {
    try {
      const response = await apiClient.post('/payment-requests/group', {
        groupId,
        feePlanId,
        dueDate
      });
      return response.data;
    } catch (error: any) {
      console.error('Error creating group payment requests:', error);
      throw new Error(error.response?.data?.message || 'Failed to create group payment requests');
    }
  },
};
