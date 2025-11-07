import ReceiptModel from '../models/ReceiptModel.js';

/**
 * Initialize database tables
 */
export function initDatabase() {
    try {
        // Initialize receipts table
        ReceiptModel.initTable();
        console.log('Database initialization completed');
    } catch (error) {
        console.error('Database initialization failed:', error);
        throw error;
    }
}
