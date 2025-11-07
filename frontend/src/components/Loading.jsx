import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', color = 'blue', className = '' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12',
    };

    const colorClasses = {
        blue: 'text-blue-600',
        white: 'text-white',
        gray: 'text-gray-600',
        red: 'text-red-600',
        green: 'text-green-600',
    };

    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
        >
            <Loader2 className="w-full h-full" />
        </motion.div>
    );
};

const LoadingOverlay = ({ isLoading, children, message = 'Loading...' }) => {
    if (!isLoading) return children;

    return (
        <div className="relative">
            <div className="opacity-50 pointer-events-none">
                {children}
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                <div className="flex flex-col items-center space-y-4">
                    <LoadingSpinner size="lg" />
                    <p className="text-gray-600 font-medium">{message}</p>
                </div>
            </div>
        </div>
    );
};

const LoadingCard = ({ className = '' }) => {
    return (
        <div className={`animate-pulse ${className}`}>
            <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
            <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
        </div>
    );
};

const LoadingGrid = ({ count = 8, className = '' }) => {
    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
            {Array.from({ length: count }).map((_, index) => (
                <LoadingCard key={index} />
            ))}
        </div>
    );
};

export { LoadingSpinner, LoadingOverlay, LoadingCard, LoadingGrid };
export default LoadingSpinner;