import { defineStore } from 'pinia';
import axios from 'axios';

export const useOrderStore = defineStore('orders', {
  state: () => ({
    orders: [],
    loading: false,
    error: null,
    selectedOrder: null
  }),
  actions: {
    async fetchOrders() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/orders`);
        this.orders = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch orders';
      } finally {
        this.loading = false;
      }
    },
    
    async fetchOrder(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/orders/${id}`);
        this.selectedOrder = response.data;
        return this.selectedOrder;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch order';
      } finally {
        this.loading = false;
      }
    },
    
    async createOrder(orderData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/orders`, orderData);
        this.orders.push(response.data.order);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create order';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async updateOrder(id, orderData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/orders/${id}`, orderData);
        const index = this.orders.findIndex(order => order.id === id);
        
        if (index !== -1) {
          this.orders[index] = response.data.order;
        }
        
        this.selectedOrder = response.data.order;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update order';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async deleteOrder(id) {
      this.loading = true;
      this.error = null;
      
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/orders/${id}`);
        this.orders = this.orders.filter(order => order.id !== id);
        
        if (this.selectedOrder && this.selectedOrder.id === id) {
          this.selectedOrder = null;
        }
        
        return true;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete order';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
