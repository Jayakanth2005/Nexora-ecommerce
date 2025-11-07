import ProductService from '../services/productService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validationResult } from 'express-validator';
import ProductModel from '../models/ProductModel.js';

/**
 * ProductController - HTTP request handlers for product endpoints
 * All methods use asyncHandler for consistent error handling
 */
class ProductController {
    /**
     * Get all products
     * GET /api/products
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static getAllProducts = asyncHandler(async (req, res) => {
        const { search } = req.query;

        let products;
        if (search) {
            products = await ProductService.searchProducts(search);
        } else {
            products = await ProductService.getAllProducts();
        }

        const formattedProducts = ProductService.formatProductData(products);

        res.status(200).json({
            success: true,
            data: formattedProducts,
            message: `Successfully retrieved ${formattedProducts.length} products`,
            count: formattedProducts.length
        });
    });

    /**
     * Get a single product by ID
     * GET /api/products/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static getProductById = asyncHandler(async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Invalid product ID format',
                errors: errors.array()
            });
        }

        const { id } = req.params;
        const product = await ProductService.getProductById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                data: null,
                message: `Product with ID ${id} not found`
            });
        }

        const formattedProduct = ProductService.formatProductData(product);

        res.status(200).json({
            success: true,
            data: formattedProduct,
            message: 'Product retrieved successfully'
        });
    });

    /**
     * Get product count
     * GET /api/products/count
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static getProductCount = asyncHandler(async (req, res) => {
        const count = await ProductService.getProductCount();

        res.status(200).json({
            success: true,
            data: { count },
            message: 'Product count retrieved successfully'
        });
    });

    /**
     * Check if product exists
     * HEAD /api/products/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static checkProductExists = asyncHandler(async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).end();
        }

        const { id } = req.params;
        const exists = await ProductService.validateProductExists(id);

        if (exists) {
            res.status(200).end();
        } else {
            res.status(404).end();
        }
    });

    // Create new product
    static createProduct = asyncHandler(async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const product = ProductModel.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Product created successfully',
                data: product
            });
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    });

    // Update product
    static updateProduct = asyncHandler(async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { id } = req.params;
            const product = ProductModel.update(parseInt(id), req.body);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            res.json({
                success: true,
                message: 'Product updated successfully',
                data: product
            });
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    });

    // Delete product
    static deleteProduct = asyncHandler(async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { id } = req.params;
            const deleted = ProductModel.delete(parseInt(id));

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            res.json({
                success: true,
                message: 'Product deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    });
}

export default ProductController;