import Joi from 'joi';
import CheckoutService from '../services/checkoutService.js';

/**
 * CheckoutController - Handles checkout HTTP requests
 */
class CheckoutController {
    // Joi validation schema for checkout
    static checkoutSchema = Joi.object({
        name: Joi.string()
            .trim()
            .min(2)
            .max(100)
            .required()
            .messages({
                'string.empty': 'Name is required',
                'string.min': 'Name must be at least 2 characters long',
                'string.max': 'Name must not exceed 100 characters',
                'any.required': 'Name is required'
            }),

        email: Joi.string()
            .email()
            .trim()
            .required()
            .messages({
                'string.email': 'Valid email address is required',
                'string.empty': 'Email is required',
                'any.required': 'Email is required'
            }),

        cartItems: Joi.array()
            .items(
                Joi.object({
                    productId: Joi.number().integer().positive().required(),
                    qty: Joi.number().integer().positive().required(),
                    subtotal: Joi.number().positive().optional()
                })
            )
            .optional()
            .messages({
                'array.base': 'Cart items must be an array'
            })
    });

    /**
     * Process checkout
     * POST /api/checkout
     */
    static async processCheckout(req, res) {
        try {
            // Validate request body with Joi
            const { error, value } = CheckoutController.checkoutSchema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true
            });

            if (error) {
                const validationErrors = error.details.map(detail => ({
                    field: detail.path.join('.'),
                    message: detail.message
                }));

                return res.status(400).json({
                    success: false,
                    receipt: null,
                    message: 'Validation failed',
                    errors: validationErrors
                });
            }

            // Process checkout
            const result = await CheckoutService.processCheckout(value);

            res.status(201).json(result);

        } catch (error) {
            console.error('Error in checkout controller:', error);

            let statusCode = 500;
            let message = 'Internal server error';

            if (error.message.includes('Cart is empty')) {
                statusCode = 400;
                message = 'Cart is empty';
            } else if (error.message.includes('Cart items validation failed')) {
                statusCode = 400;
                message = error.message;
            } else if (error.message.includes('Checkout processing failed')) {
                statusCode = 500;
                message = 'Checkout processing failed';
            }

            res.status(statusCode).json({
                success: false,
                receipt: null,
                message: message
            });
        }
    }

    /**
     * Get receipt by ID
     * GET /api/checkout/receipt/:receiptId
     */
    static async getReceipt(req, res) {
        try {
            const { receiptId } = req.params;

            if (!receiptId) {
                return res.status(400).json({
                    success: false,
                    receipt: null,
                    message: 'Receipt ID is required'
                });
            }

            const result = CheckoutService.getReceipt(receiptId);
            const statusCode = result.success ? 200 : 404;

            res.status(statusCode).json(result);

        } catch (error) {
            console.error('Error in getReceipt controller:', error);
            res.status(500).json({
                success: false,
                receipt: null,
                message: 'Failed to retrieve receipt'
            });
        }
    }

    /**
     * Get all receipts
     * GET /api/checkout/receipts
     */
    static async getAllReceipts(req, res) {
        try {
            const result = CheckoutService.getAllReceipts();
            res.status(200).json(result);

        } catch (error) {
            console.error('Error in getAllReceipts controller:', error);
            res.status(500).json({
                success: false,
                receipts: [],
                message: 'Failed to retrieve receipts'
            });
        }
    }
}

export default CheckoutController;
