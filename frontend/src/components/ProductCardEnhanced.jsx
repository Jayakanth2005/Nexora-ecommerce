import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContextEnhanced';
import { useNotification } from '../components/NotificationProvider';
import { LoadingSpinner } from '../components/Loading';

const ProductCard = ({ product }) => {
    const { t } = useTranslation();
    const { addToCart, cart } = useCart();
    const { showSuccess, showError } = useNotification();
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);

    const handleAddToCart = async () => {
        setIsAddingToCart(true);
        const success = await addToCart(product);

        if (success) {
            showSuccess(t('notifications.itemAdded', { name: product.name }));
        } else {
            showError(t('notifications.networkError'));
        }

        setIsAddingToCart(false);
    };

    const toggleFavorite = () => {
        setIsFavorited(!isFavorited);
    };

    // Placeholder image if no product image is provided
    const imageUrl = product.image || 'https://via.placeholder.com/300x200?text=Product+Image';

    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
        >
            {/* Product Image */}
            <div className="relative aspect-w-16 aspect-h-12 bg-neutral-100 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Product+Image';
                    }}
                />

                {/* Discount Badge */}
                {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </div>
                )}

                {/* Favorite Button */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleFavorite}
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
                    aria-label="Add to favorites"
                >
                    <Heart
                        size={16}
                        className={`${isFavorited ? 'fill-red-500 text-red-500' : 'text-neutral-600'} transition-colors duration-200`}
                    />
                </motion.button>

                {/* Stock Status Overlay */}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-white text-neutral-800 px-3 py-1 rounded-lg font-semibold">
                            {t('products.outOfStock')}
                        </span>
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-neutral-800 line-clamp-2 flex-1">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center ml-2">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span className="text-sm text-neutral-600 ml-1">
                            {product.rating || '4.5'}
                        </span>
                    </div>
                </div>

                {product.description && (
                    <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                        {product.description}
                    </p>
                )}

                {/* Price and Stock Info */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-neutral-800">
                                {t('products.price', { price: product.price.toFixed(2) })}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-sm text-neutral-500 line-through">
                                    {t('products.price', { price: product.originalPrice.toFixed(2) })}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Stock Status */}
                    {product.stock !== undefined && (
                        <div className="flex items-center justify-between">
                            <div>
                                {isOutOfStock ? (
                                    <span className="text-xs text-red-600 font-medium">
                                        {t('products.outOfStock')}
                                    </span>
                                ) : isLowStock ? (
                                    <span className="text-xs text-orange-600 font-medium">
                                        {t('products.onlyLeft', { count: product.stock })}
                                    </span>
                                ) : (
                                    <span className="text-xs text-green-600 font-medium">
                                        {t('products.inStock')}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Add to Cart Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddToCart}
                        disabled={isOutOfStock || isAddingToCart || cart.isLoading}
                        className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${isOutOfStock
                                ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                            }`}
                        aria-label={`${t('products.addToCart')} ${product.name}`}
                    >
                        {isAddingToCart ? (
                            <LoadingSpinner size="sm" color="white" />
                        ) : (
                            <>
                                <ShoppingCart size={18} />
                                <span>{t('products.addToCart')}</span>
                            </>
                        )}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;