import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  verify: () => api.get('/auth/verify'),
};

export const pdfAPI = {
  upload: (formData: FormData) =>
    api.post('/pdf/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAll: () => api.get('/pdf'),
  getById: (id: string) => api.get(`/pdf/${id}`),
  delete: (id: string) => api.delete(`/pdf/${id}`),
};

export const highlightAPI = {
  create: (highlight: Omit<Highlight, 'id' | 'createdAt'>) =>
    api.post('/highlights', highlight),
  getByPdfId: (pdfId: string) => api.get(`/highlights/pdf/${pdfId}`),
  update: (id: string, highlight: Partial<Highlight>) =>
    api.put(`/highlights/${id}`, highlight),
  delete: (id: string) => api.delete(`/highlights/${id}`),
};

export default api;
