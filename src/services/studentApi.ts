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

export interface Student {
  _id: string;
  name: string;
  phone: string;
  group: {
    _id: string;
    name: string;
    fee: number;
    frequency: string;
  };
  feePlan: string;
  startDate: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentData {
  name: string;
  phone: string;
  group: string;
  feePlan?: string; // Make optional
  startDate: string;
}

export const studentApi = {
  getAll: async (): Promise<Student[]> => {
    try {
      const response = await apiClient.get('/students');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching students:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch students');
    }
  },

  getById: async (id: string): Promise<Student> => {
    try {
      const response = await apiClient.get(`/students/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching student:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch student');
    }
  },

  create: async (studentData: CreateStudentData): Promise<Student> => {
    try {
      const response = await apiClient.post('/students', studentData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating student:', error);
      throw new Error(error.response?.data?.message || 'Failed to create student');
    }
  },

  update: async (id: string, studentData: Partial<CreateStudentData>): Promise<Student> => {
    try {
      // Validate ID parameter
      if (!id) {
        console.error('Update failed: No student ID provided');
        throw new Error('No student selected for update');
      }
      
      // Ensure ID is properly formatted and not undefined
      const studentId = id.trim();
      if (!studentId) {
        console.error('Update failed: Student ID is empty');
        throw new Error('Invalid student ID');
      }
      
      console.log(`Updating student with ID: ${studentId}`, studentData);
      const response = await apiClient.put(`/students/${studentId}`, studentData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating student:', error);
      // Use the specific error message if available
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update student';
      throw new Error(errorMessage);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/students/${id}`);
    } catch (error: any) {
      console.error('Error deleting student:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete student');
    }
  },

  // Add method to get students by group
  getByGroup: async (groupId: string): Promise<Student[]> => {
    try {
      const response = await apiClient.get(`/students?group=${groupId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching students by group:', error);
      // Fallback to filtering all students
      const allStudents = await studentApi.getAll();
      return allStudents.filter(student => student.group?._id === groupId);
    }
  },

  // Add method to get student count by group
  getCountByGroup: async (groupId: string): Promise<number> => {
    try {
      const response = await apiClient.get(`/students/count?group=${groupId}`);
      return response.data.count;
    } catch (error: any) {
      console.error('Error fetching student count:', error);
      // Fallback to getting all and counting
      const students = await studentApi.getByGroup(groupId);
      return students.length;
    }
  },
};
