import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "Tracker": "Tracker",
      "Analytics": "Analytics",
      "Recipes": "Recipes",
      "Campaigns": "Campaigns",
      "Rewards": "Rewards",
      "Verify": "Verify"
    }
  },
  hi: {
    translation: {
      "Tracker": "ट्रैकर",
      "Analytics": "विश्लेषण",
      "Recipes": "विधियाँ",
      "Campaigns": "अभियान",
      "Rewards": "इनाम",
      "Verify": "सत्यापित करें"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
