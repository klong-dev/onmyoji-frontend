import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3020/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  verifyLicense: () => api.post('/auth/verify-license'),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Releases API (from GitHub)
export const releasesAPI = {
  getAll: (page = 1, limit = 10) => api.get(`/github/releases?page=${page}&limit=${limit}`),
  getLatest: () => api.get('/github/releases/latest'),
};

// Chat API
export const chatAPI = {
  getMessages: (limit = 50) => api.get(`/chat/messages?limit=${limit}`),
  sendMessage: (data) => api.post('/chat/messages', data),
  getOnlineCount: () => api.get('/chat/online'),
};

// Forum API
export const forumAPI = {
  getPosts: (page = 1, limit = 15, category = '', search = '') => 
    api.get(`/forum/posts?page=${page}&limit=${limit}&category=${category}&search=${search}`),
  getPost: (id) => api.get(`/forum/posts/${id}`),
  createPost: (data) => api.post('/forum/posts', data),
  updatePost: (id, data) => api.put(`/forum/posts/${id}`, data),
  deletePost: (id) => api.delete(`/forum/posts/${id}`),
  likePost: (id) => api.post(`/forum/posts/${id}/like`),
  getComments: (postId) => api.get(`/forum/posts/${postId}/comments`),
  createComment: (postId, data) => api.post(`/forum/posts/${postId}/comments`, data),
  deleteComment: (postId, commentId) => api.delete(`/forum/posts/${postId}/comments/${commentId}`),
};

// Wiki API
export const wikiAPI = {
  getArticles: (page = 1, limit = 20, category = '', search = '') => 
    api.get(`/wiki/articles?page=${page}&limit=${limit}&category=${category}&search=${search}`),
  getArticle: (slug) => api.get(`/wiki/articles/${slug}`),
  createArticle: (data) => api.post('/wiki/articles', data),
  updateArticle: (id, data) => api.put(`/wiki/articles/${id}`, data),
  getArticleHistory: (id) => api.get(`/wiki/articles/${id}/history`),
};

// Donation API
export const donationAPI = {
  getActive: () => api.get('/donation/active'),
  getRecentDonors: () => api.get('/donation/recent-donors'),
  createPayment: (data) => api.post('/donation/create-payment', data),
  checkPayment: (orderCode) => api.get(`/donation/check-payment/${orderCode}`),
  // Admin
  adminList: () => api.get('/donation/admin/list'),
  adminCreate: (data) => api.post('/donation/admin/create', data),
  adminUpdate: (id, data) => api.put(`/donation/admin/${id}`, data),
  adminDelete: (id) => api.delete(`/donation/admin/${id}`),
  adminGetTransactions: (id, page = 1) => api.get(`/donation/admin/${id}/transactions?page=${page}`),
  adminAddManual: (id, data) => api.post(`/donation/admin/${id}/add-manual`, data),
};

export default api;
