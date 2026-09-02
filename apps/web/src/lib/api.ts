import axios from 'axios';
import { APP_CONFIG } from '@/config/app';
import { getAuth } from 'firebase/auth';
import { auth } from './firebase';

const api = axios.create({
  baseURL: APP_CONFIG.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const user = auth?.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle global errors, token refresh if needed.
    // For 401s, firebase handles its own token refresh usually,
    // but you might want to redirect to login if session is truly dead.
    return Promise.reject(error);
  }
);

export const get = async <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
  const response = await api.get<T>(url, { params });
  return response.data;
};

export const post = async <T>(url: string, data?: unknown): Promise<T> => {
  const response = await api.post<T>(url, data);
  return response.data;
};

export const patch = async <T>(url: string, data?: unknown): Promise<T> => {
  const response = await api.patch<T>(url, data);
  return response.data;
};

export const del = async <T>(url: string): Promise<T> => {
  const response = await api.delete<T>(url);
  return response.data;
};

export default api;
