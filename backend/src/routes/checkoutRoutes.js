import express from 'express';
import CheckoutController from '../controllers/checkoutController.js';

const router = express.Router();

/**
 * @route   POST /api/checkout
 * @desc    Process checkout transaction
 * @access  Public
 * @body    { name: string, email: string, cartItems?: Array }
 */
router.post('/', CheckoutController.processCheckout);

/**
 * @route   GET /api/checkout/receipt/:receiptId
 * @desc    Get receipt by receipt ID
 * @access  Public
 */
router.get('/receipt/:receiptId', CheckoutController.getReceipt);

/**
 * @route   GET /api/checkout/receipts
 * @desc    Get all receipts
 * @access  Public
 */
router.get('/receipts', CheckoutController.getAllReceipts);

export default router;
