import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import pagesFR from "./translations/fr/pages.json";
import pagesEN from "./translations/en/pages.json";
import pagesES from "./translations/es/pages.json";

const LANGUAGES = {
  fr: { translation: { pages: pagesFR } },
  en: { translation: { pages: pagesEN } },
  es: { translation: { pages: pagesES } },
};

i18n.use(initReactI18next).init({
  resources: LANGUAGES,
  lng: "fr",
  fallbackLng: "fr",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
