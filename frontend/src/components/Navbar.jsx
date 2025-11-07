import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { cart } = useCart();
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const toggleLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('preferredLanguage', lang);
        setIsLanguageMenuOpen(false);
    };

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' }
    ];

    const navItems = [
        { path: '/', label: t('nav.home') },
        { path: '/cart', label: t('nav.cart'), hasCount: true },
        { path: '/checkout', label: t('nav.checkout') }
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Brand */}
                    <Link
                        to="/"
                        className="flex items-center space-x-2"
                        aria-label="Nexus home"
                    >
                        <div className="w-8 h-8 bg-linear-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">N</span>
                        </div>
                        <span className="font-display font-semibold text-xl text-neutral-800">
                            Nexus
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className={`font-medium transition-colors duration-200 ${isActive('/')
                                ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                                : 'text-neutral-600 hover:text-neutral-800'
                                }`}
                            aria-label="Home page"
                        >
                            Home
                        </Link>
                        <Link
                            to="/cart"
                            className={`font-medium transition-colors duration-200 relative ${isActive('/cart')
                                ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                                : 'text-neutral-600 hover:text-neutral-800'
                                }`}
                            aria-label={`Cart with ${cart.itemCount} items`}
                        >
                            Cart
                            {cart.itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cart.itemCount > 99 ? '99+' : cart.itemCount}
                                </span>
                            )}
                        </Link>
                        <Link
                            to="/checkout"
                            className={`font-medium transition-colors duration-200 ${isActive('/checkout')
                                ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                                : 'text-neutral-600 hover:text-neutral-800'
                                }`}
                            aria-label="Checkout page"
                        >
                            Checkout
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            type="button"
                            className="text-neutral-600 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg p-2"
                            aria-label="Open mobile menu"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden pb-4">
                    <div className="flex flex-col space-y-3">
                        <Link
                            to="/"
                            className={`font-medium py-2 px-3 rounded-lg transition-colors duration-200 ${isActive('/')
                                ? 'bg-primary-50 text-primary-700'
                                : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50'
                                }`}
                            aria-label="Home page"
                        >
                            Home
                        </Link>
                        <Link
                            to="/cart"
                            className={`font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-between ${isActive('/cart')
                                ? 'bg-primary-50 text-primary-700'
                                : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50'
                                }`}
                            aria-label={`Cart with ${cart.itemCount} items`}
                        >
                            <span>Cart</span>
                            {cart.itemCount > 0 && (
                                <span className="bg-primary-600 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cart.itemCount > 99 ? '99+' : cart.itemCount}
                                </span>
                            )}
                        </Link>
                        <Link
                            to="/checkout"
                            className={`font-medium py-2 px-3 rounded-lg transition-colors duration-200 ${isActive('/checkout')
                                ? 'bg-primary-50 text-primary-700'
                                : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50'
                                }`}
                            aria-label="Checkout page"
                        >
                            Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
