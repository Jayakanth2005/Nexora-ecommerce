/**
 * Models index file - Central export for all data models
 * This provides a convenient way to import all models from a single location
 */

export { default as ProductModel } from './ProductModel.js';
export { default as CartItemModel } from './CartItemModel.js';

// Re-export database connection for convenience
export { default as db } from '../config/db.js';