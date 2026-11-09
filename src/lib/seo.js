export const SITE_URL = "https://www.arunatravelstudio.com";
export const SITE_NAME = "Aruna Travel Studio";
export const OFFICIAL_EMAIL = "hello@arunatravelstudio.com";
export const OFFICIAL_PHONE = "+62 877 4543 7915";
export const OFFICIAL_PHONE_SCHEMA = "+62-877-4543-7915";
export const OFFICIAL_INSTAGRAM = "https://www.instagram.com/arunatravelstudio/";

export const DEFAULT_SEO = {
  en: {
    title: "Travel Experiences - Aruna Travel Studio | Transformative Journeys & Retreats in Bali",
    shortTitle: "Travel Experiences - Aruna Travel Studio",
    description:
      "Helping you discover your own Bali through thoughtfully designed journeys and retreats. Contact us at +62 877 4543 7915 or hello@arunatravelstudio.com.",
    heroHeading: "Transformative Journeys & Thoughtfully Designed Retreats in Bali",
  },
  es: {
    title: "Experiencias de Viaje - Aruna Travel Studio | Viajes y Retiros Transformadores en Bali",
    shortTitle: "Experiencias de Viaje - Aruna Travel Studio",
    description:
      "Te ayudamos a descubrir tu propio Bali a través de viajes a medida y retiros transformadores. Contáctanos al +62 877 4543 7915 o hello@arunatravelstudio.com.",
    heroHeading: "Viajes Transformadores y Retiros Cuidadosamente Diseñados en Bali",
  },
};

/**
 * Resolves the homepage SEO title, replacing overly short/generic CMS values
 * (like "Aruna") with the authoritative brand title requested by the client.
 */
export function resolveHomeTitle(cmsTitle, lang = "en") {
  const fallback = DEFAULT_SEO[lang]?.title || DEFAULT_SEO.en.title;
  if (!cmsTitle || typeof cmsTitle !== "string") return fallback;
  const trimmed = cmsTitle.trim();
  if (
    trimmed.length < 25 ||
    trimmed.toLowerCase() === "aruna" ||
    trimmed.toLowerCase() === "aruna travel studio"
  ) {
    return fallback;
  }
  return trimmed;
}

/**
 * Resolves the homepage meta description, replacing empty or overly short CMS values
 * (like "Transformative Journeys.") with the full authoritative description.
 */
export function resolveHomeDescription(cmsDescription, lang = "en") {
  const fallback = DEFAULT_SEO[lang]?.description || DEFAULT_SEO.en.description;
  if (!cmsDescription || typeof cmsDescription !== "string") return fallback;
  const trimmed = cmsDescription.trim();
  if (trimmed.length < 50) {
    return fallback;
  }
  return trimmed;
}

/**
 * Strips HTML tags and normalizes whitespace for clean meta descriptions and schema text.
 */
export function stripHtml(html = "") {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Builds canonical and hreflang alternates for any route path.
 * @param {string} lang - 'en' or 'es'
 * @param {string} subPath - e.g. '' for home, '/travel', '/retreats/bali-bliss'
 */
export function buildAlternates(lang = "en", subPath = "") {
  const validLang = lang === "es" ? "es" : "en";
  const normalizedPath = subPath
    ? subPath.startsWith("/")
      ? subPath
      : `/${subPath}`
    : "";

  return {
    canonical: `${SITE_URL}/${validLang}${normalizedPath}`,
    languages: {
      en: `${SITE_URL}/en${normalizedPath}`,
      es: `${SITE_URL}/es${normalizedPath}`,
      "x-default": `${SITE_URL}/en${normalizedPath}`,
    },
  };
}

/**
 * Safely serializes JSON-LD object preventing XSS injection as recommended by Next.js docs.
 */
export function serializeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Generates the core TravelAgency + WebSite + SiteNavigationElement JSON-LD graph
 * for GEO (Google AI Overview, ChatGPT Search, Perplexity) and Google Sitelinks.
 */
export function getGlobalSchemaGraph(globalContent = {}, lang = "en") {
  const isEs = lang === "es";
  const email =
    globalContent?.footer?.[lang]?.email ||
    globalContent?.footer?.en?.email ||
    OFFICIAL_EMAIL;
  const rawPhone =
    globalContent?.footer?.[lang]?.phone ||
    globalContent?.footer?.en?.phone ||
    OFFICIAL_PHONE_SCHEMA;
  const phone =
    rawPhone.includes("851 2222 3333") ? OFFICIAL_PHONE_SCHEMA : rawPhone;

  const socialLinks = globalContent?.social_links || {};
  const sameAsSet = new Set([OFFICIAL_INSTAGRAM]);
  if (socialLinks.instagram && socialLinks.instagram.startsWith("http")) {
    sameAsSet.add(socialLinks.instagram);
  }
  if (socialLinks.facebook && socialLinks.facebook.startsWith("http")) {
    sameAsSet.add(socialLinks.facebook);
  }
  if (socialLinks.tiktok && socialLinks.tiktok.startsWith("http")) {
    sameAsSet.add(socialLinks.tiktok);
  }

  const logoUrl =
    globalContent?.logo_url || `${SITE_URL}/favicon.ico`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: "Aruna Bali Journeys & Retreats",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: logoUrl,
        },
        image: logoUrl,
        email,
        telephone: phone,
        description: isEs
          ? "Estudio boutique de diseño de viajes a medida y retiros transformadores ubicado en Badung, Bali, especializado en experiencias personalizadas y retiros de bienestar."
          : "A boutique travel design and retreat studio based in Badung, Bali, specializing in personalized journeys and transformative retreats.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Badung",
          addressRegion: "Bali",
          addressCountry: "ID",
        },
        areaServed: {
          "@type": "Place",
          name: "Bali, Indonesia",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: phone,
          email,
          contactType: "customer service",
          availableLanguage: ["English", "Spanish"],
        },
        sameAs: Array.from(sameAsSet),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: ["en-US", "es-ES"],
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/${lang}/#navigation`,
        name: isEs ? "Navegación Principal" : "Main Site Navigation",
        itemListElement: [
          {
            "@type": "SiteNavigationElement",
            position: 1,
            name: isEs
              ? "Diseño de Viajes en Bali"
              : "Bespoke Travel Design in Bali",
            description: isEs
              ? "Itinerarios de viaje personalizados y experiencias curadas en Bali."
              : "Personalized travel itineraries and curated experiences in Bali.",
            url: `${SITE_URL}/${lang}/travel`,
          },
          {
            "@type": "SiteNavigationElement",
            position: 2,
            name: isEs
              ? "Retiros Transformadores en Bali"
              : "Transformative Bali Retreats",
            description: isEs
              ? "Retiros íntimos de bienestar, desconexión y transformación en Bali."
              : "Soulful wellness and transformative retreats in Bali.",
            url: `${SITE_URL}/${lang}/retreats`,
          },
          {
            "@type": "SiteNavigationElement",
            position: 3,
            name: isEs ? "Contacto y Consultas" : "About & Contact",
            description: isEs
              ? "Ponte en contacto con Aruna Travel Studio en Bali."
              : "Get in touch with Aruna Travel Studio in Bali.",
            url: `${SITE_URL}/${lang}/contact`,
          },
        ],
      },
    ],
  };
}

/**
 * Generates BreadcrumbList JSON-LD for clear hierarchy & Sitelinks.
 */
export function getBreadcrumbSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generates FAQPage JSON-LD from an array of { question, answer } items.
 */
export function getFaqSchema(faqs = []) {
  const validFaqs = (faqs || []).filter((f) => f?.question && f?.answer);
  if (validFaqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: validFaqs.map((faq) => ({
      "@type": "Question",
      name: stripHtml(faq.question),
      acceptedAnswer: {
        "@type": "Answer",
        text: stripHtml(faq.answer),
      },
    })),
  };
}

