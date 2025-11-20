import axios from 'axios';

// Create an instance of axios to avoid repeating the base URL
const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api/auth', // Your backend URL
});

export const loginUser = async (credentials) => {
    try {
        const response = await apiClient.post('/login', credentials);
        console.log(response.data);
        return response.data;
    } catch (error) {
        // Axios wraps the error response in error.response
        throw new Error(error.response?.data?.message || 'Failed to login');
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await apiClient.post('/register', userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to register');
    }
};