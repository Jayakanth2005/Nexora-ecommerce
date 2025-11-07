import ProductModel from '../models/ProductModel.js';

/**
 * ProductService - Business logic layer for product operations
 * This service acts as an intermediary between controllers and models,
 * handling business rules and data transformation
 */
class ProductService {
    /**
     * Get all products from the database
     * @returns {Promise<Array>} Array of all products
     */
    static async getAllProducts() {
        try {
            const products = ProductModel.findAll();
            return products;
        } catch (error) {
            console.error('Service error fetching all products:', error);
            throw new Error('Failed to retrieve products');
        }
    }

    /**
     * Get a single product by ID
     * @param {number} productId - The product ID
     * @returns {Promise<Object|null>} Product object or null if not found
     */
    static async getProductById(productId) {
        try {
            // Validate input
            if (!productId || isNaN(productId)) {
                throw new Error('Valid product ID is required');
            }

            const product = ProductModel.findById(parseInt(productId));
            return product;
        } catch (error) {
            console.error('Service error fetching product by ID:', error);
            throw new Error('Failed to retrieve product');
        }
    }

    /**
     * Search products by name or description
     * @param {string} searchTerm - Search term
     * @returns {Promise<Array>} Array of matching products
     */
    static async searchProducts(searchTerm) {
        try {
            const products = ProductModel.search(searchTerm);
            return products;
        } catch (error) {
            console.error('Service error searching products:', error);
            throw new Error('Failed to search products');
        }
    }

    /**
     * Get product count for pagination purposes
     * @returns {Promise<number>} Total number of products
     */
    static async getProductCount() {
        try {
            const count = ProductModel.count();
            return count;
        } catch (error) {
            console.error('Service error getting product count:', error);
            throw new Error('Failed to get product count');
        }
    }

    /**
     * Validate product exists by ID
     * @param {number} productId - The product ID
     * @returns {Promise<boolean>} True if product exists
     */
    static async validateProductExists(productId) {
        try {
            const product = await this.getProductById(productId);
            return product !== null;
        } catch (error) {
            return false;
        }
    }

    /**
     * Format product data for API response
     * @param {Object|Array} products - Single product or array of products
     * @returns {Object|Array} Formatted product data
     */
    static formatProductData(products) {
        if (Array.isArray(products)) {
            return products.map(product => this.formatSingleProduct(product));
        }
        return this.formatSingleProduct(products);
    }

    /**
     * Format single product for API response
     * @param {Object} product - Product object
     * @returns {Object} Formatted product
     */
    static formatSingleProduct(product) {
        if (!product) return null;

        return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: parseFloat(product.price),
            imageUrl: product.imageUrl,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        };
    }
}

export default ProductService;