import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Change this to your computer's IP address when testing on physical device
// For emulator, use 10.0.2.2 (Android) or localhost (iOS)
const BASE_URL = 'http://10.0.2.2:8080/api'; // Android Emulator
// const BASE_URL = 'http://localhost:8080/api'; // iOS Simulator
// const BASE_URL = 'http://192.168.1.X:8080/api'; // Physical Device (replace X with your IP)

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    city: string;
    region: string;
    schoolId?: number;
  }) => {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      await AsyncStorage.setItem('jwt_token', response.data.token);
      await AsyncStorage.setItem('user_email', response.data.email);
      await AsyncStorage.setItem('user_name', response.data.name);
    }
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      await AsyncStorage.setItem('jwt_token', response.data.token);
      await AsyncStorage.setItem('user_email', response.data.email);
      await AsyncStorage.setItem('user_name', response.data.name);
    }
    return response.data;
  },

  logout: async () => {
    await AsyncStorage.removeItem('jwt_token');
    await AsyncStorage.removeItem('user_email');
    await AsyncStorage.removeItem('user_name');
  },

  getCurrentUser: async () => {
    const email = await AsyncStorage.getItem('user_email');
    const name = await AsyncStorage.getItem('user_name');
    return { email, name };
  },
};

// Documents API (placeholder for future implementation)
export const documentsAPI = {
  search: async (filters: any) => {
    const response = await api.get('/documents/search', { params: filters });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },
};

// Networks API
export const networksAPI = {
  getAll: async () => {
    const response = await api.get('/networks');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/networks/${id}`);
    return response.data;
  },
  
  getByType: async (type: string) => {
    const response = await api.get(`/networks/type/${type}`);
    return response.data;
  }
};

export default api;
