const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.js', 'utf8');

code = code.replace(
  'import { useState, useEffect } from "react";',
  'import { useState, useEffect } from "react";\nimport { useLanguage } from "@/contexts/LanguageContext";'
);

code = code.replace(
  'const [currentLang, setCurrentLang] = useState("EN");',
  'const { currentLang, setLanguage, globalContent, isMounted } = useLanguage();'
);

code = code.replace(
  'const handleLangChange = (lang) => {\n    setCurrentLang(lang);',
  'const handleLangChange = (lang) => {\n    setLanguage(lang.toLowerCase());'
);

const replaceLinks = `
  const lang = currentLang;
  const navContent = globalContent?.navbar?.[lang] || {
    travel: 'Travel',
    retreats: 'Retreats',
    services: 'Services',
    about: 'About',
    reviews: 'Reviews',
    faq: 'FAQ',
    destinations: 'Destinations',
    gallery: 'Gallery'
  };

  const leftLinks = pathname.startsWith("/retreats")
    ? [
      { name: navContent.destinations || 'Destinations', hash: "#destinations", targetPath: "/retreats" },
      { name: navContent.reviews || 'Reviews', hash: "#reviews", targetPath: "/retreats" },
      { name: navContent.gallery || 'Gallery', hash: "#gallery", targetPath: "/retreats" },
      { name: navContent.faq || 'FAQ', hash: "#faq", targetPath: "/retreats" }
    ]
    : [
      { name: navContent.services || 'Services', hash: "#services", targetPath: "/travel" },
      { name: navContent.about || 'About', hash: "#about", targetPath: "/travel" },
      { name: navContent.reviews || 'Reviews', hash: "#reviews", targetPath: "/travel" },
      { name: navContent.faq || 'FAQ', hash: "#faq", targetPath: "/travel" }
    ];
`;

code = code.replace(/const leftLinks = pathname\.startsWith[\s\S]*?    \];/, replaceLinks);

code = code.replace(/{currentLang}/g, '{isMounted ? currentLang.toUpperCase() : "EN"}');
code = code.replace(/{currentLang === "EN"/g, '{currentLang === "en"');
code = code.replace(/{currentLang === "ES"/g, '{currentLang === "es"');
code = code.replace(/>Travel</g, '>{navContent.travel || "Travel"}<');
code = code.replace(/>Retreats</g, '>{navContent.retreats || "Retreats"}<');

fs.writeFileSync('src/components/Navbar.js', code);
console.log("Navbar updated!");
