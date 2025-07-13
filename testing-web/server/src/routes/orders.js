const express = require('express');
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
} = require('../controllers/orders');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all orders
router.get('/', getAllOrders);

// Get order by ID
router.get('/:id', getOrderById);

// Create new order
router.post('/', createOrder);

// Update order
router.put('/:id', updateOrder);

// Delete order
router.delete('/:id', deleteOrder);

module.exports = router;
