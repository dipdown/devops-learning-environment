import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user
  },
  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/auth/login`, credentials);
        this.token = response.data.token;
        this.user = response.data.user;
        
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
        
        this.setupAxiosInterceptors();
        return true;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to login';
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    async register(userData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/auth/register`, userData);
        return true;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to register';
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchCurrentUser() {
      if (!this.token) return;
      
      this.loading = true;
      
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/auth/me`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        
        this.user = response.data;
        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (error) {
        if (error.response?.status === 401) {
          this.logout();
        }
      } finally {
        this.loading = false;
      }
    },
    
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    
    setupAxiosInterceptors() {
      axios.interceptors.request.use(
        config => {
          if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
          }
          return config;
        },
        error => {
          return Promise.reject(error);
        }
      );
      
      axios.interceptors.response.use(
        response => response,
        error => {
          if (error.response?.status === 401) {
            this.logout();
          }
          return Promise.reject(error);
        }
      );
    }
  }
});
