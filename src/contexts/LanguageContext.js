"use client";

import { createContext, useContext } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children, globalContent = {}, lang = 'en' }) {
  // We no longer need state or localStorage for language.
  // The URL drives the language now (e.g. /en/travel vs /es/travel).
  const currentLang = lang;
  
  // We can pretend it's always mounted since there's no hydration mismatch from localStorage
  const isMounted = true; 

  return (
    <LanguageContext.Provider value={{ currentLang, isMounted, globalContent }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
