import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RetreatDetailHero from "@/components/retreats/detail/RetreatDetailHero";
import RetreatOverview from "@/components/retreats/detail/RetreatOverview";
import RetreatPricing from "@/components/retreats/detail/RetreatPricing";
import RetreatLocation from "@/components/retreats/detail/RetreatLocation";
import FAQ from "@/components/FAQ";
import RetreatCTA from "@/components/retreats/RetreatCTA";
import { supabase } from "@/lib/supabase";
import {
  SITE_URL,
  SITE_NAME,
  buildAlternates,
  stripHtml,
  getBreadcrumbSchema,
  getFaqSchema,
  serializeJsonLd,
} from "@/lib/seo";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || "en";
  const isEs = lang === "es";

  const { data: dest } = await supabase
    .from("products")
    .select("title, description, content")
    .eq("slug", resolvedParams.slug)
    .eq("type", "retreat")
    .single();

  if (!dest) {
    return {
      title: isEs ? "Detalle de Retiro" : "Retreat Detail",
      alternates: buildAlternates(lang, `/retreats/${resolvedParams.slug}`),
    };
  }

  const content = dest.content || {};
  const displayTitle = isEs ? content.title_es || dest.title : dest.title;
  const rawDesc = isEs
    ? content.description_es || content.overview_es || dest.description || content.overview
    : dest.description || content.overview;
  const cleanDesc =
    stripHtml(rawDesc) ||
    (isEs
      ? `Descubre el retiro ${displayTitle} en Bali con ${SITE_NAME}.`
      : `Immerse yourself in ${displayTitle}, a transformative Bali retreat curated by ${SITE_NAME}.`);
  const ogImage = content.hero_image || content.cover_image;

  return {
    title: displayTitle,
    description: cleanDesc.slice(0, 160),
    alternates: buildAlternates(lang, `/retreats/${resolvedParams.slug}`),
    openGraph: {
      title: `${displayTitle} - ${SITE_NAME}`,
      description: cleanDesc.slice(0, 160),
      url: `${SITE_URL}/${lang}/retreats/${resolvedParams.slug}`,
      siteName: SITE_NAME,
      ...(ogImage ? { images: [{ url: ogImage, alt: displayTitle }] } : {}),
      locale: isEs ? "es_ES" : "en_US",
      type: "website",
    },
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

export default async function RetreatDetailPage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  
  const { data: dest } = await supabase
    .from('products')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .eq('type', 'retreat')
    .single();

  const { data: globalData } = await supabase
    .from('site_content')
    .select('content')
    .eq('id', 'global_settings')
    .single();
    
  const { data: retreatsPageData } = await supabase
    .from('site_content')
    .select('id, content')
    .in('id', ['retreats_page', 'retreats_page_es']);
    
  const retreatsPageEn = retreatsPageData?.find(d => d.id === 'retreats_page')?.content || {};
  const retreatsPageEs = retreatsPageData?.find(d => d.id === 'retreats_page_es')?.content || {};
    
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
  const pricingTitle = isEs ? (content.pricing_title_es || content.pricing_title) : content.pricing_title;
  const pricingSubtitle = isEs ? (content.pricing_subtitle_es || content.pricing_subtitle) : content.pricing_subtitle;
  const basePackages = content.packages || [];
  const packages = basePackages.map(p => ({
    nights: isEs ? (p.nights_es || p.nights) : p.nights,
    price: isEs ? (p.price_es || p.price) : p.price,
    dates: isEs ? (p.dates_es || p.dates || []) : (p.dates || []),
    rooms: isEs ? (p.rooms_es || p.rooms || []) : (p.rooms || []),
    inclusions: isEs ? (p.inclusions_es || p.inclusions || []) : (p.inclusions || []),
  }));
  const locationTitle = isEs ? (content.location_title_es || content.location_title) : content.location_title;
  const locationText = isEs ? (content.location_text_es || content.location_text) : content.location_text;
  const locationImages = content.location_images;
  const heroBookButton = isEs ? (content.hero_book_button_es || content.hero_book_button) : content.hero_book_button;
  let finalFaqs = (content.faqs || []).map(f => ({
    question: isEs ? (f.question_es || f.question) : f.question,
    answer: isEs ? (f.answer_es || f.answer) : f.answer,
  }));

  let finalFaqTitle = isEs ? "¿TIENES PREGUNTAS?" : "HAVE QUESTIONS?";
  let finalFaqSubtitle = isEs ? "PREGUNTAS FRECUENTES" : "FREQUENTLY ASKED QUESTIONS";
  const retreatsPageContent = isEs ? retreatsPageEs : retreatsPageEn;

  if (finalFaqs.length === 0) {
    if (retreatsPageContent.faqItems && retreatsPageContent.faqItems.length > 0) {
      finalFaqs = retreatsPageContent.faqItems;
    } else {
      finalFaqs = detailFaqs[isEs ? 'es' : 'en'] || detailFaqs.en;
    }
  }

  // Always use the main page's FAQ title and subtitle if available
  if (retreatsPageContent.faqTitle) finalFaqTitle = retreatsPageContent.faqTitle;
  if (retreatsPageContent.faqSubtitle) finalFaqSubtitle = retreatsPageContent.faqSubtitle;

  // Determine if all dates are fully booked
  let hasAvailableDates = true;
  if (basePackages && basePackages.length > 0) {
    let availableCount = 0;
    let totalDates = 0;
    
    basePackages.forEach(pkg => {
      if (pkg.dates && pkg.dates.length > 0) {
         pkg.dates.forEach(d => {
            totalDates++;
            const status = (d.status || '').toLowerCase();
            const isUnavailable = status.includes('fully booked') || status.includes('completo') || status.includes('private group') || status.includes('grupo cerrado');
            if (!isUnavailable) {
               availableCount++;
            }
         });
      }
    });

    if (totalDates > 0 && availableCount === 0) {
       hasAvailableDates = false;
    }
  }
  const isSoldOut = !hasAvailableDates;

  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: SITE_NAME, url: `${SITE_URL}/${lang}` },
    {
      name: isEs ? "Retiros en Bali" : "Transformative Bali Retreats",
      url: `${SITE_URL}/${lang}/retreats`,
    },
    {
      name: displayTitle,
      url: `${SITE_URL}/${lang}/retreats/${resolvedParams.slug}`,
    },
  ]);

  const faqJsonLd = getFaqSchema(finalFaqs);

  const retreatJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: displayTitle,
    description: stripHtml(overview || displayDescription),
    url: `${SITE_URL}/${lang}/retreats/${resolvedParams.slug}`,
    image: content.hero_image || content.cover_image || undefined,
    provider: {
      "@type": "TravelAgency",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
    },
  };

  return (
    <main className="min-h-screen font-sans overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(retreatJsonLd),
        }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(faqJsonLd),
          }}
        />
      )}
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
        lang={lang}
        isSoldOut={isSoldOut}
      />

      {/* Overview Section */}
      <RetreatOverview 
        title={overviewTitle}
        description={overview || displayDescription}
        imageUrl={content.overview_image || "https://placehold.co/800x600.png"}
      />

      {content.status !== 'coming_soon' && (
        <>

      {/* Itinerary & Pricing */}
      <RetreatPricing 
        title={pricingTitle}
        subtitle={pricingSubtitle}
        packages={packages}
        englishPackages={basePackages}
        whatsappNumber={content.whatsapp_number}
        retreatTitle={displayTitle}
        englishTitle={dest.title}
        lang={lang}
      />

      {/* Location */}
      <RetreatLocation 
        title={locationTitle}
        text={locationText}
        images={locationImages}
      />

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
        source="Retreat Details CTA"
      />
      </>
      )}

      {/* Footer */}
      <Footer />
    </main>
  );
}
