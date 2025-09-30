import axios, { AxiosError, AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = (error.config ?? {}) as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
          const { access_token, refresh_token } = response.data;
          
          const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
          storage.setItem('token', access_token);
          
          if (refresh_token) {
            storage.setItem('refreshToken', refresh_token);
          }
          
          const headers = (originalRequest.headers ??= {} as Record<string, string>);
          headers.Authorization = `Bearer ${access_token}`;
          
          return api(originalRequest);
        }
      } catch (error) {
        ['localStorage', 'sessionStorage'].forEach((storageType) => {
          try {
            const storage = window[storageType as 'localStorage' | 'sessionStorage'];
            storage.removeItem('token');
            storage.removeItem('refreshToken');
          } catch (e) {
            console.error(`Error clearing ${storageType}:`, e);
          }
        });
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
