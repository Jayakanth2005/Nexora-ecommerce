import express from 'express';
import { body, param, query } from 'express-validator';
import ProductController from '../controllers/ProductController.js';

const router = express.Router();

// Validation middleware
const validateProductCreation = [
    body('name')
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
    body('imageUrl')
        .optional()
        .isURL()
        .withMessage('Image URL must be valid')
];

const validateProductUpdate = [
    param('id').isInt({ min: 1 }).withMessage('Valid product ID is required'),
    body('name')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
    body('imageUrl')
        .optional()
        .isURL()
        .withMessage('Image URL must be valid')
];

const validateProductId = [
    param('id').isInt({ min: 1 }).withMessage('Valid product ID is required')
];

// Routes
router.get('/', ProductController.getAllProducts);
router.get('/:id', validateProductId, ProductController.getProductById);
router.post('/', validateProductCreation, ProductController.createProduct);
router.put('/:id', validateProductUpdate, ProductController.updateProduct);
router.delete('/:id', validateProductId, ProductController.deleteProduct);

export default router;