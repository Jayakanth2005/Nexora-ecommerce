import db from '../config/db.js';

/**
 * ReceiptModel class - Handles receipt storage and retrieval
 */
class ReceiptModel {
    static #getInsertStmt() {
        return db.prepare(`
            INSERT INTO Receipts (receiptId, name, email, total, cartItems, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
    }

    static #getSelectByReceiptIdStmt() {
        return db.prepare(`
            SELECT * FROM Receipts WHERE receiptId = ?
        `);
    }

    static #getSelectAllStmt() {
        return db.prepare(`
            SELECT * FROM Receipts ORDER BY timestamp DESC
        `);
    }

    /**
     * Create a new receipt
     * @param {Object} receiptData - Receipt information
     * @returns {Object} Created receipt
     */
    static create(receiptData) {
        try {
            const { receiptId, name, email, total, cartItems, timestamp } = receiptData;

            // Convert cartItems array to JSON string for storage
            const cartItemsJson = JSON.stringify(cartItems);

            const result = this.#getInsertStmt().run(
                receiptId,
                name,
                email,
                total,
                cartItemsJson,
                timestamp
            );

            return this.findByReceiptId(receiptId);
        } catch (error) {
            console.error('Error creating receipt:', error);
            throw error;
        }
    }

    /**
     * Find receipt by receipt ID
     * @param {string} receiptId - Receipt ID
     * @returns {Object|null} Receipt object or null if not found
     */
    static findByReceiptId(receiptId) {
        try {
            const receipt = this.#getSelectByReceiptIdStmt().get(receiptId);

            if (receipt && receipt.cartItems) {
                // Parse cartItems JSON back to array
                receipt.cartItems = JSON.parse(receipt.cartItems);
            }

            return receipt || null;
        } catch (error) {
            console.error('Error fetching receipt by ID:', error);
            throw error;
        }
    }

    /**
     * Get all receipts
     * @returns {Array} Array of all receipts
     */
    static findAll() {
        try {
            const receipts = this.#getSelectAllStmt().all();

            // Parse cartItems JSON for each receipt
            return receipts.map(receipt => {
                if (receipt.cartItems) {
                    receipt.cartItems = JSON.parse(receipt.cartItems);
                }
                return receipt;
            });
        } catch (error) {
            console.error('Error fetching all receipts:', error);
            throw error;
        }
    }

    /**
     * Initialize receipts table
     */
    static initTable() {
        try {
            const createTableStmt = db.prepare(`
                CREATE TABLE IF NOT EXISTS Receipts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    receiptId TEXT UNIQUE NOT NULL,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    total REAL NOT NULL,
                    cartItems TEXT NOT NULL,
                    timestamp TEXT NOT NULL,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            createTableStmt.run();
            console.log('Receipts table initialized successfully');
        } catch (error) {
            console.error('Error initializing receipts table:', error);
            throw error;
        }
    }
}

export default ReceiptModel;
