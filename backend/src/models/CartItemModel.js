import db from '../config/db.js';
import ProductModel from './ProductModel.js';

/**
 * CartItemModel class - Encapsulates all database operations for CartItems
 * Uses prepared statements for optimal performance and security
 */
class CartItemModel {
    // Helper method to get prepared statements (works in both test and production)
    static #getInsertStmt() {
        return db.prepare(`
            INSERT INTO CartItems (productId, qty, subtotal)
            VALUES (?, ?, ?)
        `);
    }

    static #getSelectAllStmt() {
        return db.prepare(`
            SELECT 
                ci.*,
                p.name as productName,
                p.description as productDescription,
                p.price as productPrice,
                p.imageUrl as productImageUrl
            FROM CartItems ci
            JOIN Products p ON ci.productId = p.id
            ORDER BY ci.createdAt DESC
        `);
    }

    static #getSelectByIdStmt() {
        return db.prepare(`
            SELECT 
                ci.*,
                p.name as productName,
                p.description as productDescription,
                p.price as productPrice,
                p.imageUrl as productImageUrl
            FROM CartItems ci
            JOIN Products p ON ci.productId = p.id
            WHERE ci.id = ?
        `);
    }

    static #getSelectByProductIdStmt() {
        return db.prepare(`
            SELECT * FROM CartItems WHERE productId = ?
        `);
    }

    static #getUpdateStmt() {
        return db.prepare(`
            UPDATE CartItems 
            SET qty = ?, subtotal = ?, updatedAt = CURRENT_TIMESTAMP
            WHERE id = ?
        `);
    }

    static #getDeleteStmt() {
        return db.prepare(`
            DELETE FROM CartItems WHERE id = ?
        `);
    }

    static #getDeleteByProductIdStmt() {
        return db.prepare(`
            DELETE FROM CartItems WHERE productId = ?
        `);
    }

    static #getCountStmt() {
        return db.prepare(`
            SELECT COUNT(*) as count FROM CartItems
        `);
    }

    static #getTotalValueStmt() {
        return db.prepare(`
            SELECT SUM(subtotal) as total FROM CartItems
        `);
    }

    /**
     * Add an item to cart or update quantity if exists
     * @param {Object} cartItemData - Cart item information
     * @param {number} cartItemData.productId - Product ID
     * @param {number} cartItemData.qty - Quantity
     * @returns {Object} Created or updated cart item
     */
    static addToCart(cartItemData) {
        try {
            const { productId, qty } = cartItemData;

            // Validate required fields
            if (!productId || !qty || isNaN(productId) || isNaN(qty)) {
                throw new Error('Valid productId and qty are required');
            }

            if (qty <= 0) {
                throw new Error('Quantity must be greater than 0');
            }

            // Check if product exists
            const product = ProductModel.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            // Check if item already exists in cart
            const existingItem = this.#getSelectByProductIdStmt().get(productId);

            if (existingItem) {
                // Update existing item
                const newQty = existingItem.qty + qty;
                const newSubtotal = newQty * product.price;
                return this.update(existingItem.id, { qty: newQty, subtotal: newSubtotal });
            } else {
                // Create new cart item
                const subtotal = qty * product.price;
                const result = this.#getInsertStmt().run(productId, qty, subtotal);
                return this.findById(result.lastInsertRowid);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    }

    /**
     * Create a new cart item (direct creation without checking existing)
     * @param {Object} cartItemData - Cart item information
     * @param {number} cartItemData.productId - Product ID
     * @param {number} cartItemData.qty - Quantity
     * @returns {Object} Created cart item
     */
    static create(cartItemData) {
        try {
            const { productId, qty } = cartItemData;

            // Validate required fields
            if (!productId || !qty || isNaN(productId) || isNaN(qty)) {
                throw new Error('Valid productId and qty are required');
            }

            if (qty <= 0) {
                throw new Error('Quantity must be greater than 0');
            }

            // Check if product exists
            const product = ProductModel.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            const subtotal = qty * product.price;
            const result = this.#getInsertStmt().run(productId, qty, subtotal);

            return this.findById(result.lastInsertRowid);
        } catch (error) {
            console.error('Error creating cart item:', error);
            throw error;
        }
    }

    /**
     * Get all cart items with product details
     * @returns {Array} Array of all cart items with product information
     */
    static findAll() {
        try {
            return this.#getSelectAllStmt().all();
        } catch (error) {
            console.error('Error fetching all cart items:', error);
            throw error;
        }
    }

    /**
     * Find cart item by ID with product details
     * @param {number} id - Cart item ID
     * @returns {Object|null} Cart item object with product details or null if not found
     */
    static findById(id) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('Valid cart item ID is required');
            }

            return this.#getSelectByIdStmt().get(id) || null;
        } catch (error) {
            console.error('Error fetching cart item by ID:', error);
            throw error;
        }
    }

    /**
     * Find cart item by product ID
     * @param {number} productId - Product ID
     * @returns {Object|null} Cart item object or null if not found
     */
    static findByProductId(productId) {
        try {
            if (!productId || isNaN(productId)) {
                throw new Error('Valid product ID is required');
            }

            return this.#getSelectByProductIdStmt().get(productId) || null;
        } catch (error) {
            console.error('Error fetching cart item by product ID:', error);
            throw error;
        }
    }

    /**
     * Update cart item quantity and recalculate subtotal
     * @param {number} id - Cart item ID
     * @param {Object} updateData - Data to update
     * @param {number} updateData.qty - New quantity
     * @returns {Object|null} Updated cart item or null if not found
     */
    static update(id, updateData) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('Valid cart item ID is required');
            }

            // Get current cart item
            const currentItem = this.findById(id);
            if (!currentItem) {
                return null;
            }

            const { qty } = updateData;

            if (!qty || isNaN(qty) || qty <= 0) {
                throw new Error('Valid quantity greater than 0 is required');
            }

            // Get product to calculate new subtotal
            const product = ProductModel.findById(currentItem.productId);
            if (!product) {
                throw new Error('Associated product not found');
            }

            const subtotal = qty * product.price;
            const result = this.#getUpdateStmt().run(qty, subtotal, id);

            if (result.changes === 0) {
                return null;
            }

            return this.findById(id);
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        }
    }

    /**
     * Remove item from cart by ID
     * @param {number} id - Cart item ID
     * @returns {boolean} True if deleted, false if not found
     */
    static delete(id) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('Valid cart item ID is required');
            }

            const result = this.#getDeleteStmt().run(id);
            return result.changes > 0;
        } catch (error) {
            console.error('Error deleting cart item:', error);
            throw error;
        }
    }

    /**
     * Remove all cart items for a specific product
     * @param {number} productId - Product ID
     * @returns {number} Number of items removed
     */
    static deleteByProductId(productId) {
        try {
            if (!productId || isNaN(productId)) {
                throw new Error('Valid product ID is required');
            }

            const result = this.#getDeleteByProductIdStmt().run(productId);
            return result.changes;
        } catch (error) {
            console.error('Error deleting cart items by product ID:', error);
            throw error;
        }
    }

    /**
     * Get total count of cart items
     * @returns {number} Total number of cart items
     */
    static count() {
        try {
            const result = this.#getCountStmt().get();
            return result.count;
        } catch (error) {
            console.error('Error counting cart items:', error);
            throw error;
        }
    }

    /**
     * Get total value of all items in cart
     * @returns {number} Total cart value
     */
    static getTotalValue() {
        try {
            const result = this.#getTotalValueStmt().get();
            return result.total || 0;
        } catch (error) {
            console.error('Error calculating total cart value:', error);
            throw error;
        }
    }

    /**
     * Clear all cart items
     * @returns {number} Number of deleted cart items
     */
    static clearCart() {
        try {
            const deleteAllStmt = db.prepare('DELETE FROM CartItems');
            const result = deleteAllStmt.run();
            return result.changes;
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    }

    /**
     * Get cart summary with totals
     * @returns {Object} Cart summary with items, count, and total
     */
    static getCartSummary() {
        try {
            const items = this.findAll();
            const count = this.count();
            const total = this.getTotalValue();

            return {
                items,
                itemCount: count,
                totalValue: total,
                isEmpty: count === 0
            };
        } catch (error) {
            console.error('Error getting cart summary:', error);
            throw error;
        }
    }
}

export default CartItemModel;