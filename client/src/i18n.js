import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.equipment": "Equipment",
      "nav.finance": "Finance & EMI",
      "nav.reviews": "Reviews",
      "nav.login": "Login",
      "nav.register": "Register",
      "nav.dashboard": "Dashboard",
      "nav.logout": "Logout",
      
      // Hero Section
      "hero.title": "Trusted Agriculture Equipment",
      "hero.subtitle": "Empowering Farmers with Quality Machinery Since Generations",
      "hero.tagline": "Built on Trust, Powered by Community",
      "hero.cta.browse": "Browse Equipment",
      "hero.cta.register": "Register Now",
      
      // Features
      "features.title": "Why Farmers Choose Us",
      "features.quality.title": "Premium Quality",
      "features.quality.desc": "Only the best equipment from trusted manufacturers",
      "features.finance.title": "Easy Financing",
      "features.finance.desc": "Flexible EMI options tailored for farmers",
      "features.service.title": "Expert Service",
      "features.service.desc": "Mechanical engineering expertise you can trust",
      "features.community.title": "Community Trust",
      "features.community.desc": "Serving farming communities for generations",
      
      // Common
      "common.loading": "Loading...",
      "common.submit": "Submit",
      "common.cancel": "Cancel",
      "common.save": "Save",
      "common.edit": "Edit",
      "common.delete": "Delete",
      "common.search": "Search",
      "common.filter": "Filter",
      "common.view": "View",
      "common.close": "Close",
      
      // Footer
      "footer.about": "About Us",
      "footer.contact": "Contact",
      "footer.privacy": "Privacy Policy",
      "footer.terms": "Terms of Service",
      "footer.copyright": "© 2024 AgriShop Pro. All rights reserved.",
    }
  },
  hi: {
    translation: {
      // Navigation
      "nav.home": "होम",
      "nav.equipment": "उपकरण",
      "nav.finance": "वित्त और ईएमआई",
      "nav.reviews": "समीक्षाएं",
      "nav.login": "लॉगिन",
      "nav.register": "पंजीकरण",
      "nav.dashboard": "डैशबोर्ड",
      "nav.logout": "लॉगआउट",
      
      // Hero Section
      "hero.title": "विश्वसनीय कृषि उपकरण",
      "hero.subtitle": "पीढ़ियों से किसानों को गुणवत्तापूर्ण मशीनरी प्रदान करना",
      "hero.tagline": "विश्वास पर बना, समुदाय से संचालित",
      "hero.cta.browse": "उपकरण देखें",
      "hero.cta.register": "अभी पंजीकरण करें",
      
      // Features
      "features.title": "किसान हमें क्यों चुनते हैं",
      "features.quality.title": "प्रीमियम गुणवत्ता",
      "features.quality.desc": "विश्वसनीय निर्माताओं से केवल सर्वोत्तम उपकरण",
      "features.finance.title": "आसान वित्तपोषण",
      "features.finance.desc": "किसानों के लिए लचीले ईएमआई विकल्प",
      "features.service.title": "विशेषज्ञ सेवा",
      "features.service.desc": "यांत्रिक इंजीनियरिंग विशेषज्ञता जिस पर आप भरोसा कर सकते हैं",
      "features.community.title": "समुदाय का विश्वास",
      "features.community.desc": "पीढ़ियों से कृषि समुदायों की सेवा",
      
      // Common
      "common.loading": "लोड हो रहा है...",
      "common.submit": "जमा करें",
      "common.cancel": "रद्द करें",
      "common.save": "सहेजें",
      "common.edit": "संपादित करें",
      "common.delete": "हटाएं",
      "common.search": "खोजें",
      "common.filter": "फ़िल्टर",
      "common.view": "देखें",
      "common.close": "बंद करें",
      
      // Footer
      "footer.about": "हमारे बारे में",
      "footer.contact": "संपर्क करें",
      "footer.privacy": "गोपनीयता नीति",
      "footer.terms": "सेवा की शर्तें",
      "footer.copyright": "© 2024 एग्रीशॉप प्रो। सर्वाधिकार सुरक्षित।",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

// Made with Bob
