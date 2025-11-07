import express from 'express';
import { body, param } from 'express-validator';
import CartController from '../controllers/cartController.js';

const router = express.Router();

// Validation middleware
const addToCartValidation = [
    body('productId')
        .isInt({ min: 1 })
        .withMessage('Product ID must be a positive integer'),
    body('qty')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer')
];

const updateCartItemValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Cart item ID must be a positive integer'),
    body('qty')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer')
];

const removeFromCartValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Cart item ID must be a positive integer')
];

// Routes
/**
 * @route   GET /api/cart
 * @desc    Get all cart items with total
 * @access  Public
 */
router.get('/', CartController.getCartItems);

/**
 * @route   POST /api/cart
 * @desc    Add item to cart
 * @access  Public
 * @body    { productId: number, qty: number }
 */
router.post('/', addToCartValidation, CartController.addToCart);

/**
 * @route   PUT /api/cart/:id
 * @desc    Update cart item quantity
 * @access  Public
 * @body    { qty: number }
 */
router.put('/:id', updateCartItemValidation, CartController.updateCartItem);

/**
 * @route   DELETE /api/cart/:id
 * @desc    Remove item from cart by ID
 * @access  Public
 */
router.delete('/:id', removeFromCartValidation, CartController.removeFromCart);

/**
 * @route   DELETE /api/cart
 * @desc    Clear all cart items
 * @access  Public
 */
router.delete('/', CartController.clearCart);

export default router;
