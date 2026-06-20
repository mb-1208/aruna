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

export const metadata = {
  title: "Travel Experiences - Aruna",
  description: "Explore the best curated travel experiences with Aruna in Bali.",
};

export default function TravelPage() {
  return (
    <main className="min-h-screen bg-white font-sans text-black">
      <Navbar />

      {/* Hero Section */}
      <TravelHero />

      {/* Services Gallery */}
      <ServicesGallery />

      {/* About Section */}
      <AboutSection />

      {/* Image Divider */}
      <ImageDivider />

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />

      {/* CTA Section */}
      <CTA />

      {/* Footer */}
      <Footer />

      {/* Promo Popup */}
      <PromoPopup />
    </main>
  );
}
