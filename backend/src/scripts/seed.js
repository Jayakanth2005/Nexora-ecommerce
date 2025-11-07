#!/usr/bin/env node

import ProductModel from '../models/ProductModel.js';
import CartItemModel from '../models/CartItemModel.js';

/**
 * Seed script for initializing the database with sample data
 * This script will clear existing data and insert fresh sample products
 */

// Sample product data with realistic e-commerce items
const sampleProducts = [
    {
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium over-ear wireless headphones with active noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
        price: 299.99,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'
    },
    {
        name: 'Smart Fitness Watch',
        description: 'Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and 7-day battery life. Water-resistant design.',
        price: 249.99,
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop'
    },
    {
        name: 'USB-C Laptop Charger',
        description: 'Universal 65W USB-C laptop charger compatible with most modern laptops. Compact design with fast charging technology.',
        price: 49.99,
        imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop'
    },
    {
        name: 'Mechanical Gaming Keyboard',
        description: 'RGB backlit mechanical keyboard with custom switches. Perfect for gaming and typing with premium build quality.',
        price: 159.99,
        imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop'
    },
    {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with precision tracking and long-lasting battery. Comfortable grip for extended use.',
        price: 79.99,
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop'
    },
    {
        name: 'Portable Phone Stand',
        description: 'Adjustable aluminum phone stand for desk use. Compatible with all smartphone sizes and tablets up to 11 inches.',
        price: 24.99,
        imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=500&fit=crop'
    },
    {
        name: 'Wireless Charging Pad',
        description: '15W fast wireless charging pad with LED indicator. Compatible with all Qi-enabled devices including latest smartphones.',
        price: 39.99,
        imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop'
    },
    {
        name: 'Bluetooth Speaker',
        description: 'Portable waterproof Bluetooth speaker with 360-degree sound and 12-hour battery. Perfect for outdoor activities.',
        price: 89.99,
        imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop'
    },
    {
        name: 'Laptop Stand',
        description: 'Adjustable aluminum laptop stand with cooling design. Improves posture and increases airflow for better performance.',
        price: 69.99,
        imageUrl: 'https://images.unsplash.com/photo-1527906190468-7a720c80a3b8?w=500&h=500&fit=crop'
    },
    {
        name: 'Cable Management Kit',
        description: 'Complete cable organization solution with various clips, ties, and holders. Keep your workspace clean and organized.',
        price: 19.99,
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop'
    }
];

/**
 * Main seeding function
 */
async function seedDatabase() {
    try {
        console.log('Starting database seeding...');

        // Clear existing data
        console.log('Clearing existing data...');
        const deletedCartItems = CartItemModel.clearCart();
        const deletedProducts = ProductModel.deleteAll();

        console.log(`   Cleared ${deletedCartItems} cart items`);
        console.log(`   Cleared ${deletedProducts} products`);

        // Insert sample products
        console.log('Inserting sample products...');
        const createdProducts = ProductModel.createMany(sampleProducts);

        console.log(`   Successfully created ${createdProducts.length} products:`);
        createdProducts.forEach((product, index) => {
            console.log(`   ${index + 1}. ${product.name} - $${product.price}`);
        });

        // Verify data
        console.log('Verifying seeded data...');
        const totalProducts = ProductModel.count();
        const allProducts = ProductModel.findAll();

        console.log(`   Total products in database: ${totalProducts}`);
        console.log(`   Products retrieved: ${allProducts.length}`);

        // Display summary
        console.log('\nDatabase Seeding Summary:');
        console.log('================================');
        console.log(`Products seeded: ${createdProducts.length}`);
        console.log(`Database file: data/database.sqlite`);
        console.log(`Total value of products: $${allProducts.reduce((sum, p) => sum + p.price, 0).toFixed(2)}`);

        console.log('\nDatabase seeding completed successfully!');
        console.log('\nYou can now test the database:');
        console.log('   1. Run: npm start');
        console.log('   2. Visit: http://localhost:3001/health');
        console.log('   3. Test API: http://localhost:3001/api');

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}/**
 * Handle graceful shutdown
 */
process.on('SIGINT', () => {
    console.log('\nSeeding interrupted by user');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\nSeeding terminated');
    process.exit(0);
});

// Run the seeding if this script is executed directly
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
    seedDatabase();
}

export { seedDatabase, sampleProducts };