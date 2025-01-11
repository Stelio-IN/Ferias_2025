import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar traduções
import en from './en.json';
import pt from './pt.json';

const resources = {
  en: { translation: en },
  pt: { translation: pt },
};

i18n
  .use(LanguageDetector) // Detectar idioma automaticamente
  .use(initReactI18next) // Inicializar integração com React
  .init({
    resources,
    fallbackLng: 'en', // Idioma padrão
    interpolation: { escapeValue: false },
  });

export default i18n;
