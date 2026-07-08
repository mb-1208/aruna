import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('c:/Users/mbntn/Documents/Reelle/Aruna/Production/aruna/.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const globalData = {
  navbar: {
    en: {
      travel: "Travel",
      retreats: "Retreats",
      services: "Services",
      about: "About",
      reviews: "Reviews",
      faq: "FAQ",
      destinations: "Destinations",
      gallery: "Gallery"
    },
    es: {
      travel: "Viajes",
      retreats: "Retiros",
      services: "Servicios",
      about: "Sobre Nosotros",
      reviews: "Reseñas",
      faq: "Preguntas Frecuentes",
      destinations: "Destinos",
      gallery: "Galería"
    }
  },
  footer: {
    en: {
      description: "Aruna brings you to exotic destinations with a personal, refined touch.",
      theCompany: "The Company",
      stayConnected: "Stay Connected",
      newsletterText: "Join our newsletter for exclusive travel tips and early access to our curated retreats.",
      emailPlaceholder: "Email",
      subscribe: "Subscribe",
      copyright: "© 2026 Aruna. All rights reserved.",
      legal: "Legal",
      privacy: "Privacy Policy"
    },
    es: {
      description: "Aruna te lleva a destinos exóticos con un toque personal y refinado.",
      theCompany: "La Empresa",
      stayConnected: "Mantente Conectado",
      newsletterText: "Únete a nuestro boletín para consejos de viaje exclusivos y acceso anticipado a nuestros retiros curados.",
      emailPlaceholder: "Correo electrónico",
      subscribe: "Suscribirse",
      copyright: "© 2026 Aruna. Todos los derechos reservados.",
      legal: "Legal",
      privacy: "Política de Privacidad"
    }
  },
  promo: {
    en: {
      heading: "Get 10% off on your<br />first trip",
      description: "Become a part of our community and be the first to get notified about new destinations",
      emailPlaceholder: "E-mail",
      button: "Sign Up Now"
    },
    es: {
      heading: "Obtén un 10% de descuento<br />en tu primer viaje",
      description: "Conviértete en parte de nuestra comunidad y sé el primero en enterarte de nuevos destinos",
      emailPlaceholder: "Correo electrónico",
      button: "Regístrate Ahora"
    }
  }
};

const homePageData = {
  travelTitle: "Travel",
  travelButton: "View",
  retreatsTitle: "Retreats",
  retreatsButton: "View",
  travelTitle_es: "Viajes",
  travelButton_es: "Ver",
  retreatsTitle_es: "Retiros",
  retreatsButton_es: "Ver"
};

const travelPageData = {
  heroTitle: "Explore The Best<br/>Curated Travel<br/>Experiences",
  heroTitle_es: "Explora Las Mejores<br/>Experiencias de Viaje<br/>Curadas",
  services: [
    { title: "Service A", subtitle: "Explore" },
    { title: "Service B", subtitle: "Explore" },
    { title: "Service C", subtitle: "Explore" }
  ],
  services_es: [
    { title: "Servicio A", subtitle: "Explorar" },
    { title: "Servicio B", subtitle: "Explorar" },
    { title: "Servicio C", subtitle: "Explorar" }
  ],
  aboutSubtitle: "About Us",
  aboutSubtitle_es: "Sobre Nosotros",
  aboutTitle: "Find Serenity In<br/>Every Journey",
  aboutTitle_es: "Encuentra Serenidad En<br/>Cada Viaje",
  aboutText: "We believe that travel is more than just a change of scenery—it is an opportunity to reconnect with yourself. At Aruna, we curate bespoke travel experiences that blend untouched natural beauty with soul-soothing luxury. Let us craft a journey that not only explores the world but also restores your spirit.",
  aboutText_es: "Creemos que viajar es más que un simple cambio de escenario: es una oportunidad para reconectarte contigo mismo. En Aruna, creamos experiencias de viaje a medida que combinan la belleza natural intacta con un lujo que calma el alma. Permítenos diseñar un viaje que no solo explore el mundo, sino que también restaure tu espíritu.",
  aboutQuote: "\"Hello! I am Jessica, the founder of Aruna. Having traveled extensively, I believe true luxury is finding peace in the world's most beautiful corners. I created Aruna to blend world-class adventure with soul-restoring tranquility, crafting deeply personal, transformative journeys just for you.\"",
  aboutQuote_es: "\"¡Hola! Soy Jessica, la fundadora de Aruna. Habiendo viajado extensamente, creo que el verdadero lujo es encontrar paz en los rincones más hermosos del mundo. Creé Aruna para combinar aventuras de clase mundial con una tranquilidad que restaura el alma, creando viajes profundamente personales y transformadores solo para ti.\"",
  testimonialsSubtitle: "Stories From Our Travelers",
  testimonialsSubtitle_es: "Historias de Nuestros Viajeros",
  testimonialsTitle: "Stories From<br/>Our Travelers",
  testimonialsTitle_es: "Historias de<br/>Nuestros Viajeros",
  faqSubtitle: "Frequently Asked Questions",
  faqSubtitle_es: "Preguntas Frecuentes",
  faqTitle: "What You Need To Know",
  faqTitle_es: "Lo Que Necesitas Saber",
  faqItems: [
    { question: "How do I book a travel package?", answer: "Simply browse our curated offerings and use the 'Contact' form to connect with our travel specialists for a personalized consultation." },
    { question: "Can I customize my travel itinerary?", answer: "Yes, all of our travel packages can be tailored to suit your specific preferences, schedule, and interests." },
    { question: "What is your cancellation and refund policy?", answer: "Our cancellation policy varies depending on the destination and package. Please review the specific terms during booking." },
    { question: "What level of service can I expect?", answer: "We pride ourselves on providing exceptional, personalized service at every step of your journey, ensuring a seamless experience." },
    { question: "What is the best time of year to book a retreat?", answer: "The ideal time depends on the destination. Our specialists can guide you based on weather, local events, and peak seasons." }
  ],
  faqItems_es: [
    { question: "¿Cómo reservo un paquete de viaje?", answer: "Simplemente navega por nuestras ofertas curadas y usa el formulario de 'Contacto' para hablar con nuestros especialistas en viajes para una consulta personalizada." },
    { question: "¿Puedo personalizar mi itinerario de viaje?", answer: "Sí, todos nuestros paquetes de viaje se pueden adaptar para satisfacer tus preferencias, horarios e intereses específicos." },
    { question: "¿Cuál es su política de cancelación y reembolso?", answer: "Nuestra política de cancelación varía según el destino y el paquete. Revisa los términos específicos al realizar la reserva." },
    { question: "¿Qué nivel de servicio puedo esperar?", answer: "Nos enorgullecemos de brindar un servicio excepcional y personalizado en cada paso de tu viaje, garantizando una experiencia perfecta." },
    { question: "¿Cuál es la mejor época del año para reservar un retiro?", answer: "El momento ideal depende del destino. Nuestros especialistas pueden guiarte según el clima, los eventos locales y las temporadas altas." }
  ],
  ctaTitle: "Ready For Your Next<br class=\"hidden md:block\"/> Bespoke Adventure?",
  ctaTitle_es: "¿Listo Para Tu Próxima<br class=\"hidden md:block\"/> Aventura a Medida?",
  ctaText: "Contact",
  ctaText_es: "Contacto",
  ctaPromoText: "10% Off<br/>First Trip",
  ctaPromoText_es: "10% de Descuento<br/>Primer Viaje"
};

const retreatsPageData = {
  heroTitle: "RECONNECT WITH YOURSELF IN TOTAL SERENITY",
  heroTitle_es: "RECONÉCTATE CONTIGO MISMO EN TOTAL SERENIDAD",
  introSubtitle: "Meet Aruna Retreats",
  introSubtitle_es: "Conoce Aruna Retreats",
  introTitle: "ESCAPE THE NOISE AND RECONNECT WITH YOUR INNER SELF. ARUNA RETREATS OFFERS CURATED WELLNESS JOURNEYS DESIGNED TO RESTORE YOUR MIND, BODY, AND SPIRIT IN NATURE'S MOST TRANQUIL SANCTUARIES.",
  introTitle_es: "ESCAPA DEL RUIDO Y RECONÉCTATE CON TU SER INTERIOR. ARUNA RETREATS OFRECE VIAJES DE BIENESTAR CURADOS DISEÑADOS PARA RESTAURAR TU MENTE, CUERPO Y ESPÍRITU EN LOS SANTUARIOS MÁS TRANQUILOS DE LA NATURALEZA.",
  experienceSubtitle: "Destinations",
  experienceSubtitle_es: "Destinos",
  experienceTitle: "THE EXPERIENCE",
  experienceTitle_es: "LA EXPERIENCIA",
  quoteSubtitle: "Reviews",
  quoteSubtitle_es: "Reseñas",
  quoteTitle: "WHAT THEY SAY",
  quoteTitle_es: "LO QUE DICEN",
  faqSubtitle: "FREQUENTLY ASKED QUESTIONS",
  faqSubtitle_es: "PREGUNTAS FRECUENTES",
  faqTitle: "WHAT YOU NEED TO KNOW",
  faqTitle_es: "LO QUE NECESITAS SABER",
  faqItems: [
    { question: "How are accommodations assigned?", answer: "Accommodations are assigned based on the room type you select during booking. We offer private and shared options to suit your comfort and budget." },
    { question: "Is food included in the retreat price?", answer: "Yes, all meals are included. We provide healthy, locally sourced, and delicious options, and can accommodate most dietary restrictions if notified in advance." },
    { question: "Do I need prior yoga or meditation experience?", answer: "Not at all. Our retreats are designed for all levels, from beginners to advanced practitioners. Our instructors provide modifications to ensure everyone feels supported." },
    { question: "What is your cancellation policy?", answer: "We require a deposit to secure your spot. Cancellations made 60 days before the retreat are fully refundable, minus a small processing fee. Please see our full terms for details." }
  ],
  faqItems_es: [
    { question: "¿Cómo se asignan los alojamientos?", answer: "Los alojamientos se asignan según el tipo de habitación que seleccione durante la reserva. Ofrecemos opciones privadas y compartidas para adaptarnos a su comodidad y presupuesto." },
    { question: "¿La comida está incluida en el precio del retiro?", answer: "Sí, todas las comidas están incluidas. Ofrecemos opciones saludables, de origen local y deliciosas, y podemos adaptarnos a la mayoría de las restricciones dietéticas si se nos notifica con anticipación." },
    { question: "¿Necesito experiencia previa en yoga o meditación?", answer: "En absoluto. Nuestros retiros están diseñados para todos los niveles, desde principiantes hasta practicantes avanzados. Nuestros instructores ofrecen modificaciones para que todos se sientan apoyados." },
    { question: "¿Cuál es su política de cancelación?", answer: "Requerimos un depósito para asegurar su lugar. Las cancelaciones realizadas 60 días antes del retiro son totalmente reembolsables, menos una pequeña tarifa de procesamiento. Consulte nuestros términos completos para obtener más detalles." }
  ],
  ctaTitle: "DON'T WANNA MISS<br className=\"hidden md:block\" />A THING?",
  ctaTitle_es: "¿NO QUIERES PERDERTE<br className=\"hidden md:block\" />NADA?",
  ctaText: "Add this email form so that they will be the first to know your details & early booking.",
  ctaText_es: "Agregue este formulario de correo electrónico para que sean los primeros en conocer sus detalles y reserva anticipada."
};

const contactPageData = {
  title: "GET IN TOUCH",
  title_es: "PONTE EN CONTACTO",
  labels: {
    name: "Name",
    email: "Email",
    phone: "Phone",
    subject: "Subject",
    comment: "Comment",
    button: "Send Message",
    name_es: "Nombre",
    email_es: "Correo electrónico",
    phone_es: "Teléfono",
    subject_es: "Asunto",
    comment_es: "Comentario",
    button_es: "Enviar Mensaje"
  }
};

const legalPageData = {
  title: "LEGAL CENTER",
  title_es: "CENTRO LEGAL",
  content: [
    { title: "1. Company Identity", description: "For official correspondence and transparency, here are our business details:", items: ["Registered Name: PT. XYZ Travel Indonesia", "Business Address: Full Office Address in Bali", "Business Registration (NIB): Insert Number", "Contact Email: legal@yourdomain.com"] },
    { title: "2. Important Disclaimers", description: "By participating in our retreats, you acknowledge the following:", items: ["Travel Risks & Insurance: While we prioritize safety, travel in Indonesia involves inherent risks...", "Physical & Mental Wellbeing: Our retreats may include physical activities...", "Force Majeure: We cannot be held liable for failure to perform our obligations..."] }
  ],
  content_es: [
    { title: "1. Identidad de la Empresa", description: "Para correspondencia oficial y transparencia, aquí están nuestros detalles comerciales:", items: ["Nombre Registrado: PT. XYZ Travel Indonesia", "Dirección Comercial: Dirección completa de la oficina en Bali", "Registro Comercial (NIB): Insertar Número", "Correo de Contacto: legal@yourdomain.com"] },
    { title: "2. Avisos Importantes", description: "Al participar en nuestros retiros, usted reconoce lo siguiente:", items: ["Riesgos de Viaje y Seguro: Si bien priorizamos la seguridad, viajar en Indonesia implica riesgos inherentes...", "Bienestar Físico y Mental: Nuestros retiros pueden incluir actividades físicas...", "Fuerza Mayor: No podemos hacernos responsables del incumplimiento de nuestras obligaciones..."] }
  ]
};

const privacyPageData = {
  title: "PRIVACY POLICY",
  title_es: "POLÍTICA DE PRIVACIDAD",
  content: [
    { title: "1. What Information We Collect", description: "To provide you with a seamless retreat experience, we collect only the information that is necessary.", items: ["Identity Information: Full name, passport details...", "Contact Information: Email address, phone number..."] }
  ],
  content_es: [
    { title: "1. Qué Información Recopilamos", description: "Para brindarle una experiencia de retiro perfecta, recopilamos solo la información necesaria.", items: ["Información de Identidad: Nombre completo, detalles del pasaporte...", "Información de Contacto: Dirección de correo electrónico, número de teléfono..."] }
  ]
};

async function seed() {
  console.log("Seeding site content...");
  
  const pages = [
    { id: 'global_settings', content: globalData },
    { id: 'home_page', content: homePageData },
    { id: 'travel_page', content: travelPageData },
    { id: 'retreats_page', content: retreatsPageData },
    { id: 'contact_page', content: contactPageData },
    { id: 'legal_page', content: legalPageData },
    { id: 'privacy_page', content: privacyPageData },
  ];

  for (const page of pages) {
    const { error } = await supabase
      .from('site_content')
      .upsert({ id: page.id, content: page.content });
      
    if (error) {
      console.error(`Error upserting ${page.id}:`, error.message);
    } else {
      console.log(`Success upserting ${page.id}`);
    }
  }

  console.log("Done.");
}

seed();
