import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo')) 
    : null;
  if (userInfo?.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const layoutService = {
  getAll: () => api.get('/layouts'),
  getById: (id) => api.get(`/layouts/${id}`),
  getMine: () => api.get('/layouts/my'),
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/layouts/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: (id, data) => api.put(`/layouts/${id}`, data),
  create: (data) => api.post('/layouts', data),
};

export const plotService = {
  getByLayout: (layoutId) => api.get(`/plots/layout/${layoutId}`),
  create: (data) => api.post('/plots', data),
  update: (id, data) => api.put(`/plots/${id}`, data),
};

export const bookingService = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/mybookings'),
  getOwnerBookings: () => api.get('/bookings/owner'),
  updateStatus: (id, data) => api.put(`/bookings/${id}/status`, data),
};

export default api;
