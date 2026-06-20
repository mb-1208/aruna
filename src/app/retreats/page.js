import Navbar from "@/components/Navbar";
import RetreatHero from "@/components/retreats/RetreatHero";
import RetreatIntro from "@/components/retreats/RetreatIntro";
import TheExperience from "@/components/retreats/TheExperience";
import ImageDivider from "@/components/ImageDivider";
import RetreatQuote from "@/components/retreats/RetreatQuote";
import PhotoMosaic from "@/components/retreats/PhotoMosaic";
import FAQ from "@/components/FAQ";
import RetreatCTA from "@/components/retreats/RetreatCTA";
import Footer from "@/components/Footer";
import PromoPopup from "@/components/PromoPopup";

export const metadata = {
  title: "Retreats - Aruna",
  description: "Reconnect with yourself in total serenity with Aruna Retreats.",
};

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

export default function RetreatsPage() {
  return (
    <main className="min-h-screen font-sans overflow-x-hidden">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <RetreatHero />

      {/* Introduction */}
      <RetreatIntro />

      {/* The Experience (Destinations) */}
      <TheExperience />

      {/* Image Divider */}
      <ImageDivider />

      {/* Testimonial Quote */}
      <RetreatQuote />

      {/* Photo Mosaic Collage */}
      <PhotoMosaic />

      {/* FAQ Section */}
      <FAQ
        data={retreatsFaqs}
        title="WHAT YOU NEED TO KNOW"
        subtitle="FREQUENTLY ASKED QUESTIONS"
      />

      {/* Call To Action */}
      <RetreatCTA />

      {/* Footer */}
      <Footer />

      {/* Promo Popup */}
      <PromoPopup />
    </main>
  );
}
