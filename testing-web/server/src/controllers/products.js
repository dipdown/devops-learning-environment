const { Product } = require('../models');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    // Validate price is a positive number
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }

    // Validate stock is a non-negative integer
    if (isNaN(stock) || stock < 0 || !Number.isInteger(Number(stock))) {
      return res.status(400).json({ message: 'Stock must be a non-negative integer' });
    }

    // Create the product
    const newProduct = await Product.create({
      name,
      price,
      stock
    });

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    const productId = req.params.id;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Validate price if provided
    if (price !== undefined && (isNaN(price) || price <= 0)) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }

    // Validate stock if provided
    if (stock !== undefined && (isNaN(stock) || stock < 0 || !Number.isInteger(Number(stock)))) {
      return res.status(400).json({ message: 'Stock must be a non-negative integer' });
    }

    // Update product data
    const updateData = {};
    if (name) updateData.name = name;
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;

    await Product.update(updateData, {
      where: { id: productId }
    });

    // Get updated product
    const updatedProduct = await Product.findByPk(productId);

    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete product
    await Product.destroy({
      where: { id: productId }
    });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
