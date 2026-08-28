import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RetreatDetailHero from "@/components/retreats/detail/RetreatDetailHero";
import RetreatOverview from "@/components/retreats/detail/RetreatOverview";
import ServiceProcess from "@/components/services/ServiceProcess";

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
    { 
      question: "How does the bespoke travel planning process work?", 
      answer: "We begin with a personal consultation to understand your travel style, preferences, and pace. From there, we curate a tailor-made day-by-day itinerary including private accommodations, authentic cultural encounters, and seamless logistics." 
    },
    { 
      question: "Can I customize the destinations, accommodations, and activities?", 
      answer: "Yes, absolutely. Every aspect of your journey is crafted specifically for you. Whether you desire luxury villas, wellness sanctuaries, hidden temples, or private culinary tastings, we adapt every detail to your vision." 
    },
    { 
      question: "How far in advance should I book my travel service?", 
      answer: "We recommend reaching out at least 4 to 8 weeks prior to your intended arrival, especially during peak travel seasons in Bali, to ensure priority availability for premier villas, private guides, and exclusive experiences." 
    },
    { 
      question: "Do you provide on-ground concierge support during our trip?", 
      answer: "Yes, our dedicated team is available throughout your stay to assist with reservations, schedule adjustments, private chauffeurs, and real-time recommendations." 
    },
    { 
      question: "Can you arrange trips for couples, families, or private groups?", 
      answer: "Certainly! We design bespoke travel itineraries for solo travelers, couples seeking romantic escapes, families requiring child-friendly activities, and private groups traveling together." 
    }
  ],
  es: [
    { 
      question: "¿Cómo funciona el proceso de planificación de viajes a medida?", 
      answer: "Comenzamos con una consulta personalizada para conocer tu estilo de viaje, preferencias y ritmo. A partir de allí, creamos un itinerario a medida día por día con alojamientos privados, encuentros culturales auténticos y logística impecable." 
    },
    { 
      question: "¿Puedo personalizar los destinos, alojamientos y actividades?", 
      answer: "Sí, absolutamente. Cada detalle de tu viaje se diseña exclusivamente para ti. Ya sea que busques villas de lujo, santuarios de bienestar, templos ocultos o experiencias gastronómicas privadas, adaptamos todo a tus deseos." 
    },
    { 
      question: "¿Con cuánta anticipación debo reservar el servicio de viaje?", 
      answer: "Recomendamos contactarnos con al menos 4 a 8 semanas de anticipación, especialmente en temporadas altas en Bali, para garantizar disponibilidad en las mejores villas, guías privados y experiencias exclusivas." 
    },
    { 
      question: "¿Ofrecen asistencia de conserjería durante el viaje?", 
      answer: "Sí, nuestro equipo local está disponible durante toda tu estancia para ayudarte con reservas, ajustes de itinerario, transporte privado y recomendaciones en tiempo real." 
    },
    { 
      question: "¿Organizan viajes para parejas, familias o grupos privados?", 
      answer: "¡Por supuesto! Diseñamos viajes personalizados para viajeros solos, parejas que buscan escapadas románticas, familias y grupos privados." 
    }
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

  const { data: travelPageData } = await supabase
    .from('site_content')
    .select('id, content')
    .in('id', ['travel_page', 'travel_page_es']);
    
  const travelPageEn = travelPageData?.find(d => d.id === 'travel_page')?.content || {};
  const travelPageEs = travelPageData?.find(d => d.id === 'travel_page_es')?.content || {};
    
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
  const overviewTitle = isEs ? (content.overview_title_es || content.overview_title || displayTitle) : (content.overview_title || displayTitle);
  const rightForYou = isEs ? (content.right_for_you_es || content.right_for_you) : content.right_for_you;
  const pricingTitle = isEs ? (content.pricing_title_es || content.pricing_title) : content.pricing_title;
  const pricingSubtitle = isEs ? (content.pricing_subtitle_es || content.pricing_subtitle) : content.pricing_subtitle;
  const locationTitle = isEs ? (content.location_title_es || content.location_title) : content.location_title;
  const locationText = isEs ? (content.location_text_es || content.location_text) : content.location_text;
  const locationImages = content.location_images;
  const heroBookButton = isEs ? (content.hero_book_button_es || content.hero_book_button) : content.hero_book_button;
  const basePackages = content.packages || [];
  const packages = basePackages.map(p => ({
    nights: isEs ? (p.nights_es || p.nights) : p.nights,
    price: isEs ? (p.price_es || p.price) : p.price,
    dates: isEs ? (p.dates_es || p.dates || []) : (p.dates || []),
    rooms: isEs ? (p.rooms_es || p.rooms || []) : (p.rooms || []),
    inclusions: isEs ? (p.inclusions_es || p.inclusions || []) : (p.inclusions || []),
  }));

  let finalFaqs = (content.faqs || []).map(f => ({
    question: isEs ? (f.question_es || f.question) : f.question,
    answer: isEs ? (f.answer_es || f.answer) : f.answer,
  }));

  let finalFaqTitle = isEs ? "¿TIENES PREGUNTAS?" : "HAVE QUESTIONS?";
  let finalFaqSubtitle = isEs ? "PREGUNTAS FRECUENTES" : "FREQUENTLY ASKED QUESTIONS";
  const travelPageContent = isEs ? travelPageEs : travelPageEn;

  if (finalFaqs.length === 0) {
    if (travelPageContent.faqItems && travelPageContent.faqItems.length > 0) {
      finalFaqs = travelPageContent.faqItems;
    } else {
      finalFaqs = detailFaqs[isEs ? 'es' : 'en'] || detailFaqs.en;
    }
  }

  // Always use the main page's FAQ title and subtitle if available
  if (travelPageContent.faqTitle) finalFaqTitle = travelPageContent.faqTitle;
  if (travelPageContent.faqSubtitle) finalFaqSubtitle = travelPageContent.faqSubtitle;

  return (
    <main className="min-h-screen font-sans overflow-x-hidden">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <RetreatDetailHero 
        title={displayTitle}
        subtitle={pricingSubtitle}
        date={displayDate}
        bgImage={content.hero_image || "https://placehold.co/1920x1080.png"}
        bookNowText={heroBookButton}
        whatsappNumber={content.whatsapp_number}
        isComingSoon={content.status === 'coming_soon'}
        isService={true}
        lang={lang}
      />

      {/* Overview Section */}
      <RetreatOverview 
        title={overviewTitle}
        description={overview || displayDescription}
        imageUrl={content.overview_image || "https://placehold.co/800x600.png"}
      />

      {content.status !== 'coming_soon' && (
        <>

      {/* Service Process Section (How It Works & Right For You) */}
      {(content.how_it_works?.length > 0 || rightForYou) && (
        <ServiceProcess 
          howItWorks={content.how_it_works || []}
          rightForYou={rightForYou}
          processTitle={isEs ? content.how_it_works_title_es : content.how_it_works_title}
          rightForYouTitle={isEs ? content.right_for_you_title_es : content.right_for_you_title}
          lang={lang}
        />
      )}



      {/* FAQ Section */}
      <FAQ
        data={finalFaqs}
        title={finalFaqTitle}
        subtitle={finalFaqSubtitle}
      />

      {/* Call To Action */}
      <RetreatCTA 
        title={isEs ? (ctaContent.es.title || "¿NO QUIERES PERDERTE<br className=\"hidden md:block\" />NADA?") : (ctaContent.en.title || "DON'T WANNA MISS<br className=\"hidden md:block\" />A THING?")}
        boxTitle={isEs ? (ctaContent.es.boxTitle || "PONTE EN CONTACTO") : (ctaContent.en.boxTitle || "GET IN TOUCH")}
        text={isEs ? (ctaContent.es.text || "Agregue este formulario de correo electrónico para que sean los primeros en conocer sus detalles y reservas anticipadas.") : (ctaContent.en.text || "Add this email form so that they will be the first to know your details & early booking.")}
        buttonText={isEs ? (ctaContent.es.buttonText || "SUSCRIBIRSE") : (ctaContent.en.buttonText || "SUBSCRIBE")}
        emailLabel={isEs ? (ctaContent.es.emailLabel || "CORREO ELECTRÓNICO") : (ctaContent.en.emailLabel || "EMAIL")}
        image={ctaContent.en.image}
        source="Travel Details CTA"
      />
      </>
      )}

      {/* Footer */}
      <Footer />
    </main>
  );
}
// force refresh
