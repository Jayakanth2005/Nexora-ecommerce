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
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200 shadow-sm"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Brand */}
                    <Link
                        to="/"
                        className="flex items-center space-x-2 group"
                        aria-label="Nexus home"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg"
                        >
                            <span className="text-white font-bold text-sm">N</span>
                        </motion.div>
                        <span className="font-bold text-xl text-neutral-800 group-hover:text-blue-600 transition-colors duration-200">
                            Nexus
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`font-medium transition-all duration-200 relative ${isActive(item.path)
                                        ? 'text-blue-600'
                                        : 'text-neutral-600 hover:text-neutral-800'
                                    }`}
                                aria-label={item.hasCount ? `${item.label} with ${cart.itemCount} items` : item.label}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>{item.label}</span>
                                    {item.hasCount && (
                                        <div className="relative">
                                            <ShoppingCart size={20} />
                                            {cart.itemCount > 0 && (
                                                <motion.span
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center"
                                                >
                                                    {cart.itemCount > 99 ? '99+' : cart.itemCount}
                                                </motion.span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {isActive(item.path) && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                                    />
                                )}
                            </Link>
                        ))}

                        {/* Language Selector */}
                        <div className="relative">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                                className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
                                aria-label={t('nav.language')}
                            >
                                <Globe size={18} />
                                <span className="text-sm font-medium">{i18n.language.toUpperCase()}</span>
                            </motion.button>

                            <AnimatePresence>
                                {isLanguageMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2"
                                    >
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => toggleLanguage(lang.code)}
                                                className={`w-full px-4 py-2 text-left hover:bg-neutral-50 transition-colors duration-200 flex items-center space-x-3 ${i18n.language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-neutral-700'
                                                    }`}
                                            >
                                                <span className="text-lg">{lang.flag}</span>
                                                <span>{lang.name}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        {/* Cart Icon for Mobile */}
                        <Link to="/cart" className="relative">
                            <ShoppingCart size={24} className="text-neutral-600" />
                            {cart.itemCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center"
                                >
                                    {cart.itemCount > 99 ? '99+' : cart.itemCount}
                                </motion.span>
                            )}
                        </Link>

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-neutral-600 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-2"
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden pb-4 border-t border-neutral-200 mt-4"
                        >
                            <div className="flex flex-col space-y-3 pt-4">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-between ${isActive(item.path)
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50'
                                            }`}
                                        aria-label={item.hasCount ? `${item.label} with ${cart.itemCount} items` : item.label}
                                    >
                                        <span>{item.label}</span>
                                        {item.hasCount && cart.itemCount > 0 && (
                                            <span className="bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                                                {cart.itemCount > 99 ? '99+' : cart.itemCount}
                                            </span>
                                        )}
                                    </Link>
                                ))}

                                {/* Mobile Language Selector */}
                                <div className="border-t border-neutral-200 pt-3 mt-3">
                                    <p className="text-sm font-medium text-neutral-500 mb-2">{t('nav.language')}</p>
                                    <div className="flex space-x-2">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    toggleLanguage(lang.code);
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${i18n.language === lang.code
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                                    }`}
                                            >
                                                {lang.flag} {lang.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
};

export default Navbar;