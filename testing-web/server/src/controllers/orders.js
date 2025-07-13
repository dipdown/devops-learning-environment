const { Order, User, Product } = require('../models');
const { Sequelize } = require('sequelize');

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Product, attributes: ['id', 'name', 'price'] }
      ]
    });
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Product, attributes: ['id', 'name', 'price'] }
      ]
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(200).json(order);
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    // Validate quantity
    if (!Number.isInteger(Number(quantity)) || quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be a positive integer' });
    }

    // Check if user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if there's enough stock
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    // Calculate total price
    const total_price = product.price * quantity;

    // Create order and update product stock in a transaction
    const result = await sequelize.transaction(async (t) => {
      // Create the order
      const order = await Order.create({
        user_id,
        product_id,
        quantity,
        total_price
      }, { transaction: t });

      // Update product stock
      await Product.update(
        { stock: product.stock - quantity },
        { where: { id: product_id }, transaction: t }
      );

      return order;
    });

    // Get the newly created order with related data
    const newOrder = await Order.findByPk(result.id, {
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Product, attributes: ['id', 'name', 'price'] }
      ]
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
  try {
    const { quantity } = req.body;
    const orderId = req.params.id;

    // Check if order exists
    const order = await Order.findByPk(orderId, {
      include: [{ model: Product }]
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Validate quantity
    if (!Number.isInteger(Number(quantity)) || quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be a positive integer' });
    }

    // Get the product
    const product = await Product.findByPk(order.product_id);

    // Check available stock (current stock + current order quantity - new quantity)
    const availableStock = product.stock + order.quantity;
    if (availableStock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    // Calculate new total price
    const total_price = product.price * quantity;

    // Update order and product stock in a transaction
    await sequelize.transaction(async (t) => {
      // Update product stock
      await Product.update(
        { stock: availableStock - quantity },
        { where: { id: order.product_id }, transaction: t }
      );

      // Update the order
      await Order.update(
        { quantity, total_price },
        { where: { id: orderId }, transaction: t }
      );
    });

    // Get updated order
    const updatedOrder = await Order.findByPk(orderId, {
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Product, attributes: ['id', 'name', 'price'] }
      ]
    });

    res.status(200).json({
      message: 'Order updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Check if order exists
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Delete order and restore product stock in a transaction
    await sequelize.transaction(async (t) => {
      // Restore product stock
      await Product.increment(
        { stock: order.quantity },
        { where: { id: order.product_id }, transaction: t }
      );

      // Delete the order
      await Order.destroy({
        where: { id: orderId },
        transaction: t
      });
    });

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
