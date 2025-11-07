import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create database path - store in project root/data directory
const dbPath = join(__dirname, '../../data/database.sqlite');

// Create singleton database connection
const db = new Database(dbPath, {
    verbose: process.env.NODE_ENV === 'development' ? console.log : null
});

// Enable foreign key constraints
db.pragma('foreign_keys = ON');

// Initialize database tables
const initializeDatabase = () => {
    // Skip initialization in test environment
    if (process.env.NODE_ENV === 'test') {
        console.log('Skipping database initialization in test environment');
        return;
    }

    try {
        // Create Products table
        const createProductsTable = db.prepare(`
            CREATE TABLE IF NOT EXISTS Products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL CHECK(price >= 0),
                imageUrl TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create CartItems table
        const createCartItemsTable = db.prepare(`
            CREATE TABLE IF NOT EXISTS CartItems (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                productId INTEGER NOT NULL,
                qty INTEGER NOT NULL CHECK(qty > 0),
                subtotal REAL NOT NULL CHECK(subtotal >= 0),
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE
            )
        `);

        // Execute table creation in a transaction
        const transaction = db.transaction(() => {
            createProductsTable.run();
            createCartItemsTable.run();
        });

        transaction();

        console.log('Database tables initialized successfully');
    } catch (error) {
        console.error('Error initializing database tables:', error);
        throw error;
    }
};

// Initialize database on first import (except in tests)
if (process.env.NODE_ENV !== 'test') {
    initializeDatabase();
}

// Graceful shutdown handler
process.on('exit', () => {
    db.close();
});

process.on('SIGINT', () => {
    db.close();
    process.exit(0);
});

process.on('SIGTERM', () => {
    db.close();
    process.exit(0);
});

export default db;
