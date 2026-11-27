import axios from 'axios';

// Base API URL (can be customized via environment variable)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Convert backend upload paths (for example /uploads/logo.png) into browser URLs.
export const resolveAssetUrl = (url) => {
  if (!url) return '';
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  const origin = API_URL.replace(/\/api\/?$/, '');
  return `${origin}${url.startsWith('/') ? url : `/${url}`}`;
};

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Request interceptor: attach JWT Bearer token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eventsphere_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: extract cleaner error message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network or server error occurred.';
    return Promise.reject(new Error(message));
  }
);

// ==========================================
// 1. Authentication APIs
// ==========================================
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword })
};

// ==========================================
// 2. Expo APIs
// ==========================================
export const expoAPI = {
  getAll: (params) => api.get('/expos', { params }),
  getById: (id) => api.get(`/expos/${id}`),
  create: (data) => api.post('/expos', data),
  update: (id, data) => api.put(`/expos/${id}`, data),
  delete: (id) => api.delete(`/expos/${id}`)
};

// ==========================================
// 3. Exhibitor APIs
// ==========================================
export const exhibitorAPI = {
  getAll: (params) => api.get('/exhibitors', { params }),
  getById: (id) => api.get(`/exhibitors/${id}`),
  updateProfile: (id, data) => api.put(`/exhibitors/${id}`, data),
  addProduct: (id, product) => api.post(`/exhibitors/${id}/products`, product),
  removeProduct: (id, productId) => api.delete(`/exhibitors/${id}/products/${productId}`),
  addStaff: (id, staffMember) => api.post(`/exhibitors/${id}/staff`, staffMember),
  removeStaff: (id, staffId) => api.delete(`/exhibitors/${id}/staff/${staffId}`),
  uploadAsset: (id, formData) =>
    api.post(`/exhibitors/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  approve: (id) => api.patch(`/exhibitors/${id}/approve`),
  reject: (id) => api.patch(`/exhibitors/${id}/reject`)
};

// ==========================================
// 4. Booth APIs
// ==========================================
export const boothAPI = {
  getAll: (params) => api.get('/booths', { params }),
  getById: (id) => api.get(`/booths/${id}`),
  book: (id, bookingData) => api.post(`/booths/${id}/book`, bookingData),
  updateStatus: (id, statusData) => api.put(`/booths/${id}/status`, statusData)
};

// ==========================================
// 5. Registration & Ticket APIs
// ==========================================
export const registrationAPI = {
  register: (registrationData) => api.post('/registrations', registrationData),
  getMy: () => api.get('/registrations/my'),
  getAll: (params) => api.get('/registrations', { params }),
  getById: (id) => api.get(`/registrations/${id}`),
  toggleCheckIn: (id) => api.patch(`/registrations/${id}/checkin`)
};

// ==========================================
// 6. Application APIs (Exhibitor Space)
// ==========================================
export const applicationAPI = {
  apply: (applicationData) => api.post('/applications', applicationData),
  getMy: () => api.get('/applications/my'),
  getAll: (params) => api.get('/applications', { params }),
  updateStatus: (id, statusData) => api.patch(`/applications/${id}/status`, statusData)
};

// ==========================================
// 7. Schedule & Agenda APIs
// ==========================================
export const scheduleAPI = {
  getAll: (params) => api.get('/schedule', { params }),
  getById: (id) => api.get(`/schedule/${id}`),
  create: (sessionData) => api.post('/schedule', sessionData),
  update: (id, sessionData) => api.put(`/schedule/${id}`, sessionData),
  delete: (id) => api.delete(`/schedule/${id}`),
  enroll: (id) => api.post(`/schedule/${id}/enroll`)
};

// ==========================================
// 8. Bookmark APIs
// ==========================================
export const bookmarkAPI = {
  getMy: () => api.get('/bookmarks'),
  toggle: (sessionId) => api.post(`/bookmarks/${sessionId}`)
};

// ==========================================
// 9. Message & Inquiry APIs
// ==========================================
export const messageAPI = {
  getAll: () => api.get('/messages'),
  getById: (id) => api.get(`/messages/${id}`),
  send: (messageData) => api.post('/messages', messageData),
  reply: (id, replyData) => api.post(`/messages/${id}/reply`, replyData)
};

// ==========================================
// 10. Notification APIs
// ==========================================
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all')
};

// ==========================================
// 11. Feedback APIs
// ==========================================
export const feedbackAPI = {
  getAll: (params) => api.get('/feedback', { params }),
  submit: (feedbackData) => api.post('/feedback', feedbackData)
};

// ==========================================
// 12. Analytics APIs (Admin Dashboard)
// ==========================================
export const analyticsAPI = {
  getOverview: () => api.get('/analytics/overview'),
  getCharts: () => api.get('/analytics/charts')
};

// ==========================================
// 13. User Management APIs
// ==========================================
export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  delete: (id) => api.delete(`/users/${id}`)
};
