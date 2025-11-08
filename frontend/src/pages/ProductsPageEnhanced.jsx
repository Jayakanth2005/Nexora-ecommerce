import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, Shield, RotateCcw, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ProductCardEnhanced from '../components/ProductCardEnhanced';
import { LoadingGrid, LoadingOverlay } from '../components/Loading';
import { useNotification } from '../components/NotificationProvider';
import { productsAPI } from '../services/api';

const ProductsPage = () => {
    const { t } = useTranslation();
    const { showError, showInfo } = useNotification();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await productsAPI.getAll();
            setProducts(data.data);
        } catch (error) {
            console.error('Failed to load products:', error);
            setError(error.message);
            showError(t('notifications.fetchError'));
            // Fallback to mock data if backend is not available
            setProducts(getMockProducts());
        } finally {
            setIsLoading(false);
        }
    };

    const getMockProducts = () => [
        {
            id: 1,
            name: 'Premium Wireless Headphones',
            description: 'High-quality wireless headphones with noise cancellation and long battery life.',
            price: 199.99,
            originalPrice: 249.99,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop',
            stock: 15
        },
        {
            id: 2,
            name: 'Smart Fitness Watch',
            description: 'Track your fitness goals with this advanced smartwatch featuring GPS and health monitoring.',
            price: 299.99,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop',
            stock: 8
        },
        {
            id: 3,
            name: 'Laptop Stand Adjustable',
            description: 'Ergonomic laptop stand that adjusts to multiple angles for comfortable working.',
            price: 49.99,
            originalPrice: 69.99,
            image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop',
            stock: 25
        },
        {
            id: 4,
            name: 'Bluetooth Speaker',
            description: 'Portable Bluetooth speaker with crystal clear sound and waterproof design.',
            price: 79.99,
            image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=200&fit=crop',
            stock: 12
        },
        {
            id: 5,
            name: 'Wireless Charging Pad',
            description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
            price: 29.99,
            image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop',
            stock: 30
        },
        {
            id: 6,
            name: 'USB-C Hub Multiport',
            description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and fast charging.',
            price: 89.99,
            image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=300&h=200&fit=crop',
            stock: 18
        },
        {
            id: 7,
            name: 'Mechanical Keyboard',
            description: 'Professional mechanical keyboard with RGB backlight and tactile switches.',
            price: 149.99,
            originalPrice: 179.99,
            image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=200&fit=crop',
            stock: 6
        },
        {
            id: 8,
            name: 'Webcam 4K Ultra HD',
            description: '4K webcam with auto-focus and built-in microphone for crystal clear video calls.',
            price: 119.99,
            image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=300&h=200&fit=crop',
            stock: 0
        }
    ];

    const features = [
        {
            icon: Truck,
            title: t('products.features.freeShipping'),
            description: t('products.features.freeShippingDesc'),
        },
        {
            icon: Shield,
            title: t('products.features.securePayment'),
            description: t('products.features.securePaymentDesc'),
        },
        {
            icon: RotateCcw,
            title: t('products.features.easyReturns'),
            description: t('products.features.easyReturnsDesc'),
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neut">
                {/* Header Section */}
                <div className="bg-white border-b border-neutral-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center">
                            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Loading Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <LoadingGrid count={8} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-b border-neutral-200"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl font-bold text-neutral-800 sm:text-4xl"
                        >
                            {t('products.title')}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto"
                        >
                            {t('products.subtitle')}
                        </motion.p>
                    </div>
                </div>
            </motion.div>

            {/* Error State */}
            {error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <h3 className="text-lg font-semibold text-red-800 mb-2">
                            {t('common.error')}
                        </h3>
                        <p className="text-red-700 mb-4">{error}</p>
                        <button
                            onClick={loadProducts}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                        >
                            <RefreshCw size={16} className="mr-2" />
                            {t('common.retry')}
                        </button>
                    </div>
                </div>
            )}

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <LoadingOverlay isLoading={isLoading}>
                    {products.length > 0 ? (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            data-tutorial="products-grid"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            {products.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    variants={itemVariants}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <ProductCardEnhanced product={product} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        /* Empty State */
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16"
                        >
                            <div className="w-24 h-24 mx-auto mb-4 text-neutral-300">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                                {t('products.empty.title')}
                            </h3>
                            <p className="text-neutral-600 max-w-md mx-auto mb-6">
                                {t('products.empty.message')}
                            </p>
                            <button
                                onClick={loadProducts}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                <RefreshCw size={16} className="mr-2" />
                                {t('common.retry')}
                            </button>
                        </motion.div>
                    )}
                </LoadingOverlay>
            </div>

            {/* Features Section */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white border-t border-neutral-200"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div data-tutorial="features" className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-12 h-12 mx-auto mb-4 text-blue-600">
                                    <feature.icon size={48} />
                                </div>
                                <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-neutral-600">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProductsPage;