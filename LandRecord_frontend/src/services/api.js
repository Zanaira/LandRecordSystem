// src/services/api.js

import axios from 'axios';
import { getToken } from '../utils/auth';

const API = axios.create({
  baseURL: `${REACT_APP_API_URL}`, // your backend URL
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = getToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
