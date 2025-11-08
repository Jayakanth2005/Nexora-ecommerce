import axios from 'axios';

// Base API configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth tokens (future use)
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors
        if (error.response?.status === 401) {
            // Unauthorized - redirect to login (future implementation)
            localStorage.removeItem('authToken');
        } else if (error.response?.status >= 500) {
            // Server error
            console.error('Server error:', error.response?.data?.message || 'Something went wrong');
        } else if (error.code === 'ECONNABORTED') {
            // Timeout error
            console.error('Request timeout');
        } else if (!error.response) {
            // Network error
            console.error('Network error - please check your connection');
        }
        return Promise.reject(error);
    }
);

// Products API
export const productsAPI = {
    // Get all products
    getAll: async () => {
        try {
            const response = await apiClient.get('/products');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch products');
        }
    },

    // Get product by ID
    getById: async (id) => {
        try {
            const response = await apiClient.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch product');
        }
    },
};

// Cart API
export const cartAPI = {
    // Get cart items
    getCart: async () => {
        try {
            const response = await apiClient.get('/cart');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch cart');
        }
    },

    // Add item to cart
    addItem: async (productId, qty = 1) => {
        try {
            const response = await apiClient.post('/cart', {
                productId,
                qty,
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to add item to cart');
        }
    },

    // Update cart item quantity
    updateItem: async (cartItemId, qty) => {
        try {
            const response = await apiClient.put(`/cart/${cartItemId}`, {
                qty,
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update cart item');
        }
    },

    // Remove item from cart
    removeItem: async (cartItemId) => {
        try {
            const response = await apiClient.delete(`/cart/${cartItemId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to remove item from cart');
        }
    },

    // Clear entire cart
    clearCart: async () => {
        try {
            const response = await apiClient.delete('/cart');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to clear cart');
        }
    },
};

// Checkout API
export const checkoutAPI = {
    // Process checkout
    processCheckout: async (checkoutData) => {
        try {
            const response = await apiClient.post('/checkout', checkoutData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Checkout failed');
        }
    },
};

// Health check API
export const healthAPI = {
    check: async () => {
        try {
            const response = await apiClient.get('/health');
            return response.data;
        } catch (error) {
            throw new Error('Service unavailable');
        }
    },
};

export default apiClient;