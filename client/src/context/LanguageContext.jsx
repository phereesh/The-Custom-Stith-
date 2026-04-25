import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
    en: {
        welcome: "Welcome to",
        tagline: "Your premier destination for custom tailoring services. We create perfectly fitted garments tailored to your unique style and measurements.",
        getStarted: "Get Started",
        createAccount: "Create Account",
        whyChooseUs: "Why Choose Us",
        customFit: "Custom Fit",
        customFitDesc: "Every garment is tailored to your exact measurements for the perfect fit.",
        qualityMaterials: "Quality Materials",
        qualityMaterialsDesc: "We use only the finest fabrics and materials for lasting quality.",
        expertCraftsmanship: "Expert Craftsmanship",
        expertCraftsmanshipDesc: "Skilled tailors with years of experience creating beautiful garments.",
        howWeServe: "How We Serve You",
        howWeServeDesc: "Choose the most convenient way to experience our premium tailoring services.",
        visitBoutique: "Visit Our boutique",
        visitBoutiqueDesc: "Experience the luxury of personalized tailoring in person. Browse our full range of premium fabrics and get measured by our master tailors.",
        bookBoutique: "Book Boutique Visit",
        homeConcierge: "Home Concierge",
        homeConciergeDesc: "Can't come to us? We will come to you with our exclusive home service tailored to your busy schedule.",
        bookHomeVisit: "Book Home Visit",
        readyToGetStarted: "Ready to Get Started?",
        joinUsToday: "Join us today and experience the difference of custom tailoring.",
        navHome: "Home",
        navSuits: "Suits",
        navShirts: "Shirts",
        navPants: "Pants",
        navGuide: "Guide",
        navFabrics: "Fabrics",
        navCollection: "Collection",
        navLogin: "Login",
        navDashboard: "Dashboard",
        navProfile: "Profile",
        navAdmin: "Admin Panel",
        navLogout: "Logout",
        navBuildSuit: "Build Suit",
    },
    ne: {
        welcome: "स्वागत छ",
        tagline: "तपाईंको अनुकूल सिलाई सेवाहरूको लागि प्रिमियर गन्तव्य। हामी तपाईंको अद्वितीय शैली र मापन अनुसार पूर्ण रूपमा फिट हुने लुगाहरू बनाउँछौं।",
        getStarted: "सुरु गरौं",
        createAccount: "खाता बनाउनुहोस्",
        whyChooseUs: "हामीलाई किन रोज्ने?",
        customFit: "अनुकूल फिट",
        customFitDesc: "प्रत्येक लुगा तपाईंको सही मापन अनुसार सिलाइन्छ।",
        qualityMaterials: "गुणस्तरीय सामग्री",
        qualityMaterialsDesc: "हामी स्थायी गुणस्तरका लागि मात्र उत्कृष्ट कपडा र सामग्रीहरू प्रयोग गर्छौं।",
        expertCraftsmanship: "विशेषज्ञ शिल्प कौशल",
        expertCraftsmanshipDesc: "सुन्दर लुगाहरू निर्माणमा वर्षौंको अनुभव भएका दक्ष दर्जीहरू।",
        howWeServe: "हामी तपाईंलाई कसरी सेवा गर्छौं",
        howWeServeDesc: "हाम्रो प्रिमियम सिलाई सेवाहरूको अनुभव गर्न सबैभन्दा सुविधाजनक तरिका छनौट गर्नुहोस्।",
        visitBoutique: "हाम्रो बुटिक भ्रमण गर्नुहोस्",
        visitBoutiqueDesc: "व्यक्तिगत सिलाईको विलासिता आफैं अनुभव गर्नुहोस्। हाम्रा प्रिमियम कपडाहरू हेर्नुहोस् र हाम्रा मास्टर दर्जीहरूबाट मापन लिनुहोस्।",
        bookBoutique: "बुटिक भ्रमण बुक गर्नुहोस्",
        homeConcierge: "होम सेवा",
        homeConciergeDesc: "हामीकहाँ आउन सक्नुहुन्न? तपाईंको व्यस्त तालिका अनुसार हामी हाम्रो विशेष होम सेवाको साथ तपाईंकोमा आउनेछौं।",
        bookHomeVisit: "होम भ्रमण बुक गर्नुहोस्",
        readyToGetStarted: "सुरु गर्न तयार हुनुहुन्छ?",
        joinUsToday: "आजै हामीसँग जोडिनुहोस् र कस्टम सिलाईको भिन्नता अनुभव गर्नुहोस्।",
        navHome: "गृह",
        navSuits: "सुइट",
        navShirts: "शर्ट",
        navPants: "प्यान्ट",
        navGuide: "गाइड",
        navFabrics: "कपडाहरू",
        navCollection: "कलेक्सन",
        navLogin: "लगइन",
        navDashboard: "ड्यासबोर्ड",
        navProfile: "प्रोफाइल",
        navAdmin: "एड्मिन प्यानल",
        navLogout: "लगआउट",
        navBuildSuit: "सुइट बनाउनुहोस्",
    }
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');

    useEffect(() => {
        localStorage.setItem('lang', language);
    }, [language]);

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
