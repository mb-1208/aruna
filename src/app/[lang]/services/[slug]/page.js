import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RetreatDetailHero from "@/components/retreats/detail/RetreatDetailHero";
import RetreatOverview from "@/components/retreats/detail/RetreatOverview";
import RetreatPricing from "@/components/retreats/detail/RetreatPricing";
import RetreatLocation from "@/components/retreats/detail/RetreatLocation";
import FAQ from "@/components/FAQ";
import RetreatCTA from "@/components/retreats/RetreatCTA";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { data: dest } = await supabase
    .from('products')
    .select('title')
    .eq('slug', resolvedParams.slug)
    .eq('type', 'service')
    .single();

  return {
    title: dest ? `${dest.title} - Aruna Services` : "Service Detail - Aruna",
    description: "Immerse yourself in a transformative journey of peace and restoration.",
  };
}

const detailFaqs = {
  en: [
    { question: "What should I bring to the retreat?", answer: "We recommend bringing comfortable, loose-fitting clothing for yoga and meditation, a swimsuit, walking shoes, a reusable water bottle, and any personal toiletries. A detailed packing list will be provided upon booking." },
    { question: "Is there WiFi available at the venue?", answer: "Yes, complimentary WiFi is available in common areas. However, to encourage a true digital detox, we recommend limiting screen time to fully immerse yourself in the experience." },
    { question: "How do I get to the retreat location?", answer: "Roundtrip airport transfers are included in most of our packages. Our concierge team will coordinate your pickup based on your flight details." },
    { question: "Can I attend the retreat solo?", answer: "Absolutely! Many of our guests travel solo. It's a wonderful opportunity to connect with like-minded individuals in a safe and welcoming environment." },
    { question: "Is there an age requirement?", answer: "Guests must be at least 18 years old to attend our standard retreats. For family or specialized youth retreats, please check the specific program details." }
  ],
  es: [
    { question: "¿Qué debo llevar al retiro?", answer: "Recomendamos traer ropa cómoda y holgada para yoga y meditación, traje de baño, zapatos para caminar, una botella de agua reutilizable y artículos de aseo personal. Se proporcionará una lista de empaque detallada al reservar." },
    { question: "¿Hay WiFi disponible en el lugar?", answer: "Sí, hay WiFi gratuito disponible en las áreas comunes. Sin embargo, para fomentar una verdadera desintoxicación digital, recomendamos limitar el tiempo de pantalla." },
    { question: "¿Cómo llego a la ubicación del retiro?", answer: "Los traslados de ida y vuelta al aeropuerto están incluidos en la mayoría de nuestros paquetes. Nuestro equipo de conserjería coordinará su recogida según los detalles de su vuelo." },
    { question: "¿Puedo asistir al retiro solo?", answer: "¡Absolutamente! Muchos de nuestros invitados viajan solos. Es una oportunidad maravillosa para conectar con personas afines en un ambiente seguro y acogedor." },
    { question: "¿Hay algún requisito de edad?", answer: "Los huéspedes deben tener al menos 18 años para asistir a nuestros retiros estándar. Para retiros familiares o juveniles especializados, consulte los detalles específicos del programa." }
  ]
};

export default async function ServiceDetailPage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  
  const { data: dest } = await supabase
    .from('products')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .eq('type', 'service')
    .single();

  const { data: globalData } = await supabase
    .from('site_content')
    .select('content')
    .eq('id', 'global_settings')
    .single();
    
  const ctaContent = globalData?.content?.cta || { en: {}, es: {} };

  if (!dest) {
    notFound();
  }

  // Handle translation
  const isEs = lang === 'es';
  const content = dest.content || {};
  const displayTitle = isEs ? (content.title_es || dest.title) : dest.title;
  const displayDate = isEs ? (content.date_es || dest.date) : dest.date;
  const displayDescription = isEs ? (content.description_es || dest.description) : dest.description;

  const overview = isEs ? (content.overview_es || content.overview) : content.overview;
  const pricingTitle = isEs ? (content.pricing_title_es || content.pricing_title) : content.pricing_title;
  const pricingSubtitle = isEs ? (content.pricing_subtitle_es || content.pricing_subtitle) : content.pricing_subtitle;
  const packages = isEs ? (content.packages_es || content.packages) : content.packages;
  const locationTitle = isEs ? (content.location_title_es || content.location_title) : content.location_title;
  const locationText = isEs ? (content.location_text_es || content.location_text) : content.location_text;
  const locationImages = content.location_images;
  const heroBookButton = isEs ? (content.hero_book_button_es || content.hero_book_button) : content.hero_book_button;
  const faqs = isEs ? (content.faqs_es || content.faqs) : content.faqs;

  return (
    <main className="min-h-screen font-sans overflow-x-hidden">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <RetreatDetailHero 
        title={displayTitle}
        subtitle={pricingSubtitle}
        date={displayDate}
        bgImage={content.hero_image || "http://placehold.co/1920x1080.png"}
        bookNowText={heroBookButton}
      />

      {/* Overview Section */}
      <RetreatOverview 
        title={displayTitle}
        description={overview || displayDescription}
        imageUrl={content.overview_image || "http://placehold.co/800x600.png"}
      />

      {/* Itinerary & Pricing */}
      <RetreatPricing 
        title={pricingTitle}
        subtitle={pricingSubtitle}
        packages={packages}
      />

      {/* Location */}
      <RetreatLocation 
        title={locationTitle}
        text={locationText}
        images={locationImages}
      />

      {/* FAQ Section */}
      <FAQ
        data={(faqs && faqs.length > 0) ? faqs : detailFaqs[isEs ? 'es' : 'en']}
        title={isEs ? "LO QUE NECESITAS SABER" : "WHAT YOU NEED TO KNOW"}
        subtitle={isEs ? "Preguntas Frecuentes" : "Frequently Asked Questions"}
      />

      {/* Call To Action */}
      <RetreatCTA 
        title={isEs ? (ctaContent.es.title || "¿NO QUIERES PERDERTE<br className=\"hidden md:block\" />NADA?") : (ctaContent.en.title || "DON'T WANNA MISS<br className=\"hidden md:block\" />A THING?")}
        boxTitle={isEs ? (ctaContent.es.boxTitle || "PONTE EN CONTACTO") : (ctaContent.en.boxTitle || "GET IN TOUCH")}
        text={isEs ? (ctaContent.es.text || "Agregue este formulario de correo electrónico para que sean los primeros en conocer sus detalles y reservas anticipadas.") : (ctaContent.en.text || "Add this email form so that they will be the first to know your details & early booking.")}
        buttonText={isEs ? (ctaContent.es.buttonText || "SUSCRIBIRSE") : (ctaContent.en.buttonText || "SUBSCRIBE")}
        emailLabel={isEs ? (ctaContent.es.emailLabel || "CORREO ELECTRÓNICO") : (ctaContent.en.emailLabel || "EMAIL")}
        source="Travel Details CTA"
      />

      {/* Footer */}
      <Footer />
    </main>
  );
}
