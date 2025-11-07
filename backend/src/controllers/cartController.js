import { validationResult } from 'express-validator';
import CartService from '../services/cartService.js';

/**
 * CartController - Handles HTTP requests for cart operations
 */
class CartController {
    /**
     * Get all cart items
     * GET /api/cart
     */
    static async getCartItems(req, res) {
        try {
            const result = CartService.getCartItems();
            res.status(200).json(result);
        } catch (error) {
            console.error('Error in getCartItems controller:', error);
            res.status(500).json({
                success: false,
                data: null,
                total: 0,
                message: error.message || 'Internal server error'
            });
        }
    }

    /**
     * Add item to cart
     * POST /api/cart
     * Body: { productId, qty }
     */
    static async addToCart(req, res) {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    data: null,
                    total: 0,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { productId, qty } = req.body;
            const result = CartService.addToCart({ productId, qty });

            res.status(201).json(result);
        } catch (error) {
            console.error('Error in addToCart controller:', error);

            let statusCode = 500;
            if (error.message.includes('Product not found')) {
                statusCode = 404;
            } else if (error.message.includes('Quantity must be greater than 0') ||
                error.message.includes('Valid productId and qty are required')) {
                statusCode = 400;
            }

            res.status(statusCode).json({
                success: false,
                data: null,
                total: 0,
                message: error.message || 'Internal server error'
            });
        }
    }

    /**
     * Remove item from cart
     * DELETE /api/cart/:id
     */
    static async removeFromCart(req, res) {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    data: null,
                    total: 0,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { id } = req.params;
            const result = CartService.removeFromCart(parseInt(id));

            const statusCode = result.success ? 200 : 404;
            res.status(statusCode).json(result);
        } catch (error) {
            console.error('Error in removeFromCart controller:', error);

            let statusCode = 500;
            if (error.message.includes('Valid cart item ID is required')) {
                statusCode = 400;
            }

            res.status(statusCode).json({
                success: false,
                data: null,
                total: 0,
                message: error.message || 'Internal server error'
            });
        }
    }

    /**
     * Update cart item quantity
     * PUT /api/cart/:id
     * Body: { qty }
     */
    static async updateCartItem(req, res) {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    data: null,
                    total: 0,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { id } = req.params;
            const { qty } = req.body;
            const result = CartService.updateCartItem(parseInt(id), { qty });

            const statusCode = result.success ? 200 : 404;
            res.status(statusCode).json(result);
        } catch (error) {
            console.error('Error in updateCartItem controller:', error);

            let statusCode = 500;
            if (error.message.includes('Valid quantity greater than 0 is required') ||
                error.message.includes('Valid cart item ID is required')) {
                statusCode = 400;
            }

            res.status(statusCode).json({
                success: false,
                data: null,
                total: 0,
                message: error.message || 'Internal server error'
            });
        }
    }

    /**
     * Clear all cart items
     * DELETE /api/cart
     */
    static async clearCart(req, res) {
        try {
            const result = CartService.clearCart();
            res.status(200).json(result);
        } catch (error) {
            console.error('Error in clearCart controller:', error);
            res.status(500).json({
                success: false,
                data: null,
                total: 0,
                message: error.message || 'Internal server error'
            });
        }
    }
}

export default CartController;
