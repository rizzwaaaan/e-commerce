// src/api.js

import axios from 'axios';

const API = axios.create({
  baseURL: 'https://e-commerce-ypyv.onrender.com/api', // Adjust if your backend runs on a different port
});

export const getProducts = () => API.get('/products');
export const getProductById = (id) => API.get(`/products/${id}`);
// Add more API calls for cart, orders, etc.