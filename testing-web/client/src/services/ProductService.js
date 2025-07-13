import axios from 'axios';
import { API_URL } from '@/config';

export default class ProductService {
    constructor() {
        this.baseUrl = `${API_URL}/api/products`;
    }

    /**
     * Get all products
     * @returns {Promise} Promise with all products
     */
    getAll() {
        return axios.get(this.baseUrl);
    }

    /**
     * Get a specific product by ID
     * @param {number} id - Product ID
     * @returns {Promise} Promise with the product data
     */
    getById(id) {
        return axios.get(`${this.baseUrl}/${id}`);
    }

    /**
     * Create a new product
     * @param {Object} product - Product data
     * @returns {Promise} Promise with the created product
     */
    create(product) {
        return axios.post(this.baseUrl, product);
    }

    /**
     * Update an existing product
     * @param {number} id - Product ID
     * @param {Object} product - Updated product data
     * @returns {Promise} Promise with the updated product
     */
    update(id, product) {
        return axios.put(`${this.baseUrl}/${id}`, product);
    }

    /**
     * Delete a product
     * @param {number} id - Product ID
     * @returns {Promise} Promise with deletion confirmation
     */
    delete(id) {
        return axios.delete(`${this.baseUrl}/${id}`);
    }

    /**
     * Get products by category
     * @param {string} category - Category name
     * @returns {Promise} Promise with filtered products
     */
    getByCategory(category) {
        return axios.get(`${this.baseUrl}/category/${category}`);
    }

    /**
     * Search products by name or description
     * @param {string} query - Search query
     * @returns {Promise} Promise with search results
     */
    search(query) {
        return axios.get(`${this.baseUrl}/search`, {
            params: { q: query }
        });
    }

    /**
     * Get inventory status statistics
     * @returns {Promise} Promise with inventory statistics
     */
    getInventoryStats() {
        return axios.get(`${this.baseUrl}/stats/inventory`);
    }
}
