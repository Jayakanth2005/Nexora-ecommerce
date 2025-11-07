import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from '../locales/en.json';
import taTranslations from '../locales/ta.json';

const resources = {
    en: {
        translation: enTranslations,
    },
    ta: {
        translation: taTranslations,
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem('preferredLanguage') || 'en',
        fallbackLng: 'en',

        interpolation: {
            escapeValue: false,
        },

        react: {
            useSuspense: false,
        },
    });

export default i18n;