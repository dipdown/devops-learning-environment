const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/products');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get all products (public route)
router.get('/', getAllProducts);

// Get product by ID (public route)
router.get('/:id', getProductById);

// Protected routes
// Apply auth middleware to create, update and delete routes
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;
