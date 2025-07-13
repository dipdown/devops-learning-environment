-- Create database and tables for the application
CREATE DATABASE IF NOT EXISTS devops_app;
USE devops_app;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert sample users
INSERT INTO users (name, email, password) VALUES
('Admin User', 'admin@example.com', '$2a$10$oHLEzPH4dxNqEbYZTSDJR.ubJX1wJ8PTMz7gCgrlL3gglqKmvsdUi'), -- password: admin123
('Test User', 'test@example.com', '$2a$10$R7ZjN5.yaX.ThcyeV9g9sO32ZlbS6smhUTLEBjVopAWl9/jy5pGRe'), -- password: test123
('John Doe', 'john@example.com', '$2b$10$7JfKzJJDnK5vN9HzKJ3X3OxCuMZ.PJyCgRRQGBYp.6e4Cw6WW3wJy'), -- password: password123
('Jane Smith', 'jane@example.com', '$2b$10$7JfKzJJDnK5vN9HzKJ3X3OxCuMZ.PJyCgRRQGBYp.6e4Cw6WW3wJy'), -- password: password123
('Bob Johnson', 'bob@example.com', '$2b$10$7JfKzJJDnK5vN9HzKJ3X3OxCuMZ.PJyCgRRQGBYp.6e4Cw6WW3wJy'); -- password: password123

-- Insert sample products
INSERT INTO products (name, price, stock) VALUES
('Laptop', 1200.00, 10),
('Smartphone', 800.00, 15),
('Headphones', 100.00, 20),
('Monitor', 300.00, 8),
('Keyboard', 50.00, 25);

-- Insert sample orders
INSERT INTO orders (user_id, product_id, quantity, total_price) VALUES
(1, 1, 1, 1200.00),
(1, 3, 2, 200.00),
(2, 2, 1, 800.00),
(3, 4, 1, 300.00),
(2, 5, 2, 100.00);
