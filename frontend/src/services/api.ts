import axios, { InternalAxiosRequestConfig } from 'axios';
import {
  Machine,
  User,
  LoginCredentials,
  SignupCredentials,
  AuthResponse,
  ExecuteCodeRequest,
  ExecuteCodeResponse,
} from '../types';

const API_URL = process.env.API_URL;

console.log('API Configuration:', {
  API_URL,
  NODE_ENV: process.env.NODE_ENV
});

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Request config:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data
  });
  return config;
});

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login/', credentials);
    return response.data;
  },

  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup/', credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

export const machineAPI = {
  getAll: async (): Promise<Machine[]> => {
    const response = await api.get<Machine[]>('/machines/');
    return response.data;
  },

  getOne: async (id: string): Promise<Machine> => {
    const response = await api.get<Machine>(`/machines/${id}/`);
    return response.data;
  },

  create: async (machine: Omit<Machine, 'id' | 'user' | 'created_at' | 'updated_at'>): Promise<Machine> => {
    console.log('Creating machine with data:', machine);
    const response = await api.post<Machine>('/machines/', machine);
    return response.data;
  },

  update: async (id: string, machine: Partial<Machine>): Promise<Machine> => {
    const response = await api.put<Machine>(`/machines/${id}/`, machine);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/machines/${id}/`);
  },
};

export const profileAPI = {
  get: async (): Promise<User> => {
    const response = await api.get<User>('/profile/');
    return response.data;
  },
};

export const codeAPI = {
  execute: async (
    payload: ExecuteCodeRequest
  ): Promise<ExecuteCodeResponse> => {
    const response = await api.post<ExecuteCodeResponse>(
      '/execute/',
      payload
    );
    return response.data;
  },
};

export default api;
