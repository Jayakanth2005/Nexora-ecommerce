import db from '../config/db.js';

/**
 * ProductModel class - Encapsulates all database operations for Products
 * Uses prepared statements for optimal performance and security
 */
class ProductModel {
    // Prepared statements - initialized once for performance
    static #insertStmt = db.prepare(`
        INSERT INTO Products (name, description, price, imageUrl)
        VALUES (?, ?, ?, ?)
    `);

    static #selectAllStmt = db.prepare(`
        SELECT * FROM Products ORDER BY createdAt DESC
    `);

    static #selectByIdStmt = db.prepare(`
        SELECT * FROM Products WHERE id = ?
    `);

    static #updateStmt = db.prepare(`
        UPDATE Products 
        SET name = ?, description = ?, price = ?, imageUrl = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
    `);

    static #deleteStmt = db.prepare(`
        DELETE FROM Products WHERE id = ?
    `);

    static #searchStmt = db.prepare(`
        SELECT * FROM Products 
        WHERE name LIKE ? OR description LIKE ?
        ORDER BY createdAt DESC
    `);

    static #countStmt = db.prepare(`
        SELECT COUNT(*) as count FROM Products
    `);

    /**
     * Create a new product
     * @param {Object} productData - Product information
     * @param {string} productData.name - Product name
     * @param {string} productData.description - Product description
     * @param {number} productData.price - Product price
     * @param {string} productData.imageUrl - Product image URL
     * @returns {Object} Created product with ID
     */
    static create(productData) {
        try {
            const { name, description, price, imageUrl } = productData;

            // Validate required fields
            if (!name || price === undefined || price === null) {
                throw new Error('Name and price are required fields');
            }

            if (price < 0) {
                throw new Error('Price cannot be negative');
            }

            const result = this.#insertStmt.run(name, description, price, imageUrl);

            // Return the created product
            return this.findById(result.lastInsertRowid);
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    /**
     * Get all products
     * @returns {Array} Array of all products
     */
    static findAll() {
        try {
            return this.#selectAllStmt.all();
        } catch (error) {
            console.error('Error fetching all products:', error);
            throw error;
        }
    }

    /**
     * Find product by ID
     * @param {number} id - Product ID
     * @returns {Object|null} Product object or null if not found
     */
    static findById(id) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('Valid product ID is required');
            }

            return this.#selectByIdStmt.get(id) || null;
        } catch (error) {
            console.error('Error fetching product by ID:', error);
            throw error;
        }
    }

    /**
     * Update an existing product
     * @param {number} id - Product ID
     * @param {Object} updateData - Data to update
     * @returns {Object|null} Updated product or null if not found
     */
    static update(id, updateData) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('Valid product ID is required');
            }

            // Get current product data
            const currentProduct = this.findById(id);
            if (!currentProduct) {
                return null;
            }

            // Merge current data with updates
            const {
                name = currentProduct.name,
                description = currentProduct.description,
                price = currentProduct.price,
                imageUrl = currentProduct.imageUrl
            } = updateData;

            // Validate price if being updated
            if (price < 0) {
                throw new Error('Price cannot be negative');
            }

            const result = this.#updateStmt.run(name, description, price, imageUrl, id);

            if (result.changes === 0) {
                return null;
            }

            return this.findById(id);
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    /**
     * Delete a product by ID
     * @param {number} id - Product ID
     * @returns {boolean} True if deleted, false if not found
     */
    static delete(id) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('Valid product ID is required');
            }

            const result = this.#deleteStmt.run(id);
            return result.changes > 0;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }

    /**
     * Search products by name or description
     * @param {string} searchTerm - Search term
     * @returns {Array} Array of matching products
     */
    static search(searchTerm) {
        try {
            if (!searchTerm || typeof searchTerm !== 'string') {
                return this.findAll();
            }

            const searchPattern = `%${searchTerm.trim()}%`;
            return this.#searchStmt.all(searchPattern, searchPattern);
        } catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    }

    /**
     * Get total count of products
     * @returns {number} Total number of products
     */
    static count() {
        try {
            const result = this.#countStmt.get();
            return result.count;
        } catch (error) {
            console.error('Error counting products:', error);
            throw error;
        }
    }

    /**
     * Create multiple products in a transaction (for seeding)
     * @param {Array} products - Array of product objects
     * @returns {Array} Array of created products
     */
    static createMany(products) {
        if (!Array.isArray(products)) {
            throw new Error('Products must be an array');
        }

        const transaction = db.transaction(() => {
            const createdProducts = [];
            for (const product of products) {
                const created = this.create(product);
                createdProducts.push(created);
            }
            return createdProducts;
        });

        return transaction();
    }

    /**
     * Clear all products (for testing/seeding)
     * @returns {number} Number of deleted products
     */
    static deleteAll() {
        try {
            const deleteAllStmt = db.prepare('DELETE FROM Products');
            const result = deleteAllStmt.run();
            return result.changes;
        } catch (error) {
            console.error('Error deleting all products:', error);
            throw error;
        }
    }
}

export default ProductModel;