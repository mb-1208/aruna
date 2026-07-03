"use client";

import Navbar from "@/components/Navbar";
import TravelHero from "@/components/TravelHero";
import ServicesGallery from "@/components/ServicesGallery";
import AboutSection from "@/components/AboutSection";
import ImageDivider from "@/components/ImageDivider";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import PromoPopup from "@/components/PromoPopup";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TravelClient({ initialContent }) {
  const { currentLang } = useLanguage();
  const langContent = currentLang === 'es' ? (initialContent.es || {}) : initialContent;
  
  // Merge so we fallback to English if Spanish is empty
  const content = { ...initialContent, ...langContent };

  return (
    <main className="min-h-screen bg-white font-sans text-black">
      <Navbar />

      {/* Hero Section */}
      <TravelHero title={content.heroTitle} image={content.heroImage} scrollText={content.scrollLabel || content.scrollText} />

      {/* Services Gallery */}
      <ServicesGallery 
        data={initialContent.servicesData} 
        fallbackData={content.services} 
        currentLang={currentLang} 
      />

      {/* About Section */}
      <AboutSection 
        subtitle={content.aboutSubtitle}
        title={content.aboutTitle}
        text={content.aboutText}
        quote={content.aboutQuote}
        image={content.aboutImage}
      />

      {/* Image Divider */}
      <ImageDivider image={content.dividerImage} />

      {/* Testimonials */}
      <Testimonials 
        subtitle={content.testimonialsSubtitle} 
        title={content.testimonialsTitle} 
        subtext={content.testimonialsSubtext}
        reviews={(initialContent.reviews || []).filter(r => r.category === 'travel')}
        currentLang={currentLang}
      />

      {/* FAQ */}
      <FAQ subtitle={content.faqSubtitle} title={content.faqTitle} data={content.faqItems} />

      {/* CTA Section */}
      <CTA title={content.ctaTitle} buttonText={content.ctaText} text={content.ctaPromoText} image={content.ctaImage} />

      <Footer />
      <PromoPopup />
    </main>
  );
}
