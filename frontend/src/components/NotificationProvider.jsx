import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((notification) => {
        const id = Date.now() + Math.random();
        const newNotification = {
            id,
            type: 'info',
            duration: 5000,
            ...notification,
        };

        setNotifications(prev => [...prev, newNotification]);

        // Auto remove notification
        if (newNotification.duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, newNotification.duration);
        }

        return id;
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);

    const showSuccess = useCallback((message, options = {}) => {
        return addNotification({ type: 'success', message, ...options });
    }, [addNotification]);

    const showError = useCallback((message, options = {}) => {
        return addNotification({ type: 'error', message, duration: 8000, ...options });
    }, [addNotification]);

    const showWarning = useCallback((message, options = {}) => {
        return addNotification({ type: 'warning', message, duration: 6000, ...options });
    }, [addNotification]);

    const showInfo = useCallback((message, options = {}) => {
        return addNotification({ type: 'info', message, ...options });
    }, [addNotification]);

    const value = {
        notifications,
        addNotification,
        removeNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <NotificationContainer />
        </NotificationContext.Provider>
    );
};

const NotificationContainer = () => {
    const { notifications, removeNotification } = useNotification();

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            <AnimatePresence>
                {notifications.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onRemove={() => removeNotification(notification.id)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

const NotificationItem = ({ notification, onRemove }) => {
    const getIcon = () => {
        switch (notification.type) {
            case 'success':
                return <CheckCircle size={20} className="text-green-600" />;
            case 'error':
                return <XCircle size={20} className="text-red-600" />;
            case 'warning':
                return <AlertCircle size={20} className="text-yellow-600" />;
            default:
                return <Info size={20} className="text-blue-600" />;
        }
    };

    const getColors = () => {
        switch (notification.type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            default:
                return 'bg-blue-50 border-blue-200 text-blue-800';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            className={`flex items-start space-x-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm max-w-sm ${getColors()}`}
        >
            <div className="shrink-0 mt-0.5">
                {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
                {notification.title && (
                    <h4 className="text-sm font-semibold mb-1">{notification.title}</h4>
                )}
                <p className="text-sm">{notification.message}</p>
            </div>
            <button
                onClick={onRemove}
                className="shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity duration-200"
                aria-label="Close notification"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};

export default NotificationProvider;