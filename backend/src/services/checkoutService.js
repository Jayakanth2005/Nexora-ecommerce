import CartService from './cartService.js';
import ReceiptModel from '../models/ReceiptModel.js';
import db from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * CheckoutService - Handles checkout business logic
 */
class CheckoutService {
    /**
     * Process checkout transaction
     * @param {Object} checkoutData - Checkout information
     * @param {string} checkoutData.name - Customer name
     * @param {string} checkoutData.email - Customer email
     * @param {Array} checkoutData.cartItems - Cart items for verification
     * @returns {Object} Checkout result with receipt
     */
    static async processCheckout(checkoutData) {
        const transaction = db.transaction(async () => {
            try {
                const { name, email, cartItems: providedCartItems } = checkoutData;

                // Get current cart items from database
                const cartResult = CartService.getCartItems();
                const currentCartItems = cartResult.data;

                // Validate cart is not empty
                if (!currentCartItems || currentCartItems.length === 0) {
                    throw new Error('Cart is empty');
                }

                // Verify provided cart items match current cart (optional validation)
                if (providedCartItems && providedCartItems.length > 0) {
                    this.validateCartItems(currentCartItems, providedCartItems);
                }

                // Calculate grand total
                const grandTotal = this.calculateGrandTotal(currentCartItems);

                // Generate unique receipt ID and timestamp
                const receiptId = this.generateReceiptId();
                const timestamp = new Date().toISOString();

                // Create receipt record
                const receiptData = {
                    receiptId,
                    name,
                    email,
                    total: grandTotal,
                    cartItems: currentCartItems,
                    timestamp
                };

                const receipt = ReceiptModel.create(receiptData);

                // Clear cart after successful checkout
                CartService.clearCart();

                // Log transaction
                this.logTransaction(receipt);

                return {
                    success: true,
                    receipt: {
                        receiptId: receipt.receiptId,
                        total: receipt.total,
                        timestamp: receipt.timestamp,
                        name: receipt.name,
                        email: receipt.email,
                        items: receipt.cartItems
                    },
                    message: 'Checkout completed successfully'
                };

            } catch (error) {
                console.error('Error in checkout transaction:', error);
                throw error;
            }
        });

        try {
            return transaction();
        } catch (error) {
            console.error('Error processing checkout:', error);

            if (error.message.includes('Cart is empty')) {
                throw new Error('Cart is empty');
            }
            if (error.message.includes('Cart items validation failed')) {
                throw new Error('Cart items validation failed');
            }

            throw new Error('Checkout processing failed');
        }
    }

    /**
     * Calculate grand total from cart items
     * @param {Array} cartItems - Array of cart items
     * @returns {number} Grand total
     */
    static calculateGrandTotal(cartItems) {
        return cartItems.reduce((total, item) => {
            return total + (item.subtotal || 0);
        }, 0);
    }

    /**
     * Generate unique receipt ID
     * @returns {string} Unique receipt ID
     */
    static generateReceiptId() {
        const timestamp = Date.now();
        const randomPart = uuidv4().split('-')[0].toUpperCase();
        return `RCP-${timestamp}-${randomPart}`;
    }

    /**
     * Validate provided cart items against current cart
     * @param {Array} currentCartItems - Current cart items from database
     * @param {Array} providedCartItems - Cart items provided in request
     */
    static validateCartItems(currentCartItems, providedCartItems) {
        // Basic validation - check if item counts match
        if (currentCartItems.length !== providedCartItems.length) {
            throw new Error('Cart items validation failed: Item count mismatch');
        }

        // Validate each item exists and quantities match
        for (const providedItem of providedCartItems) {
            const currentItem = currentCartItems.find(
                item => item.productId === providedItem.productId
            );

            if (!currentItem) {
                throw new Error(`Cart items validation failed: Product ${providedItem.productId} not found in cart`);
            }

            if (currentItem.qty !== providedItem.qty) {
                throw new Error(`Cart items validation failed: Quantity mismatch for product ${providedItem.productId}`);
            }
        }
    }

    /**
     * Log transaction details
     * @param {Object} receipt - Receipt object
     */
    static logTransaction(receipt) {
        console.log('='.repeat(50));
        console.log('CHECKOUT TRANSACTION COMPLETED');
        console.log('='.repeat(50));
        console.log(`Receipt ID: ${receipt.receiptId}`);
        console.log(`Customer: ${receipt.name} (${receipt.email})`);
        console.log(`Total Amount: $${receipt.total.toFixed(2)}`);
        console.log(`Timestamp: ${receipt.timestamp}`);
        console.log(`Items Count: ${receipt.cartItems.length}`);
        console.log('Items:');
        receipt.cartItems.forEach((item, index) => {
            console.log(`  ${index + 1}. ${item.productName} x ${item.qty} = $${item.subtotal.toFixed(2)}`);
        });
        console.log('='.repeat(50));
    }

    /**
     * Get receipt by receipt ID
     * @param {string} receiptId - Receipt ID
     * @returns {Object} Receipt details
     */
    static getReceipt(receiptId) {
        try {
            const receipt = ReceiptModel.findByReceiptId(receiptId);

            if (!receipt) {
                return {
                    success: false,
                    receipt: null,
                    message: 'Receipt not found'
                };
            }

            return {
                success: true,
                receipt: {
                    receiptId: receipt.receiptId,
                    total: receipt.total,
                    timestamp: receipt.timestamp,
                    name: receipt.name,
                    email: receipt.email,
                    items: receipt.cartItems
                },
                message: 'Receipt retrieved successfully'
            };
        } catch (error) {
            console.error('Error retrieving receipt:', error);
            throw new Error('Failed to retrieve receipt');
        }
    }

    /**
     * Get all receipts
     * @returns {Object} All receipts
     */
    static getAllReceipts() {
        try {
            const receipts = ReceiptModel.findAll();

            return {
                success: true,
                receipts: receipts.map(receipt => ({
                    receiptId: receipt.receiptId,
                    total: receipt.total,
                    timestamp: receipt.timestamp,
                    name: receipt.name,
                    email: receipt.email,
                    itemsCount: receipt.cartItems.length
                })),
                message: 'Receipts retrieved successfully'
            };
        } catch (error) {
            console.error('Error retrieving receipts:', error);
            throw new Error('Failed to retrieve receipts');
        }
    }
}

export default CheckoutService;
