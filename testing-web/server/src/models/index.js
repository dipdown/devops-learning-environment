const { Sequelize } = require('sequelize');

// Get database configuration from environment variables
const DB_HOST = process.env.DB_HOST || 'mysql';
const DB_PORT = process.env.DB_PORT || '3306';
const DB_NAME = process.env.DB_NAME || 'devops_app';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'root';

// Initialize Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
});

// Import models
const UserModel = require('./user');
const ProductModel = require('./product');
const OrderModel = require('./order');

// Initialize models
const User = UserModel(sequelize, Sequelize);
const Product = ProductModel(sequelize, Sequelize);
const Order = OrderModel(sequelize, Sequelize);

// Define associations
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

Product.hasMany(Order, { foreignKey: 'product_id' });
Order.belongsTo(Product, { foreignKey: 'product_id' });

// Export models and Sequelize instance
module.exports = {
  sequelize,
  Sequelize,
  User,
  Product,
  Order
};
