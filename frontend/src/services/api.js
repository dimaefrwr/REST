import axios from 'axios';


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Utworzenie instancji axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



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

// AUTH API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me')
};

// USERS API
export const usersAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`)
};

// AUCTIONS API
export const auctionsAPI = {
  getAllAuctions: (params) => api.get('/auctions', { params }),
  getAuctionById: (id) => api.get(`/auctions/${id}`),
  createAuction: (auctionData) => api.post('/auctions', auctionData),
  updateAuction: (id, auctionData) => api.put(`/auctions/${id}`, auctionData),
  deleteAuction: (id) => api.delete(`/auctions/${id}`),
  getMyAuctions: () => api.get('/auctions/my-auctions'),
  cancelAuction: (id) => api.put(`/auctions/${id}/cancel`)
};

// BIDS API
export const bidsAPI = {
  placeBid: (auctionId, bidData) => api.post(`/auctions/${auctionId}/bids`, bidData),
  getAuctionBids: (auctionId) => api.get(`/auctions/${auctionId}/bids`),
  getMyBids: () => api.get('/bids/my-bids'),
  getBidById: (id) => api.get(`/bids/${id}`)
};

export default api;