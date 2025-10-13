// src/api.js

import axios from 'axios';

// --- ADD THIS LINE ---
const API_BASE_URL = 'http://localhost:5000'; 
// ---------------------

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`, // Use the variable here as well for consistency
});

const getToken = () => sessionStorage.getItem('authToken');

export const getProducts = () => API.get('/products');
export const getProductById = (id) => API.get(`/products/${id}`);
export const getSuggestions = async (searchTerm) => {
    if (!searchTerm) return [];
    try {
        // NOTE: This assumes your backend has a route like /api/products/suggestions
        const response = await fetch(`${API_BASE_URL}/api/products/suggestions?q=${encodeURIComponent(searchTerm)}`);
        
        if (!response.ok) {
            // If the suggestions route isn't implemented, return an empty array gracefully
            if (response.status === 404) {
                 console.warn("Backend suggestions endpoint not found (404). Check server route.");
                 return [];
            }
            throw new Error('Failed to fetch suggestions');
        }
        
        const data = await response.json();
        // Assuming the backend returns an array of strings (e.g., ["T-Shirt", "Jeans"])
        return data; 
    } catch (error) {
        console.error('API Error fetching suggestions:', error);
        return [];
    }
};

// Add more API calls for cart, orders, etc.
export const loginUser = async (username, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        if (!response.ok) {
            throw new Error('Login failed');
        }
        const data = await response.json();
        // IMPORTANT: Store the token and role for subsequent requests/routing
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userRole', data.user.role);
        return data.user;
    } catch (error) {
        console.error('API Error during login:', error);
        throw error;
    }
};


// --- Admin Product CRUD (Protected) ---

// Helper for protected requests
const protectedFetch = async (url, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        Authorization: `Bearer ${token}`,
    };
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Request failed: ${response.status} - ${errorText}`);
    }
    return response.json();
};
export const fetchProducts = () =>
    protectedFetch(`${API_BASE_URL}/api/products`, {
        method: 'GET', // Explicitly use GET method
    });

    

// Create Product
export const createProduct = (productData) =>
    protectedFetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        body: JSON.stringify(productData),
    });

// Update Product
export const updateProduct = (id, productData) =>
    protectedFetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
    });

// Delete Product
export const deleteProduct = (id) =>
    protectedFetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
    }).then(() => ({ success: true, message: "Product deleted" }));