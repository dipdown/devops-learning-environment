import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [],
    loading: false,
    error: null,
    selectedUser: null
  }),
  actions: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/users`);
        this.users = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch users';
      } finally {
        this.loading = false;
      }
    },
    
    async fetchUser(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/users/${id}`);
        this.selectedUser = response.data;
        return this.selectedUser;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch user';
      } finally {
        this.loading = false;
      }
    },
    
    async createUser(userData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/users`, userData);
        this.users.push(response.data.user);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create user';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async updateUser(id, userData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/users/${id}`, userData);
        const index = this.users.findIndex(user => user.id === id);
        
        if (index !== -1) {
          this.users[index] = response.data.user;
        }
        
        this.selectedUser = response.data.user;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update user';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async deleteUser(id) {
      this.loading = true;
      this.error = null;
      
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/users/${id}`);
        this.users = this.users.filter(user => user.id !== id);
        
        if (this.selectedUser && this.selectedUser.id === id) {
          this.selectedUser = null;
        }
        
        return true;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete user';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
