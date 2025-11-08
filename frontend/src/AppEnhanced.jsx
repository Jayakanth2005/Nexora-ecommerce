import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContextEnhanced';
import NotificationProvider from './components/NotificationProvider';
import TutorialProvider from './components/TutorialProvider';
import NavbarEnhanced from './components/NavbarEnhanced';
import ProductsPageEnhanced from './pages/ProductsPageEnhanced';
import CartPage from './pages/CartPage';
// import CheckoutPage from './pages/CheckoutPage';
import { LoadingOverlay } from './components/Loading';
import { healthAPI } from './services/api';
import './utils/i18n';
import './App.css';

function App() {
    const [isAppLoading, setIsAppLoading] = useState(true);
    const [isBackendConnected, setIsBackendConnected] = useState(false);

    useEffect(() => {
        // Check backend connectivity on app startup
        const checkBackendHealth = async () => {
            try {
                await healthAPI.check();
                setIsBackendConnected(true);
            } catch (error) {
                console.warn('Backend not available:', error.message);
                setIsBackendConnected(false);
            } finally {
                setIsAppLoading(false);
            }
        };

        checkBackendHealth();
    }, []);

    if (isAppLoading) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <LoadingOverlay isLoading={true} message="Initializing Nexus...">
                    <div></div>
                </LoadingOverlay>
            </div>
        );
    }

    return (
        <TutorialProvider>
            <NotificationProvider>
                <CartProvider>
                    <Router>
                        <div className="min-h-screen bg-neutral-50">
                            <NavbarEnhanced />

                            {/* Backend Connection Warning */}
                            {!isBackendConnected && (
                                <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
                                    <div className="max-w-7xl mx-auto">
                                        <p className="text-yellow-800 text-sm text-center">
                                            Backend service is not available. Some features may not work properly.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <main>
                                <Routes>
                                    <Route path="/" element={<ProductsPageEnhanced />} />
                                    <Route path="/cart" element={<CartPage />} />
                                    {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
                                </Routes>
                            </main>
                        </div>
                    </Router>
                </CartProvider>
            </NotificationProvider>
        </TutorialProvider>
    );
}

export default App;