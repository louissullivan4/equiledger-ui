import axios from 'axios';
import { env } from '../config/env';

const apiUrl = env.apiUrl;

const AuthService = {
    async login(email, password) {
        try {
            const response = await axios.post(`${apiUrl}/login`, { email, password });
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
                return { status_code: 200, message: 'Login successful' };
            } else {
                return { status_code: 401, message: 'Login failed' };
            }
        } catch (error) {
            return { status_code: 500, message: 'Login failed' };
        }
    }, 

    async signup(email, password, token) {
        try {
            const response = await axios.post(`${apiUrl}/signup`, { email, password, token });
            if (response.status === 201) {
                return { status_code: 201, message: 'Signup successful' };
            } else {
                return { status_code: 500, message: 'Signup failed' };
            }
        } catch (error) {
            return { status_code: 500, message: 'Signup failed' };
        }
    },

    logout() {
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
};

export default AuthService;