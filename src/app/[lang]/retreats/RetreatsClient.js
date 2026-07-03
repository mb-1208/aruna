"use client";

import Navbar from "@/components/Navbar";
import RetreatHero from "@/components/retreats/RetreatHero";
import RetreatIntro from "@/components/retreats/RetreatIntro";
import AboutSection from "@/components/AboutSection";
import TheExperience from "@/components/retreats/TheExperience";
import ImageDivider from "@/components/ImageDivider";
import RetreatQuote from "@/components/retreats/RetreatQuote";
import PhotoMosaic from "@/components/retreats/PhotoMosaic";
import FAQ from "@/components/FAQ";
import RetreatCTA from "@/components/retreats/RetreatCTA";
import Footer from "@/components/Footer";
import PromoPopup from "@/components/PromoPopup";
import { useLanguage } from "@/contexts/LanguageContext";

const retreatsFaqs = [
  {
    question: "How are accommodations assigned?",
    answer: "Accommodations are assigned based on the room type you select during booking. We offer private and shared options to suit your comfort and budget."
  },
  {
    question: "Do I need prior yoga experience?",
    answer: "Not at all. Our classes are designed for all levels, and our instructors provide modifications to ensure everyone feels comfortable and supported."
  },
  {
    question: "What meals are provided during the retreat?",
    answer: "We provide nutritious, locally-sourced meals daily. We can accommodate most dietary restrictions if notified in advance."
  },
  {
    question: "Can I customize the daily schedule?",
    answer: "While we offer a curated schedule to maximize your experience, all activities are optional. You are free to skip any session to rest or explore on your own."
  },
  {
    question: "What is included in the retreat package?",
    answer: "Most packages include accommodation, daily meals, scheduled wellness activities, and group excursions. Flights and personal expenses are generally not included."
  }
];

export default function RetreatsClient({ initialContent }) {
  const { currentLang } = useLanguage();
  const langContent = currentLang === 'es' ? (initialContent.es || {}) : initialContent;
  
  // Merge so we fallback to English if Spanish is empty
  const content = { ...initialContent, ...langContent };

  return (
    <main className="min-h-screen font-sans">
      <Navbar />

      <RetreatHero 
        title={content.heroTitle}
        image={content.heroImage}
        scrollText={content.scrollText || content.scrollLabel}
      />

      <RetreatIntro 
        subtitle={content.introSubtitle}
        title={content.introTitle}
        buttonText={content.introButtonText || (currentLang === 'es' ? "Encuentra el retiro para ti" : "Find Your Retreat")}
      />

      <AboutSection 
        subtitle={content.aboutSubtitle}
        title={content.aboutTitle}
        text={content.aboutText}
        quote={content.aboutQuote}
        image={content.aboutImage}
      />

      <TheExperience 
        destinations={initialContent.destinations} 
        currentLang={currentLang}
        subtitle={content.experienceSubtitle}
        title={content.experienceTitle}
      />

      <ImageDivider image={content.dividerImage1} />

      <RetreatQuote 
        subtitle={content.quoteSubtitle}
        title={content.quoteTitle}
        author={content.quoteAuthor}
        image={content.quoteImage}
        reviews={(initialContent.reviews || []).filter(r => r.category === 'retreat')}
        currentLang={currentLang}
      />

      <PhotoMosaic 
        images={content.mosaicImages} 
        title={content.mosaicTitle} 
      />

      <FAQ
        data={content.faqItems?.length > 0 ? content.faqItems : retreatsFaqs}
        title={content.faqTitle || "WHAT YOU NEED TO KNOW"}
        subtitle={content.faqSubtitle || "FREQUENTLY ASKED QUESTIONS"}
      />

      <RetreatCTA 
        title={content.ctaTitle}
        text={content.ctaText}
        image={content.ctaImage}
        boxTitle={content.ctaBoxTitle}
        emailLabel={content.ctaEmailLabel}
        buttonText={content.ctaButtonText}
        source="Retreats Main Page CTA"
      />

      <Footer />
      <PromoPopup />
    </main>
  );
}
