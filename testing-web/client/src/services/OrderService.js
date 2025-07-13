import axios from 'axios';
import { API_URL } from '@/config';

export default class OrderService {
    constructor() {
        this.baseUrl = `${API_URL}/api/orders`;
    }

    /**
     * Get all orders
     * @returns {Promise} Promise with all orders
     */
    getAll() {
        return axios.get(this.baseUrl);
    }

    /**
     * Get a specific order by ID
     * @param {number} id - Order ID
     * @returns {Promise} Promise with the order data
     */
    getById(id) {
        return axios.get(`${this.baseUrl}/${id}`);
    }

    /**
     * Create a new order
     * @param {Object} order - Order data
     * @returns {Promise} Promise with the created order
     */
    create(order) {
        return axios.post(this.baseUrl, order);
    }

    /**
     * Update an existing order
     * @param {number} id - Order ID
     * @param {Object} order - Updated order data
     * @returns {Promise} Promise with the updated order
     */
    update(id, order) {
        return axios.put(`${this.baseUrl}/${id}`, order);
    }

    /**
     * Delete an order
     * @param {number} id - Order ID
     * @returns {Promise} Promise with deletion confirmation
     */
    delete(id) {
        return axios.delete(`${this.baseUrl}/${id}`);
    }

    /**
     * Get orders by customer
     * @param {string} customerId - Customer ID
     * @returns {Promise} Promise with filtered orders
     */
    getByCustomer(customerId) {
        return axios.get(`${this.baseUrl}/customer/${customerId}`);
    }

    /**
     * Get orders by status
     * @param {string} status - Order status
     * @returns {Promise} Promise with filtered orders
     */
    getByStatus(status) {
        return axios.get(`${this.baseUrl}/status/${status}`);
    }

    /**
     * Search orders
     * @param {string} query - Search query
     * @returns {Promise} Promise with search results
     */
    search(query) {
        return axios.get(`${this.baseUrl}/search`, {
            params: { q: query }
        });
    }

    /**
     * Get order statistics 
     * @returns {Promise} Promise with order statistics
     */
    getStatistics() {
        return axios.get(`${this.baseUrl}/statistics`);
    }

    /**
     * Get orders between date range
     * @param {string} startDate - Start date in ISO format
     * @param {string} endDate - End date in ISO format
     * @returns {Promise} Promise with filtered orders
     */
    getByDateRange(startDate, endDate) {
        return axios.get(`${this.baseUrl}/date-range`, {
            params: { startDate, endDate }
        });
    }
}
