const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USERNAME || 'zandi',
    password: process.env.DB_PASSWORD || 'zandi1201',
    database: process.env.DB_DATABASE || 'frozen_food_db'
});

const initializeDatabase = async () => {
    try {
        // Create users table
        await db.promise().query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(100) NOT NULL,
                role ENUM('owner', 'staff') NOT NULL DEFAULT 'staff',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Create transactions table
        await db.promise().query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                type ENUM('income', 'expense') NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                description TEXT,
                user_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        // Create default users if they don't exist
        const hashedOwnerPassword = await bcrypt.hash('owner123', 10);
        const hashedStaffPassword = await bcrypt.hash('staff123', 10);

        await db.promise().query(`
            INSERT IGNORE INTO users (username, password, name, role) VALUES 
            ('owner', ?, 'Pemilik', 'owner'),
            ('staff', ?, 'Staff', 'staff')
        `, [hashedOwnerPassword, hashedStaffPassword]);

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

initializeDatabase();

module.exports = db;