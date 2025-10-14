-- Create database
CREATE DATABASE IF NOT EXISTS frozen_food_db;
USE frozen_food_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('owner', 'staff') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(50) PRIMARY KEY,
    type ENUM('penjualan', 'pengeluaran') NOT NULL,
    date DATE NOT NULL,
    product VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    total DECIMAL(12, 2) NOT NULL,
    note TEXT,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert default owner account
INSERT INTO users (username, name, password, role) VALUES
('owner', 'Pemilik', '$2a$10$XfxTTmPL9O8jR7ZXuM4XKOj7jYqK1knJx4KrKQhPZU7P1oRqGGnie', 'owner')
ON DUPLICATE KEY UPDATE username=username;
-- Note: password is 'owner123' hashed with bcrypt