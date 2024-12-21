import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import en_translation_file from '../assets/locales/en/translation.json';
import fa_translation_file from '../assets/locales/fa/translation.json';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    supportedLngs: ['en', 'fa'],
    fallbackLng: 'en',
    resources: {
      en: {
        translation: en_translation_file, // English translations
      },
      fa: {
        translation: fa_translation_file, // Farsi translations
      },
    },
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag', 'subdomain'],
      caches: ['localStorage'],
    },
  });

export default i18next;
