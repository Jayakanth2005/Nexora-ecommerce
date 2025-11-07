import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartAPI } from '../services/api';

// Initial state
const initialState = {
    items: [],
    total: 0,
    itemCount: 0,
    isLoading: false,
    error: null,
};

// Action types
const CART_ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_CART: 'SET_CART',
    ADD_ITEM_SUCCESS: 'ADD_ITEM_SUCCESS',
    REMOVE_ITEM_SUCCESS: 'REMOVE_ITEM_SUCCESS',
    UPDATE_ITEM_SUCCESS: 'UPDATE_ITEM_SUCCESS',
    CLEAR_CART_SUCCESS: 'CLEAR_CART_SUCCESS',
};

// Cart reducer
const cartReducer = (state, action) => {
    switch (action.type) {
        case CART_ACTIONS.SET_LOADING:
            return { ...state, isLoading: action.payload, error: null };

        case CART_ACTIONS.SET_ERROR:
            return { ...state, error: action.payload, isLoading: false };

        case CART_ACTIONS.SET_CART: {
            const { items } = action.payload;
            const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
            const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

            return {
                ...state,
                items,
                total,
                itemCount,
                isLoading: false,
                error: null,
            };
        }

        case CART_ACTIONS.ADD_ITEM_SUCCESS:
        case CART_ACTIONS.UPDATE_ITEM_SUCCESS:
        case CART_ACTIONS.REMOVE_ITEM_SUCCESS:
        case CART_ACTIONS.CLEAR_CART_SUCCESS: {
            const { items } = action.payload;
            const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
            const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

            return {
                ...state,
                items,
                total,
                itemCount,
                isLoading: false,
                error: null,
            };
        }

        default:
            return state;
    }
};

// Create context
const CartContext = createContext();

// Custom hook to use cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

// Cart provider component
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Load cart on mount
    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
            const cartData = await cartAPI.getCart();
            dispatch({ type: CART_ACTIONS.SET_CART, payload: cartData });
        } catch (error) {
            console.error('Failed to load cart:', error);
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
            // Fallback to empty cart if backend is not available
            dispatch({ type: CART_ACTIONS.SET_CART, payload: { items: [] } });
        }
    };

    const addToCart = async (product, quantity = 1) => {
        try {
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
            const cartData = await cartAPI.addItem(product.id, quantity);
            dispatch({ type: CART_ACTIONS.ADD_ITEM_SUCCESS, payload: cartData });
            return true;
        } catch (error) {
            console.error('Failed to add item to cart:', error);
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
            return false;
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
            const cartData = await cartAPI.removeItem(cartItemId);
            dispatch({ type: CART_ACTIONS.REMOVE_ITEM_SUCCESS, payload: cartData });
            return true;
        } catch (error) {
            console.error('Failed to remove item from cart:', error);
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
            return false;
        }
    };

    const updateQuantity = async (cartItemId, quantity) => {
        if (quantity <= 0) {
            return removeFromCart(cartItemId);
        }

        try {
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
            const cartData = await cartAPI.updateItem(cartItemId, quantity);
            dispatch({ type: CART_ACTIONS.UPDATE_ITEM_SUCCESS, payload: cartData });
            return true;
        } catch (error) {
            console.error('Failed to update cart item:', error);
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
            return false;
        }
    };

    const clearCart = async () => {
        try {
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
            const cartData = await cartAPI.clearCart();
            dispatch({ type: CART_ACTIONS.CLEAR_CART_SUCCESS, payload: cartData });
            return true;
        } catch (error) {
            console.error('Failed to clear cart:', error);
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
            return false;
        }
    };

    const value = {
        cart: state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loadCart,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;