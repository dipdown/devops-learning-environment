import { defineStore } from 'pinia';
import axios from 'axios';

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    loading: false,
    error: null,
    selectedProduct: null
  }),
  actions: {
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/products`);
        this.products = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch products';
      } finally {
        this.loading = false;
      }
    },
    
    async fetchProduct(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/products/${id}`);
        this.selectedProduct = response.data;
        return this.selectedProduct;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch product';
      } finally {
        this.loading = false;
      }
    },
    
    async createProduct(productData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/products`, productData);
        this.products.push(response.data.product);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create product';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async updateProduct(id, productData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/products/${id}`, productData);
        const index = this.products.findIndex(product => product.id === id);
        
        if (index !== -1) {
          this.products[index] = response.data.product;
        }
        
        this.selectedProduct = response.data.product;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update product';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async deleteProduct(id) {
      this.loading = true;
      this.error = null;
      
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/products/${id}`);
        this.products = this.products.filter(product => product.id !== id);
        
        if (this.selectedProduct && this.selectedProduct.id === id) {
          this.selectedProduct = null;
        }
        
        return true;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete product';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
