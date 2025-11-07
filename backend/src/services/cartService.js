import CartItemModel from '../models/CartItemModel.js';
import db from '../config/db.js';

/**
 * CartService - Business logic for cart operations
 * Handles transactions and business rules
 */
class CartService {
    /**
     * Get all cart items with total calculation
     * @returns {Object} Cart data with items and total
     */
    static getCartItems() {
        try {
            const items = CartItemModel.findAll();
            const total = CartItemModel.getTotalValue();

            return {
                success: true,
                data: items,
                total: total,
                message: items.length > 0 ? 'Cart items retrieved successfully' : 'Cart is empty'
            };
        } catch (error) {
            console.error('Error in getCartItems:', error);
            throw new Error('Failed to retrieve cart items');
        }
    }

    /**
     * Add item to cart or update quantity if exists
     * @param {Object} itemData - Cart item data
     * @param {number} itemData.productId - Product ID
     * @param {number} itemData.qty - Quantity to add
     * @returns {Object} Response with cart item data
     */
    static addToCart(itemData) {
        const transaction = db.transaction(() => {
            try {
                const cartItem = CartItemModel.addToCart(itemData);
                const total = CartItemModel.getTotalValue();

                return {
                    success: true,
                    data: cartItem,
                    total: total,
                    message: 'Item added to cart successfully'
                };
            } catch (error) {
                console.error('Error in addToCart transaction:', error);
                throw error;
            }
        });

        try {
            return transaction();
        } catch (error) {
            console.error('Error in addToCart:', error);
            if (error.message.includes('Product not found')) {
                throw new Error('Product not found');
            }
            if (error.message.includes('Quantity must be greater than 0')) {
                throw new Error('Quantity must be greater than 0');
            }
            if (error.message.includes('Valid productId and qty are required')) {
                throw new Error('Valid productId and qty are required');
            }
            throw new Error('Failed to add item to cart');
        }
    }

    /**
     * Remove item from cart by ID
     * @param {number} itemId - Cart item ID
     * @returns {Object} Response with success status
     */
    static removeFromCart(itemId) {
        const transaction = db.transaction(() => {
            try {
                // Check if item exists before deletion
                const existingItem = CartItemModel.findById(itemId);
                if (!existingItem) {
                    return {
                        success: false,
                        data: null,
                        total: CartItemModel.getTotalValue(),
                        message: 'Cart item not found'
                    };
                }

                const deleted = CartItemModel.delete(itemId);
                const total = CartItemModel.getTotalValue();

                return {
                    success: deleted,
                    data: null,
                    total: total,
                    message: deleted ? 'Item removed from cart successfully' : 'Failed to remove item from cart'
                };
            } catch (error) {
                console.error('Error in removeFromCart transaction:', error);
                throw error;
            }
        });

        try {
            return transaction();
        } catch (error) {
            console.error('Error in removeFromCart:', error);
            if (error.message.includes('Valid cart item ID is required')) {
                throw new Error('Valid cart item ID is required');
            }
            throw new Error('Failed to remove item from cart');
        }
    }

    /**
     * Update cart item quantity
     * @param {number} itemId - Cart item ID
     * @param {Object} updateData - Update data
     * @param {number} updateData.qty - New quantity
     * @returns {Object} Response with updated cart item
     */
    static updateCartItem(itemId, updateData) {
        const transaction = db.transaction(() => {
            try {
                const updatedItem = CartItemModel.update(itemId, updateData);

                if (!updatedItem) {
                    return {
                        success: false,
                        data: null,
                        total: CartItemModel.getTotalValue(),
                        message: 'Cart item not found'
                    };
                }

                const total = CartItemModel.getTotalValue();

                return {
                    success: true,
                    data: updatedItem,
                    total: total,
                    message: 'Cart item updated successfully'
                };
            } catch (error) {
                console.error('Error in updateCartItem transaction:', error);
                throw error;
            }
        });

        try {
            return transaction();
        } catch (error) {
            console.error('Error in updateCartItem:', error);
            if (error.message.includes('Valid quantity greater than 0 is required')) {
                throw new Error('Valid quantity greater than 0 is required');
            }
            if (error.message.includes('Valid cart item ID is required')) {
                throw new Error('Valid cart item ID is required');
            }
            throw new Error('Failed to update cart item');
        }
    }

    /**
     * Clear all items from cart
     * @returns {Object} Response with success status
     */
    static clearCart() {
        const transaction = db.transaction(() => {
            try {
                const deletedCount = CartItemModel.clearCart();

                return {
                    success: true,
                    data: { deletedCount },
                    total: 0,
                    message: deletedCount > 0 ? 'Cart cleared successfully' : 'Cart was already empty'
                };
            } catch (error) {
                console.error('Error in clearCart transaction:', error);
                throw error;
            }
        });

        try {
            return transaction();
        } catch (error) {
            console.error('Error in clearCart:', error);
            throw new Error('Failed to clear cart');
        }
    }
}

export default CartService;
