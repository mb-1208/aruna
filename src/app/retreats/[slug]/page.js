import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RetreatDetailHero from "@/components/retreats/detail/RetreatDetailHero";
import RetreatOverview from "@/components/retreats/detail/RetreatOverview";
import RetreatPricing from "@/components/retreats/detail/RetreatPricing";
import RetreatLocation from "@/components/retreats/detail/RetreatLocation";
import FAQ from "@/components/FAQ";
import RetreatCTA from "@/components/retreats/RetreatCTA";

export const metadata = {
  title: "Retreat Detail - Aruna",
  description: "Immerse yourself in a transformative journey of peace and restoration.",
};

const detailFaqs = [
  {
    question: "What should I bring to the retreat?",
    answer: "We recommend bringing comfortable, loose-fitting clothing for yoga and meditation, a swimsuit, walking shoes, a reusable water bottle, and any personal toiletries. A detailed packing list will be provided upon booking."
  },
  {
    question: "Is there WiFi available at the venue?",
    answer: "Yes, complimentary WiFi is available in common areas. However, to encourage a true digital detox, we recommend limiting screen time to fully immerse yourself in the experience."
  },
  {
    question: "How do I get to the retreat location?",
    answer: "Roundtrip airport transfers are included in most of our packages. Our concierge team will coordinate your pickup based on your flight details."
  },
  {
    question: "Can I attend the retreat solo?",
    answer: "Absolutely! Many of our guests travel solo. It's a wonderful opportunity to connect with like-minded individuals in a safe and welcoming environment."
  },
  {
    question: "Is there an age requirement?",
    answer: "Guests must be at least 18 years old to attend our standard retreats. For family or specialized youth retreats, please check the specific program details."
  }
];

export default function RetreatDetailPage() {
  return (
    <main className="min-h-screen font-sans overflow-x-hidden">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <RetreatDetailHero />

      {/* Overview Section */}
      <RetreatOverview />

      {/* Itinerary & Pricing */}
      <RetreatPricing />

      {/* Location */}
      <RetreatLocation />

      {/* FAQ Section */}
      <FAQ
        data={detailFaqs}
        title="WHAT YOU NEED TO KNOW"
        subtitle="Frequently Asked Questions"
      />

      {/* Call To Action */}
      <RetreatCTA />

      {/* Footer */}
      <Footer />
    </main>
  );
}
