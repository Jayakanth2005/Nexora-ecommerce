import express from 'express';
import productRoutes from './productRoutes.js';
import cartRoutes from './cartRoutes.js';

const router = express.Router();

// API information route
router.get('/', (req, res) => {
    res.json({
        message: 'Nexus API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            products: '/api/products',
            cart: '/api/cart',
            api: '/api'
        }
    });
});

// Product routes
router.use('/products', productRoutes);

// Cart routes
router.use('/cart', cartRoutes);

export default router;
