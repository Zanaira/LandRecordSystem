// src/services/api.js
import axios from 'axios';
import { getToken } from '../utils/auth';

// Log the API URL to debug
console.log('API Base URL:', process.env.REACT_APP_API_URL);

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  withCredentials: true, // Important for cookies if you use them
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach token automatically
API.interceptors.request.use(
  (req) => {
    const token = getToken();
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Making request to:', req.baseURL + req.url); // Debug log
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;