import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, SkipForward } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TutorialContext = createContext();

export const useTutorial = () => {
    const context = useContext(TutorialContext);
    if (!context) {
        throw new Error('useTutorial must be used within a TutorialProvider');
    }
    return context;
};

const TutorialProvider = ({ children }) => {
    const { t } = useTranslation();
    const [isActive, setIsActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [hasSeenTutorial, setHasSeenTutorial] = useState(false);

    const tutorialSteps = [
        {
            id: 'welcome',
            title: t('tutorial.welcome.title'),
            message: t('tutorial.welcome.message'),
            target: null,
            position: 'center',
        },
        {
            id: 'products',
            title: t('tutorial.products.title'),
            message: t('tutorial.products.message'),
            target: '[data-tutorial="products-grid"]',
            position: 'bottom',
        },
        {
            id: 'cart',
            title: t('tutorial.cart.title'),
            message: t('tutorial.cart.message'),
            target: '[data-tutorial="cart-link"]',
            position: 'bottom',
        },
        {
            id: 'checkout',
            title: t('tutorial.checkout.title'),
            message: t('tutorial.checkout.message'),
            target: '[data-tutorial="checkout-link"]',
            position: 'bottom',
        },
        {
            id: 'features',
            title: t('tutorial.features.title'),
            message: t('tutorial.features.message'),
            target: '[data-tutorial="features"]',
            position: 'top',
        },
    ];

    useEffect(() => {
        const seenTutorial = localStorage.getItem('nexus-tutorial-seen');
        if (!seenTutorial) {
            // Show tutorial after a short delay when the app loads
            setTimeout(() => {
                setIsActive(true);
            }, 1000);
        } else {
            setHasSeenTutorial(true);
        }
    }, []);

    const startTutorial = () => {
        setCurrentStep(0);
        setIsActive(true);
    };

    const nextStep = () => {
        if (currentStep < tutorialSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            closeTutorial();
        }
    };

    const previousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const skipTutorial = () => {
        closeTutorial();
    };

    const closeTutorial = () => {
        setIsActive(false);
        localStorage.setItem('nexus-tutorial-seen', 'true');
        setHasSeenTutorial(true);
    };

    const resetTutorial = () => {
        localStorage.removeItem('nexus-tutorial-seen');
        setHasSeenTutorial(false);
        setCurrentStep(0);
    };

    const value = {
        isActive,
        currentStep,
        tutorialSteps,
        hasSeenTutorial,
        startTutorial,
        nextStep,
        previousStep,
        skipTutorial,
        closeTutorial,
        resetTutorial,
    };

    return (
        <TutorialContext.Provider value={value}>
            {children}
            <TutorialOverlay />
        </TutorialContext.Provider>
    );
};

const TutorialOverlay = () => {
    const {
        isActive,
        currentStep,
        tutorialSteps,
        nextStep,
        previousStep,
        skipTutorial,
        closeTutorial,
    } = useTutorial();

    const { t } = useTranslation();

    if (!isActive) return null;

    const currentStepData = tutorialSteps[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === tutorialSteps.length - 1;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            >
                {/* Tutorial Step Content */}
                <TutorialStep
                    step={currentStepData}
                    stepNumber={currentStep + 1}
                    totalSteps={tutorialSteps.length}
                    isFirstStep={isFirstStep}
                    isLastStep={isLastStep}
                    onNext={nextStep}
                    onPrevious={previousStep}
                    onSkip={skipTutorial}
                    onClose={closeTutorial}
                />
            </motion.div>
        </AnimatePresence>
    );
};

const TutorialStep = ({
    step,
    stepNumber,
    totalSteps,
    isFirstStep,
    isLastStep,
    onNext,
    onPrevious,
    onSkip,
    onClose,
}) => {
    const { t } = useTranslation();

    const getPositionClasses = () => {
        if (step.position === 'center') {
            return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
        }

        // For positioned tooltips, you would calculate based on target element
        // This is a simplified version
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`absolute bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 ${getPositionClasses()}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {stepNumber}
                    </div>
                    <span className="text-sm text-neutral-500">
                        {stepNumber} of {totalSteps}
                    </span>
                </div>

                <button
                    onClick={onClose}
                    className="text-neutral-400 hover:text-neutral-600 transition-colors duration-200"
                    aria-label="Close tutorial"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-neutral-200 rounded-full h-1 mb-6">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stepNumber / totalSteps) * 100}%` }}
                    className="bg-blue-600 h-1 rounded-full"
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Content */}
            <div className="mb-6">
                <h3 className="text-xl font-bold text-neutral-800 mb-3">
                    {step.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                    {step.message}
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                    {!isFirstStep && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onPrevious}
                            className="flex items-center space-x-1 px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors duration-200"
                        >
                            <ChevronLeft size={16} />
                            <span>{t('common.previous')}</span>
                        </motion.button>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onSkip}
                        className="flex items-center space-x-1 px-4 py-2 text-neutral-500 hover:text-neutral-700 transition-colors duration-200"
                    >
                        <SkipForward size={16} />
                        <span>{t('common.skip')}</span>
                    </motion.button>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onNext}
                    className="flex items-center space-x-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                    <span>{isLastStep ? t('common.finish') : t('common.next')}</span>
                    {!isLastStep && <ChevronRight size={16} />}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default TutorialProvider;