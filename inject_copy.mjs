import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  console.log("Fetching current data...");
  const { data: contentData, error: err1 } = await supabase.from('site_content').select('*');
  const { data: productsData, error: err2 } = await supabase.from('products').select('*');
  if (err1 || err2) throw err1 || err2;

  const updates = [];
  const getC = (id) => contentData.find(c => c.id === id)?.content || {};
  
  // 1. GLOBAL SETTINGS
  let g = getC('global_settings');
  g.title = { en: "Aruna", es: "Aruna" };
  g.description = { en: "Transformative Journeys", es: "Viajes Transformadores" };
  g.additional_data = g.additional_data || {};
  g.additional_data.email = "hello@arunatravelstudio.com";
  g.additional_data.phone = "+62 851 2222 3333";
  
  g.navbar = {
    en: {
      experiences: "Experiences",
      about: "About Aruna",
      testimonials: "Testimonials",
      faq: "FAQ",
      travel: "Travel Design",
      retreats: "Retreats"
    },
    es: {
      experiences: "Experiencias",
      about: "Sobre Aruna",
      testimonials: "Testimonios",
      faq: "Preguntas Frecuentes",
      travel: "Viajes personalizados",
      retreats: "Retiros"
    }
  };
  
  g.footer = {
    en: {
      tagline: "Helping you discover your own Bali through thoughtfully designed journeys and retreats.",
      column1Title: "The Company",
      link1: "Experiences",
      link2: "About Aruna",
      link3: "Testimonials",
      link4: "FAQ",
      link5: "Contact us",
      column2Title: "Join the Aruna Community",
      newsletterText: "Join our newsletter for exclusive travel tips and early access to our curated retreats.",
      newsletterInput: "E-mail",
      newsletterButton: "Keep me updated",
      copyright: "© 2026 ARUNA, All rights reserved.",
      legal: "Legal Center",
      privacy: "Privacy Policy"
    },
    es: {
      tagline: "Viajes y retiros diseñados para descubrir Bali de una forma auténtica, consciente y transformadora.",
      column1Title: "La Empresa",
      link1: "Experiencias",
      link2: "Sobre Aruna",
      link3: "Testimonios",
      link4: "Preguntas Frecuentes",
      link5: "Contáctanos",
      column2Title: "Forma parte de la comunidad Aruna.",
      newsletterText: "Únete a nuestra comunidad y sé la primera en conocer nuevos retiros, fechas, destinos y experiencias diseñadas para inspirarte, reconectar contigo misma y explorar el mundo de una forma diferente.",
      newsletterInput: "Correo electrónico",
      newsletterButton: "Quiero recibir novedades",
      copyright: "© 2026 ARUNA, Todos los derechos reservados.",
      legal: "Centro Legal",
      privacy: "Política de Privacidad"
    }
  };

  g.cta = {
    en: {
      title: "Would You Like to Join Us on a Future Journey?",
      subtitle: "Join the Waitlist",
      description: "Be the first to discover new retreat dates, destinations, and exclusive experiences before they are released to the public.",
      placeholder: "E-mail",
      button: "Sign Up Now"
    },
    es: {
      title: "¿Te gustaría acompañarnos en una próxima experiencia?",
      subtitle: "Quiero recibir novedades",
      description: "Sé la primera en conocer nuevas fechas, destinos y retiros antes de que se anuncien públicamente.",
      placeholder: "Correo electrónico",
      button: "Suscríbete Ahora"
    }
  };
  
  updates.push({ id: 'global_settings', content: g });
  console.log("Prepared global_settings.");

  // 2. HOME PAGE (Splash)
  let home = getC('home_page');
  home.travelTitle = "TRAVEL DESIGN";
  home.travelButton = "VIEW";
  home.retreatsTitle = "RETREATS";
  home.retreatsButton = "VIEW";
  updates.push({ id: 'home_page', content: home });
  
  let homeEs = getC('home_page_es');
  homeEs.travelTitle = "VIAJES PERSONALIZADOS";
  homeEs.travelButton = "VER";
  homeEs.retreatsTitle = "RETIROS";
  homeEs.retreatsButton = "VER";
  updates.push({ id: 'home_page_es', content: homeEs });

  // 3. TRAVEL PAGE
  let travel = getC('travel_page');
  travel.heroHeadline = "We create personalized Bali journeys designed around you, helping you experience the island in an authentic, mindful, and meaningful way";
  travel.scrollLabel = "KEEP EXPLORING";
  // The service labels A, B, C are usually pulled from `products` where type='service'. 
  // Let's check products later.
  travel.aboutLabel = "About Aruna";
  travel.aboutHeadline = "Because we believe travel can be more than a journey — it can be an experience that stays with you forever";
  travel.aboutBody = "I'm Jessica Vidal, and I've been living in Bali for almost five years. Before settling on the island, I also lived in Kuala Lumpur, an experience that deepened my connection to Southeast Asia and inspired my passion for discovering different cultures, perspectives, and ways of life.<br/><br/>After years working in personal image consulting and supporting women through their own transformation journeys, I found something in Bali that went far beyond travel. For me, this island became a turning point — a place where I reconnected with myself, redefined my priorities, and built a new life aligned with who I truly wanted to be. That experience inspired the creation of Aruna: a space where personalized journeys and transformative retreats in Bali are designed with intention. Because I believe Bali is much more than a trending destination.<br/><br/>My mission is to help you discover a more authentic side of Bali — and perhaps, along the way, reconnect with a part of yourself too.";
  travel.aboutQuote = "Bali wasn't just a destination I visited. It was where I reconnected with myself, rebuilt my life, and discovered how transformative travel can be when experienced with intention. My mission is to help you discover your own special Bali";
  
  travel.testimonialsLabel = "Client Testimonials";
  travel.testimonialsHeadline = "Stories from Our Travelers";
  travel.testimonialsSubtext = "Every journey tells a story. Discover the experiences that inspired our travelers to choose Aruna";
  
  travel.faqLabel = "Frequently Asked Questions";
  travel.faqHeadline = "What You Need to Know";
  travel.faqItems = [
    { question: "How many days do I need to visit Bali?", answer: "While it's possible to visit Bali in just one week, we recommend a minimum of 10 to 14 days to explore different areas of the island at a relaxed pace and enjoy a more complete experience. The ideal length of your trip will depend on your interests, travel style, and the type of experience you're looking for." },
    { question: "How much does a trip to Bali cost?", answer: "Bali is a destination that can accommodate a wide range of budgets, from simple getaways to luxury experiences. The overall cost will depend on factors such as the time of year, accommodation choices, selected activities, and the length of your stay. Our goal is to design an itinerary that aligns with your preferences and budget without compromising on an exceptional experience." },
    { question: "Why hire a Bali travel planning service?", answer: "Planning a trip to Bali can feel overwhelming due to the vast amount of information available. In addition, Bali and Indonesia can sometimes be more complex to navigate than other destinations, with different cultural norms, logistics, and ways of doing things. Our service helps you save time, avoid common mistakes, and discover carefully selected places tailored to your travel style. Thanks to our local knowledge and experience living on the island, you'll enjoy a more authentic, personalized, and stress-free experience." },
    { question: "Do you make hotel and activity reservations?", answer: "We do not handle bookings directly. At Aruna, we specialize in designing and planning personalized journeys in Bali. We provide you with a detailed itinerary, carefully selected accommodation recommendations, and trusted local contacts so that you can make your reservations directly. This gives you complete control over your trip and the flexibility to choose the options that best suit your preferences and budget." },
    { question: "Will my itinerary be fully personalized?", answer: "Absolutely. Every itinerary is designed from scratch based on your interests, travel style, budget, and the type of experience you want to have. Whether you're traveling as a couple, with family, solo, or on your honeymoon, we create a unique journey tailored to you, helping you discover an authentic side of Bali that reflects what truly matters to you." }
  ];
  
  travel.ctaHeadline = "Your Bali Journey Starts Here";
  travel.ctaPromoBadge = "Together, we'll design a personalized experience tailored to your travel style, interests, and the unique side of Bali you're looking to discover";
  travel.ctaButton = "Let's Plan Your Journey";
  updates.push({ id: 'travel_page', content: travel });
  
  let travelEs = getC('travel_page_es');
  travelEs.heroHeadline = "Creamos viajes personalizados para que descubras Bali de una forma auténtica, consciente y adaptada a ti.";
  travelEs.scrollLabel = "DESCUBRE MÁS";
  travelEs.aboutLabel = "Sobre Aruna";
  travelEs.aboutHeadline = "Porque creemos que cada viaje puede convertirse en una experiencia que deja huella";
  travelEs.aboutBody = "Soy Jessica Vidal y vivo en Bali desde hace casi 5 años. Antes de establecerme en la isla, también viví en Kuala Lumpur, una etapa que despertó mi pasión por el Sudeste Asiático y por descubrir otras formas de vivir y entender el mundo.<br/><br/>Después de años trabajando en asesoría de imagen y acompañando a mujeres en procesos de transformación personal, encontré en Bali mucho más que un destino. Para mí, esta isla representó un punto de transición, un lugar donde pude reconectar conmigo misma, redefinir mis prioridades y construir una nueva vida. Así nació Aruna. Un proyecto que combina viajes personalizados y retiros en Bali diseñados para que vivas la isla de una forma auténtica, consciente y transformadora. Porque creo que Bali tiene mucho más que ofrecer que sus paisajes: tiene la capacidad de inspirar cambios que permanecen después de regresar a casa";
  travelEs.aboutQuote = "Bali no fue solo un lugar al que viajé. Fue el lugar donde me reencontré conmigo misma, reconstruí mi vida y descubrí el poder que tiene un viaje cuando se vive con intención. Mi misión es ayudarte a encontrar ese Bali especial para ti.";
  
  travelEs.testimonialsLabel = "Testimonios de Clientes";
  travelEs.testimonialsHeadline = "Historias de Nuestros Viajeros";
  travelEs.testimonialsSubtext = "Cada viaje cuenta una historia. Descubre por qué nuestros viajeros eligieron vivir la suya con Aruna.";
  
  travelEs.faqLabel = "Preguntas Frecuentes (FAQ)";
  travelEs.faqHeadline = "Todo lo que necesitas saber";
  travelEs.faqItems = [
    { question: "¿Cuántos días necesito para visitar Bali?", answer: "Aunque es posible visitar Bali en una semana, recomendamos un mínimo de 10 a 14 días para descubrir diferentes zonas de la isla sin prisas y disfrutar de una experiencia más completa. La duración ideal dependerá de tus intereses, estilo de viaje y el tipo de experiencia que quieras vivir." },
    { question: "¿Cuánto cuesta un viaje a Bali?", answer: "Bali es un destino que puede adaptarse a diferentes presupuestos, desde viajes más sencillos hasta experiencias de lujo. El coste final dependerá de factores como la época del año, el tipo de alojamiento, las actividades elegidas y la duración del viaje. Nuestro objetivo es diseñar un itinerario que se ajuste a tus preferencias y presupuesto sin renunciar a una experiencia excepcional." },
    { question: "¿Por qué contratar un servicio de planificación de viajes a Bali?", answer: "Planificar un viaje a Bali puede resultar abrumador debido a la enorme cantidad de información disponible. Además, Bali e Indonesia tienen sus propias particularidades culturales, logísticas y de organización, algo que puede generar dudas e incertidumbre a la hora de preparar el viaje. Nuestro servicio te ayuda a ahorrar tiempo, evitar errores comunes y descubrir lugares cuidadosamente seleccionados según tu estilo de viaje. Gracias a nuestro conocimiento local y experiencia viviendo en la isla, podrás disfrutar de una experiencia más auténtica, personalizada y libre de estrés." },
    { question: "¿Realizáis las reservas de hoteles y actividades?", answer: "No gestionamos las reservas directamente. En Aruna nos especializamos en el diseño y planificación personalizada de viajes a Bali. Te proporcionaremos una ruta detallada, recomendaciones de alojamiento seleccionadas para ti y contactos de confianza para que puedas realizar las reservas directamente. De esta forma mantienes el control total sobre tu viaje y la flexibilidad de elegir las opciones que mejor se adapten a ti." },
    { question: "¿Mi itinerario será completamente personalizado?", answer: "Sí. Cada itinerario se diseña desde cero teniendo en cuenta tus intereses, estilo de viaje, presupuesto y el tipo de experiencia que deseas vivir. Ya viajes en pareja, en familia, por tu cuenta o en luna de miel, crearemos una propuesta única para que descubras un Bali auténtico, alineado con tus gustos y con aquello que realmente buscas en tu viaje." }
  ];
  
  travelEs.ctaHeadline = "Tu viaje a Bali empieza aquí";
  travelEs.ctaPromoBadge = "Diseñemos juntos una experiencia adaptada a tu forma de viajar, tus intereses y aquello que buscas encontrar en la isla.";
  travelEs.ctaButton = "Hablemos de tu viaje";
  updates.push({ id: 'travel_page_es', content: travelEs });

  // 4. RETREATS MAIN PAGE
  let retreats = getC('retreats_page');
  retreats.heroTitle = "Transformative Journeys to Reconnect with Yourself";
  retreats.scrollText = "EXPLORE UPCOMING RETREATS";
  retreats.introSubtitle = "Explore Upcoming Retreats";
  retreats.ctaText = "Find Your Retreat";
  retreats.introTitle = "More than just a getaway, our retreats are an invitation to slow down, gain clarity, and reconnect with yourself through carefully curated experiences in some of Asia's most inspiring destinations.";
  retreats.destinationsLabel = "Destinations";
  retreats.destinationsHeadline = "Upcoming Experiences";
  retreats.quoteSubtitle = "Testimonials";
  retreats.quoteTitle = "What They Say";
  retreats.pullQuote = "Without a doubt, our Bali experience would not have been the same without Jessica. She designs completely personalized itineraries, pays attention to every detail, and is always there to help with any questions you may have. Nothing feels impossible when you're travelling with her guidance";
  retreats.quoteAttribution = "— Andrea & Antonio";
  retreats.overlayText = "Designed Just for You";
  
  retreats.faqSubtitle = "Frequently Asked Questions";
  retreats.faqTitle = "What You Need to Know";
  retreats.faqItems = [
    { question: "Can I join the retreat on my own?", answer: "Absolutely. In fact, most of our guests join the retreat solo. Our retreats are designed to create a welcoming environment where it's easy to connect with like-minded women who share similar interests. You may arrive on your own, but chances are you'll return home with friendships that last far beyond the journey. Many of the connections formed during our retreats continue to grow long after the experience has ended." },
    { question: "Do I need previous experience with yoga or wellness practices?", answer: "No. Our retreats are open to everyone, regardless of previous experience. While some activities may include yoga, meditation, or wellness practices, this is not a yoga retreat. We use these tools as a way to help you reconnect with yourself, become more present, and experience the journey more consciously. What matters most is not your level of experience, but your willingness to embrace the experience and everything it has to offer." },
    { question: "What's included in the retreat?", answer: "Each retreat includes accommodation, daily breakfast, selected lunches and dinners, as well as all activities and experiences outlined in the itinerary. Transfers throughout the retreat are also included, along with 24/7 support and assistance during your stay, and two pre-retreat video calls to answer any questions, get to know each other, and help you prepare for the experience. Specific inclusions and activities may vary depending on the destination and are detailed on each retreat page." },
    { question: "How many people join each retreat?", answer: "We intentionally keep our groups small to ensure a more personal, meaningful, and enriching experience. Our retreats are limited to a maximum of 10 participants, allowing us to provide more personalized support, encourage genuine connections among guests, and give careful attention to every aspect of the journey. Before confirming a reservation, we also ask each potential guest to complete a short questionnaire and join a discovery call." },
    { question: "Are flights included?", answer: "Flights are not included in the retreat. However, once your spot has been confirmed, we will guide you in finding the best flight options based on your departure city, schedule preferences, and budget. Our goal is to make the travel planning process as smooth as possible and help coordinate arrivals so participants can meet up and begin the experience together from the very start." }
  ];
  updates.push({ id: 'retreats_page', content: retreats });

  let retreatsEs = getC('retreats_page_es');
  retreatsEs.heroTitle = "Viajes transformadores para volver a ti";
  retreatsEs.scrollText = "DESCUBRE LOS PRÓXIMOS RETIROS";
  retreatsEs.introSubtitle = "Descubre los próximos retiros";
  retreatsEs.ctaText = "Encuentra el retiro para ti";
  retreatsEs.introTitle = "Más que una escapada, nuestros retiros son una invitación a parar, ganar claridad y reconectar contigo misma a través de experiencias cuidadosamente diseñadas en algunos de los destinos más inspiradores de Asia.";
  retreatsEs.destinationsLabel = "Destinos";
  retreatsEs.destinationsHeadline = "Próximas experiencias";
  retreatsEs.quoteSubtitle = "Testimonios";
  retreatsEs.quoteTitle = "Cada viaje cuenta una historia";
  retreatsEs.pullQuote = "Sin duda nuestra experiencia en Bali no hubiese sido igual sin Jessica, hace rutas totalmente personalizadas y todo al detalle y además, puedes estar en contacto con ella para cualquier duda que tengas. ¡Todo es posible con ella!";
  retreatsEs.quoteAttribution = "— Andrea & Antonio";
  retreatsEs.overlayText = "Una experiencia diseñada para ti";
  
  retreatsEs.faqSubtitle = "Preguntas Frecuentes";
  retreatsEs.faqTitle = "Todo Lo Que Necesitas Saber";
  retreatsEs.faqItems = [
    { question: "¿Puedo asistir sola al retiro?", answer: "Por supuesto. De hecho, la mayoría de nuestras viajeras se unen por su cuenta. Nuestros retiros están diseñados para crear un entorno acogedor donde resulta fácil conectar con otras mujeres que comparten intereses similares. Vienes sola, pero es muy probable que regreses a casa con amistades que perduren mucho más allá del viaje. Muchas de las conexiones que nacen durante nuestros retiros continúan creciendo incluso después de volver a casa." },
    { question: "¿Necesito experiencia previa en yoga o meditación?", answer: "No. Nuestros retiros están abiertos a cualquier persona, independientemente de su experiencia previa. Aunque algunas actividades pueden incluir yoga, meditación o prácticas de bienestar, este no es un retiro de yoga. Utilizamos estas herramientas como una forma de ayudarte a conectar contigo misma, estar más presente y disfrutar de la experiencia de una manera más consciente. Lo más importante no es el nivel de experiencia, sino venir con ganas de abrirte al viaje y a todo lo que puede ofrecerte." },
    { question: "¿Qué incluye el retiro?", answer: "Cada retiro incluye alojamiento, desayunos diarios, comidas y cenas seleccionadas, además de todas las actividades y experiencias contempladas en el programa. También están incluidos los traslados durante el retiro, la asistencia y acompañamiento 24 horas en destino, así como dos videollamadas previas al viaje para resolver dudas, conocernos mejor y ayudarte a prepararte para la experiencia. Los detalles específicos de cada retiro, así como las actividades incluidas, pueden variar según el destino y se encuentran detallados en la página de cada experiencia." },
    { question: "¿Cuántas personas participan en cada retiro?", answer: "Trabajamos con grupos reducidos para garantizar una experiencia más cercana, personalizada y enriquecedora. Nuestros retiros cuentan con un máximo de 10 participantes, lo que nos permite ofrecer un acompañamiento más individualizado, fomentar conexiones auténticas entre las asistentes y cuidar cada detalle de la experiencia. Además, antes de formalizar la reserva, realizamos un breve cuestionario y una llamada de valoración para conocerte mejor, entender tus expectativas y asegurarnos de que el retiro encaja contigo y con el grupo." },
    { question: "¿Está incluido el vuelo?", answer: "Los vuelos no están incluidos en el retiro. No obstante, una vez confirmada tu plaza, te asesoraremos para encontrar la mejor combinación de vuelos en función de tu ciudad de salida, horarios y presupuesto. Nuestro objetivo es facilitar al máximo la organización del viaje y coordinar los desplazamientos para que las participantes puedan coincidir y comenzar la experiencia juntas desde el primer momento." }
  ];
  updates.push({ id: 'retreats_page_es', content: retreatsEs });

  // 5. LEGAL CENTER PAGE
  let legal = getC('legal_page');
  legal.title = "LEGAL CENTER";
  legal.intro = "At Aruna, we believe trust is the foundation of every meaningful journey. That's why we are committed to complete transparency, ensuring you have access to all the information you need to plan your experience with confidence and peace of mind.<br/><br/>Here you'll find our policies, terms, and legal information, designed to provide clarity and reassurance before, during, and after your journey with us.";
  legal.content = [
    {
      title: "1. Company Identity",
      description: "For official correspondence and transparency, here are our business details:",
      items: [
        "Registered Name: Bali Essence Agency [2901260098525]",
        "Business Address: Jalan Raya Anyar Gang III E, Banjar Anyar Kelod Desa/Kelurahan Kerobokan, Kec. Kuta Utara, Kab. Badung",
        "Business Registration (NIB): 2901260098525",
        "Contact Email: hello@arunatravelstudio.com"
      ]
    },
    {
      title: "2. Important Disclaimers",
      description: "By joining an Aruna experience, you acknowledge and agree to the following:",
      items: [
        "Insurance travel: To participate in our trips and retreats, all guests are required to have valid travel insurance that includes medical assistance, healthcare coverage, and preferably protection against trip cancellations and travel disruptions. While we place great importance on safety and the careful planning of every experience, Aruna cannot be held responsible for costs arising from illness, accidents, cancellations, or unforeseen circumstances beyond our control.",
        "Health & Wellbeing: Some of our experiences may include wellness activities, movement practices, hiking, water sports, or other forms of moderate physical activity. Each participant is responsible for ensuring that their physical and emotional condition is suitable for taking part in the planned activities. Any relevant medical conditions, injuries, allergies, or special circumstances must be disclosed prior to the start of the trip.",
        "Itinerary Changes: We reserve the right to make occasional changes to the itinerary, accommodations, or activities when required due to external circumstances, weather conditions, safety considerations, or other factors beyond our control. Should any changes become necessary, we will always seek suitable alternatives that maintain the quality and overall experience of the journey."
      ]
    },
    {
      title: "3. Intellectual Property",
      description: "",
      items: [
        "All content on this website, including but not limited to text, photographs, designs, brand identity, materials, itineraries, retreat programs, and other creative assets, is the property of Aruna and is protected by applicable intellectual property and copyright laws. The reproduction, distribution, modification, publication, or use of any content without the prior written consent of Aruna is strictly prohibited."
      ]
    },
    {
      title: "4. Have a Question?",
      description: "",
      items: [
        "If you need further information about our policies, terms, or any aspect of your experience with Aruna, we're here to help. Please don't hesitate to get in touch.",
        "Legal Inquiries: hello@aruna.com",
        "Response Time: We aim to respond to all formal inquiries within 48 hours."
      ]
    }
  ];
  updates.push({ id: 'legal_page', content: legal });

  let legalEs = getC('legal_page_es');
  legalEs.title = "Centro Legal";
  legalEs.intro = "En Aruna, creemos que la confianza es el punto de partida de cualquier experiencia memorable. Por eso, trabajamos con total transparencia para que puedas planificar tu viaje con tranquilidad, teniendo siempre acceso a toda la información que necesitas.<br/><br/>En esta sección encontrarás nuestras políticas, términos y documentación legal, diseñados para ofrecerte claridad y seguridad antes, durante y después de tu experiencia con nosotros.";
  legalEs.content = [
    {
      title: "1. Identidad de la Empresa",
      description: "Para correspondencia oficial y transparencia, aquí están los detalles de nuestro negocio:",
      items: [
        "Nombre Registrado: Bali Essence Agency [2901260098525]",
        "Dirección Comercial: Jalan Raya Anyar Gang III E, Banjar Anyar Kelod Desa/Kelurahan Kerobokan, Kec. Kuta Utara, Kab. Badung",
        "Registro Comercial (NIB): 2901260098525",
        "Correo de contacto: hello@arunatravelstudio.com"
      ]
    },
    {
      title: "2. Avisos Importantes",
      description: "Al unirte a una experiencia Aruna, reconoces y aceptas lo siguiente:",
      items: [
        "Seguro de viaje: Para participar en nuestros viajes y retiros es obligatorio contar con un seguro de viaje válido que incluya asistencia médica, gastos sanitarios y, preferiblemente, cobertura por cancelación e incidencias durante el viaje. Aunque ponemos especial atención en la seguridad y la organización de cada experiencia, Aruna no se responsabiliza de los gastos derivados de enfermedades, accidentes, cancelaciones o circunstancias imprevistas fuera de nuestro control.",
        "Salud y bienestar: Algunas de nuestras experiencias pueden incluir actividades de bienestar, movimiento, senderismo, deportes acuáticos u otras actividades físicas de intensidad moderada. Cada participante es responsable de asegurarse de que su estado físico y emocional es adecuado para participar en las actividades previstas. Cualquier condición médica relevante, lesión o circunstancia especial deberá comunicarse antes del inicio del viaje.",
        "Cambios en el itinerario: Nos reservamos el derecho de realizar modificaciones puntuales en el itinerario, alojamientos o actividades cuando circunstancias externas, condiciones meteorológicas, motivos de seguridad o causas ajenas a nuestra organización así lo requieran. En caso de ser necesario, siempre buscaremos alternativas equivalentes que mantengan la calidad de la experiencia."
      ]
    },
    {
      title: "3. Propiedad Intelectual",
      description: "",
      items: [
        "Todo el contenido de este sitio web, incluyendo, entre otros, textos, fotografías, diseños, identidad de marca, materiales, itinerarios, programas de retiro y demás elementos creativos, es propiedad de Aruna y está protegido por las leyes de propiedad intelectual y derechos de autor aplicables. Queda prohibida la reproducción, distribución, modificación o utilización de cualquier contenido sin la autorización previa y por escrito de Aruna."
      ]
    },
    {
      title: "4. ¿Tienes alguna pregunta?",
      description: "",
      items: [
        "Si necesitas más información sobre nuestras políticas, términos o cualquier aspecto relacionado con tu experiencia, estaremos encantadas de ayudarte. No dudes en ponerte en contacto con nosotras.",
        "Consultas Legales: helllo@aruna.com",
        "Tiempo de respuesta: Buscamos responder a todas las consultas formales dentro de las 48 horas."
      ]
    }
  ];
  updates.push({ id: 'legal_page_es', content: legalEs });

  // 6. PRIVACY POLICY PAGE
  let priv = getC('privacy_page');
  priv.title = "PRIVACY POLICY";
  priv.intro = "At Aruna, trust is at the heart of every experience we create. We are committed to protecting your privacy and handling your personal information with transparency, responsibility, and care.<br/><br/>This Privacy Policy explains how we collect, use, store, and protect your information when you visit our website, enquire about our services, book a trip or retreat, or otherwise interact with us.";
  priv.rich_text = `
<h2>1. What Information We Collect</h2>
<p>To create meaningful and well-curated travel experiences, we collect only the information necessary to plan, personalize, and support your journey. This may include:</p>
<ul>
<li><strong>Identity Information:</strong> Full name, passport details (for local tourism requirements), date of birth, and nationality.</li>
<li><strong>Contact Information:</strong> Email address, phone number, and emergency contact details.</li>
<li><strong>Personal Preferences & Wellbeing:</strong> Dietary requirements, allergies, relevant health information, activity preferences, and other details that allow us to tailor your experience to your needs.</li>
<li><strong>Technical Data:</strong> Information about your device and how you interact with our website (via cookies).</li>
</ul>
<h2>2. How We Use Your Data</h2>
<p>We do not use your data for anything other than fulfilling our commitment to you. Your data is used to:</p>
<ul>
<li>Process your booking and facilitate payment.</li>
<li>Coordinate with our vendors (hotels, transportation, instructors) to ensure your accommodation and activities are prepared.</li>
<li>To send you important information before your trip or experience, relevant updates, and marketing communications only where you have given your consent.</li>
<li>Comply with Indonesian legal and immigration requirements.</li>
</ul>
<h2>3. Sharing and Disclosure</h2>
<p>We respect your privacy and never sell your personal information. However, we may share the information strictly necessary with trusted suppliers and service providers to plan, coordinate, and deliver your trip or experience. These third parties will only have access to the information required to perform their services and are expected to handle your data securely and confidentially. They may include:</p>
<ul>
<li><strong>Service Providers:</strong> Local hotels, transport operators, and excursion guides who require your details to provide the service.</li>
<li><strong>Payment Gateways:</strong> To process your transactions securely.</li>
<li><strong>Legal Requirements:</strong> If required by law or government authorities in Indonesia.</li>
</ul>
<p>We ensure that these partners are bound by confidentiality agreements and are prohibited from using your data for their own marketing purposes.</p>
<h2>4. Data Security</h2>
<p>We implement robust security measures to protect your data from unauthorized access, alteration, or destruction.</p>
<ul>
<li>We use SSL encryption on our website.</li>
<li>We restrict access to your data to only those employees or partners who need it to provide your services.</li>
<li>We retain your data only for as long as necessary to fulfill the purposes outlined in this policy or as required by law.</li>
</ul>
<h2>5. Your Rights</h2>
<p>In accordance with applicable data protection laws, you have the right to:</p>
<ul>
<li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
<li><strong>Correction:</strong> Ask us to correct any inaccurate information.</li>
<li><strong>Erasure:</strong> Request that we delete your data (subject to our legal obligations to keep certain records).</li>
<li><strong>Opt-out:</strong> Unsubscribe from our marketing communications at any time.</li>
</ul>
<p>To exercise these rights, please contact us at hello@arunatravelstudio.com</p>
<h2>6. Cookies Policy</h2>
<p>Our website uses cookies to improve your user experience, analyze traffic, and personalize content. You can manage your cookie preferences through your browser settings.</p>
<h2>7. Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or a notice on our website.</p>
<h2>8. Contact Us</h2>
<p>Your privacy is important to us. If you have any questions about this Privacy Policy or how your personal information is collected, used, or protected, we would be happy to assist you. You can contact us at:</p>
<ul>
<li>Email: hello@arunatravelstudio.com</li>
<li>Address: Jalan Raya Anyar Gang III E, Banjar Anyar Kelod Desa/Kelurahan Kerobokan, Kec. Kuta Utara, Kab. Badung</li>
</ul>`;
  updates.push({ id: 'privacy_page', content: priv });

  let privEs = getC('privacy_page_es');
  privEs.title = "Política de Privacidad";
  privEs.intro = "En Aruna, la confianza es la base de cada experiencia que diseñamos. Nos comprometemos a proteger tu privacidad y a tratar tu información personal con transparencia, responsabilidad y respeto.<br/><br/>Esta Política de Privacidad explica cómo recopilamos, utilizamos, almacenamos y protegemos tu información cuando visitas nuestro sitio web, solicitas información, reservas un viaje o retiro, o interactúas con nosotros de cualquier otra forma.";
  privEs.rich_text = `
<h2>1. Qué Información Recopilamos</h2>
<p>Para diseñar experiencias de viaje personalizadas y cuidadosamente seleccionadas, recopilamos únicamente la información necesaria para planificar y gestionar tu experiencia de la mejor manera posible. Esta información puede incluir:</p>
<ul>
<li><strong>Información de identidad:</strong> Nombre completo, datos del pasaporte (para requisitos de turismo local), fecha de nacimiento y nacionalidad.</li>
<li><strong>Información de contacto:</strong> Dirección de correo electrónico, número de teléfono y datos de contacto de emergencia.</li>
<li><strong>Preferencias personales y bienestar:</strong> requisitos dietéticos, alergias, información de salud relevante, preferencias de actividades y cualquier otro detalle que nos ayude a adaptar la experiencia a tus necesidades.</li>
<li><strong>Datos técnicos:</strong> Información sobre tu dispositivo y cómo interactúas con nuestro sitio web (a través de cookies).</li>
</ul>
<h2>2. Cómo Usamos Tu Información</h2>
<p>No utilizamos tus datos para ningún otro fin que no sea cumplir con nuestro compromiso contigo. Tus datos se utilizan para:</p>
<ul>
<li>Procesar tu reserva y facilitar el pago.</li>
<li>Coordinar con nuestros proveedores (hoteles, transporte, instructores) para asegurar que tu alojamiento y actividades estén preparados.</li>
<li>Enviarte información importante antes de tu viaje o experiencia, actualizaciones relevantes y comunicaciones de marketing únicamente cuando hayas dado tu consentimiento.</li>
<li>Cumplir con los requisitos legales e inmigratorios de Indonesia.</li>
</ul>
<h2>3. Compartir y Divulgación</h2>
<p>Respetamos tu privacidad y nunca vendemos tu información personal. No obstante, en determinados casos podemos compartir la información estrictamente necesaria con proveedores y colaboradores de confianza para organizar y gestionar tu viaje o experiencia. Estos terceros solo tendrán acceso a los datos imprescindibles para prestar sus servicios y están obligados a tratarlos de forma segura y confidencial. Entre ellos pueden incluirse:</p>
<ul>
<li><strong>Proveedores de servicios:</strong> Hoteles locales, operadores de transporte y guías de excursiones que requieren tus datos para prestar el servicio.</li>
<li><strong>Pasarelas de pago:</strong> Para procesar tus transacciones de forma segura.</li>
<li><strong>Requisitos legales:</strong> Si así lo exige la ley o las autoridades gubernamentales en Indonesia.</li>
</ul>
<p>Nos aseguramos de que estos socios estén sujetos a acuerdos de confidencialidad y tengan prohibido usar tus datos para sus propios fines de marketing.</p>
<h2>4. Seguridad de Datos</h2>
<p>Implementamos sólidas medidas de seguridad para proteger tus datos de accesos no autorizados, alteraciones o destrucción.</p>
<ul>
<li>Utilizamos encriptación SSL en nuestro sitio web.</li>
<li>Restringimos el acceso a tus datos solo a los empleados o socios que lo necesiten para brindarte los servicios.</li>
<li>Conservamos tus datos solo durante el tiempo necesario para cumplir con los fines descritos en esta política o según lo exija la ley.</li>
</ul>
<h2>5. Tus Derechos</h2>
<p>De acuerdo con las leyes de protección de datos aplicables, tienes derecho a:</p>
<ul>
<li><strong>Acceso:</strong> Solicitar una copia de los datos personales que tenemos sobre ti.</li>
<li><strong>Corrección:</strong> Solicitarnos que corrijamos cualquier información inexacta.</li>
<li><strong>Eliminación:</strong> Solicitar que eliminemos tus datos (sujeto a nuestras obligaciones legales de conservar ciertos registros).</li>
<li><strong>Cancelar suscripción:</strong> Darte de baja de nuestras comunicaciones de marketing en cualquier momento.</li>
</ul>
<p>Para ejercer estos derechos, por favor contáctanos a hello@arunatravelstudio.com</p>
<h2>6. Política de Cookies</h2>
<p>Nuestro sitio web utiliza cookies para mejorar tu experiencia de usuario, analizar el tráfico y personalizar el contenido. Puedes administrar tus preferencias de cookies a través de la configuración de tu navegador.</p>
<h2>7. Cambios en Esta Política</h2>
<p>Podemos actualizar esta Política de Privacidad de vez en cuando para reflejar cambios en nuestras prácticas o requisitos legales. Te notificaremos de los cambios significativos por correo electrónico o mediante un aviso en nuestro sitio web.</p>
<h2>8. Contáctanos</h2>
<p>Tu privacidad es importante para nosotros. Si tienes cualquier pregunta sobre esta Política de Privacidad o sobre el tratamiento de tus datos personales, estaremos encantados de ayudarte. Puedes ponerte en contacto con nuestro equipo en:</p>
<ul>
<li>Correo: hello@arunatravelstudio.com</li>
<li>Dirección: Jalan Raya Anyar Gang III E, Banjar Anyar Kelod Desa/Kelurahan Kerobokan, Kec. Kuta Utara, Kab. Badung</li>
</ul>`;
  updates.push({ id: 'privacy_page_es', content: privEs });

  // 7. CONTACT PAGE
  let cont = getC('contact_page');
  cont.title = "Your Journey Starts Here";
  cont.labels = {
    name: "Name",
    email: "Email",
    phone: "Phone",
    comment: "Tell us more",
    button: "Send Message"
  };
  updates.push({ id: 'contact_page', content: cont });

  let contEs = getC('contact_page_es');
  contEs.title = "Tu viaje empieza aquí";
  contEs.labels = {
    name: "Nombre",
    email: "Correo electrónico",
    phone: "Teléfono",
    comment: "Cuéntanos más",
    button: "Enviar Mensaje"
  };
  updates.push({ id: 'contact_page_es', content: contEs });

  // 8. PRODUCTS (Retreats)
  const dest1 = productsData.find(p => p.slug === 'destination-1');
  if (dest1) {
    dest1.title = "Bali Connection & Transformation Retreat";
    dest1.date = "30 May 2026";
    // Overview is the Destination Description
    dest1.content = dest1.content || {};
    dest1.content.overview = "We live in a world that constantly pushes us to do more, move faster, and prioritize everyone else's needs before our own. Over time, it's easy to lose touch with who we are, what we truly want, and how we want to feel.<br/><br/>This retreat is an invitation to take a conscious pause. To step away from the demands, noise, and routines of everyday life and create the space needed to reconnect with yourself.<br/><br/>Over ten days, you will explore some of Bali's most inspiring locations while taking part in carefully curated experiences designed to encourage self-reflection, personal growth, and deeper self-awareness. Through workshops, group sessions, and image consulting tools, you will explore your identity from a more meaningful perspective, strengthen your confidence, and align the image you project with the woman you are today.<br/><br/>All of this is supported by the unique energy of Bali, an island that invites you to slow down, be present, and open yourself to new perspectives.<br/><br/>More than a retreat, it is an opportunity to gain clarity, reconnect with what truly matters, and return home with a renewed sense of confidence, purpose, and direction.";
    
    // Retreats page descriptions (if any) are also stored on products or just inside `retreats_page` JSON? 
    // Wait, retreats page had "Destination 1 name" & "desc", so I should set those in `retreats_page`?
    // Actually, `products` is rendered on the `retreats` page. So I should update `products` title and description.
    dest1.description = "A journey designed for women who feel the need to pause, reconnect with themselves, and listen to their inner voice again. Through personal growth experiences, self-discovery workshops, image consulting sessions, and the unique energy of Bali, you will embark on a transformative journey that will help you gain clarity, strengthen your confidence, and reconnect with your true essence.";
    
    // Packages
    dest1.content.packages = [
      {
        nights: "5 Nights",
        price: "Rp 10,000,000",
        inclusions: [
          "10 days / 9 nights discovering the most authentic side of Bali",
          "Carefully selected boutique accommodation and all transfers included",
          "Daily breakfasts, lunches, and selected dinners",
          "Traditional Balinese purification ceremony (Melukat)",
          "Personal growth and self-discovery workshops",
          "Women's circles and mindful connection experiences",
          "3 image consulting masterclasses focused on confidence, personal style, and identity",
          "One-to-one personalized image consulting session",
          "Exclusive image guide and personalized materials to support your journey beyond the retreat",
          "Experiences designed to help you gain clarity, strengthen your confidence, and reconnect with yourself",
          "Intimate group of no more than 10 participants",
          "Two pre-retreat group video calls",
          "Continuous support and guidance before, during, and after the retreat"
        ]
      },
      {
        nights: "7 Nights",
        price: "Rp 18,000,000",
        inclusions: [
          "Roundtrip Airport Transfers",
          "Full Board of Healthy Plant-Based Cuisine",
          "Cleansing 8 Healing Elixirs (12-times)",
          "Welcome Blessing Ritual",
          "Welcome Orientation and Initial Retreat Reflection",
          "Couple with Wellness Liaison",
          "Daily Group Morning Yoga",
          "One Romantic Dinner at Sakti Dining Room",
          "One 120-minute Couple Prema Blossom Ritual",
          "One Relationship Coaching Session",
          "One 120-minute Couple Hotra Prem Blessing Ritual",
          "One 45-minute Agni Hotra Fire Blessing Ritual",
          "Exit Retreat Couple Reflection & Debrief"
        ]
      },
      {
        nights: "10 Nights",
        price: "Rp 26,000,000",
        inclusions: [
          "Roundtrip Airport Transfers",
          "Full Board of Healthy Plant-Based Cuisine",
          "Cleansing 8 Healing Elixirs (12-times)",
          "Welcome Blessing Ritual",
          "Welcome Orientation and Initial Retreat Reflection",
          "Couple with Wellness Liaison",
          "Daily Group Morning Yoga",
          "One Romantic Dinner at Sakti Dining Room",
          "One 120-minute Couple Prema Blossom Ritual",
          "One Relationship Coaching Session",
          "One 120-minute Couple Hotra Prem Blessing Ritual",
          "One 45-minute Agni Hotra Fire Blessing Ritual",
          "One 20-minute Melukat Water Blessing Ritual",
          "Exit Retreat Couple Reflection & Debrief"
        ]
      }
    ];

    // ES translations
    dest1.content.title_es = "Retiro conexión y transformación en Bali";
    dest1.content.date_es = "30 de mayo de 2026";
    dest1.content.description_es = "Un viaje diseñado para mujeres que sienten la necesidad de parar, reconectar consigo mismas y volver a escucharse. A través de experiencias de crecimiento personal, talleres de autoconocimiento, asesoría de imagen y la energía única de Bali, vivirás un proceso de transformación que te ayudará a ganar claridad, fortalecer tu confianza y reconectar con tu esencia.";
    dest1.content.overview_es = "Vivimos en un mundo que nos empuja constantemente a hacer más, avanzar más rápido y atender las necesidades de todos antes que las nuestras. Con el tiempo, es fácil perder la conexión con quiénes somos, qué queremos y cómo queremos sentirnos.<br/><br/>Este retiro nace como una invitación a hacer una pausa consciente. A alejarte de la rutina, el ruido y las exigencias del día a día para crear el espacio necesario donde volver a escucharte.<br/><br/>Durante diez días recorrerás algunos de los lugares más inspiradores de Bali mientras participas en experiencias cuidadosamente diseñadas para fomentar la reflexión, el autoconocimiento y el crecimiento personal. A través de talleres, dinámicas grupales y herramientas de asesoría de imagen, explorarás tu identidad desde una perspectiva más profunda, fortalecerás tu confianza y alinearás la imagen que proyectas con la mujer que eres hoy.<br/><br/>Todo esto acompañado por la energía única de Bali, una isla que te invita a bajar el ritmo, estar presente y abrirte a nuevas perspectivas.<br/><br/>Más que un retiro, es una oportunidad para ganar claridad, reconectar con lo verdaderamente importante y regresar a casa con una confianza, propósito y dirección renovados.";
    dest1.content.packages_es = [
      {
        nights: "5 Noches",
        price: "Rp 10,000,000",
        inclusions: [
          "10 días / 9 noches descubriendo la esencia más auténtica de Bali",
          "Alojamiento boutique cuidadosamente seleccionado y todos los traslados incluidos",
          "Desayunos diarios y comidas. Cenas seleccionadas - Ritual de purificación (melukat) -Transfers",
          "Talleres de autoconocimiento y crecimiento personal",
          "Círculos de mujeres y espacios de conexión consciente",
          "3 masterclasses de asesoría de imagen para alinear tu imagen con quien eres hoy",
          "Sesión individual personalizada y dossier exclusivo de imagen",
          "Experiencias diseñadas para ganar claridad, fortalecer tu confianza y reconectar contigo misma",
          "Grupo íntimo de máximo 10 participantes",
          "2 videollamadas previas y acompañamiento continuo durante toda la experiencia"
        ]
      },
      {
        nights: "7 Noches",
        price: "Rp 18,000,000",
        inclusions: [
          "Traslados de ida y vuelta al aeropuerto",
          "Pensión completa de cocina saludable a base de plantas",
          "8 Elixires de Sanación (12 veces)",
          "Ritual de Bienvenida y Bendición",
          "Orientación de Bienvenida y Reflexión Inicial del Retiro en Pareja con Enlace de Bienestar",
          "Yoga Matutino Grupal Diario",
          "Una Cena Romántica en Sakti Dining Room",
          "Un Ritual Prema Blossom en Pareja de 120 minutos",
          "Una Sesión de Coaching de Relación",
          "Un Ritual Hotra Prem en Pareja de 120 minutos",
          "Un Ritual de Fuego Agni Hotra de 45 minutos",
          "Reflexión y Cierre Final del Retiro en Pareja"
        ]
      },
      {
        nights: "10 Noches",
        price: "Rp 26,000,000",
        inclusions: [
          "Traslados de ida y vuelta al aeropuerto",
          "Pensión completa de cocina saludable a base de plantas",
          "8 Elixires de Sanación (12 veces)",
          "Ritual de Bienvenida y Bendición",
          "Orientación de Bienvenida y Reflexión Inicial del Retiro en Pareja con Enlace de Bienestar",
          "Yoga Matutino Grupal Diario",
          "Una Cena Romántica en Sakti Dining Room",
          "Un Ritual Prema Blossom en Pareja de 120 minutos",
          "Una Sesión de Coaching de Relación",
          "Un Ritual Hotra Prem en Pareja de 120 minutos",
          "Un Ritual de Fuego Agni Hotra de 45 minutos",
          "Un Ritual de Agua Melukat de 20 minutos",
          "Reflexión y Cierre Final del Retiro en Pareja"
        ]
      }
    ];

    dest1.content.faqs = [
      { question: "What should I bring for this retreat?", answer: "We provide all the essentials, including yoga mats and props. We recommend bringing comfortable, loose clothing, a personal journal, and an open heart." },
      { question: "Is there Wi-Fi available at the venue?", answer: "Yes, Wi-Fi is available at the venue. However, we lovingly encourage guests to limit screen time and fully embrace the spirit of digital detox during their stay." },
      { question: "How do I get to the retreat location?", answer: "Roundtrip airport transfers are included in all retreat packages. Once your booking is confirmed, our team will send you complete arrival instructions and coordinate your pickup details." },
      { question: "Can I attend this retreat solo?", answer: "Yes, absolutely. Solo guests are warmly welcomed. Many of our participants arrive on their own and find the retreat to be a deeply enriching and empowering solo journey." },
      { question: "Is travel insurance required?", answer: "Yes, comprehensive travel insurance is required for all retreat participants. Your policy must include emergency medical evacuation and trip cancellation coverage. This is for your safety and peace of mind throughout the journey." }
    ];
    dest1.content.faqs_es = [
      { question: "¿Qué debo traer para este retiro?", answer: "Proporcionamos todos los elementos esenciales, incluidas esterillas y accesorios de yoga. Recomendamos traer ropa cómoda y holgada, un diario personal y un corazón abierto." },
      { question: "¿Hay Wi-Fi disponible en el lugar?", answer: "Sí, hay Wi-Fi disponible en el lugar. Sin embargo, alentamos con cariño a los huéspedes a limitar el tiempo de pantalla y abrazar plenamente el espíritu del detox digital durante su estadía." },
      { question: "¿Cómo llego al lugar del retiro?", answer: "Los traslados de ida y vuelta al aeropuerto están incluidos en todos los paquetes de retiro. Una vez confirmada tu reserva, nuestro equipo te enviará instrucciones completas de llegada y coordinará los detalles de tu recogida." },
      { question: "¿Puedo asistir a este retiro de forma individual?", answer: "Sí, por supuesto. Los huéspedes en solitario son bienvenidos con entusiasmo. Muchos de nuestros participantes llegan solos y encuentran que el retiro es un viaje en solitario profundamente enriquecedor y fortalecedor." },
      { question: "¿Se requiere seguro de viaje?", answer: "Sí, se requiere un seguro de viaje integral para todos los participantes del retiro. Tu póliza debe incluir cobertura de evacuación médica de emergencia y cancelación del viaje. Esto es para tu seguridad y tranquilidad durante todo el viaje." }
    ];
    
    // Add to updates, we'll upsert products separately
    // updates.push handled later
  }

  const dest2 = productsData.find(p => p.slug === 'destination-2');
  if (dest2) {
    dest2.title = "The Blue Goddeess journey- Indonesia & Bali";
    dest2.description = "A journey designed for women who want to explore some of Indonesia's most beautiful islands while embracing practices that support physical, mental, and emotional well-being. Throughout this experience, you will travel through Bali, Nusa Lembongan, and Lombok, combining nature, mindful movement, rituals, self-discovery workshops, and image consulting. An invitation to slow down, nurture yourself, and return home with renewed energy and practical tools to integrate into your daily life.";
    dest2.content = dest2.content || {};
    dest2.content.title_es = "The Blue Goddeess journey- Indonesia & Bali";
    dest2.content.description_es = "Un viaje diseñado para mujeres que desean explorar algunas de las islas más fascinantes de Indonesia mientras incorporan hábitos y prácticas que favorecen el bienestar físico, mental y emocional. A lo largo de esta experiencia recorrerás Bali, Nusa Lembongan y Lombok combinando naturaleza, movimiento consciente, rituales, talleres de autoconocimiento y asesoría de imagen. Una invitación a bajar el ritmo, cuidar de ti y regresar a casa con una nueva energía y herramientas para integrar en tu día a día.";
  }

  const dest3 = productsData.find(p => p.slug === 'destination-3');
  if (dest3) {
    dest3.title = "The Feminine expansion retreat - Bali emprendedoras";
    dest3.description = "A retreat designed for entrepreneurs and business owners who want to step away from the daily demands of their business, reconnect with their vision, and expand both personally and professionally. You will discover the most authentic side of Bali while taking part in female leadership sessions, personal branding workshops, image consulting, and self-discovery experiences. A journey created to help you gain clarity, strengthen your confidence, and move forward with a renewed vision for both your life and your business.";
    dest3.content = dest3.content || {};
    dest3.content.title_es = "The Feminine expansion retreat - Bali emprendedoras";
    dest3.content.description_es = "Un retiro diseñado para emprendedoras y empresarias que desean hacer una pausa para reconectar con su visión, redefinir sus próximos pasos y expandirse tanto a nivel personal como profesional. Descubrirás el Bali más auténtico mientras participas en sesiones de liderazgo femenino, marca personal, asesoría de imagen y autoconocimiento. Una experiencia creada para ayudarte a ganar claridad, fortalecer tu confianza y cerrar el año con una visión renovada para tu vida y tu negocio.";
  }

  console.log("Upserting changes to site_content...");
  for (const up of updates) {
    const { error } = await supabase.from('site_content').upsert({ id: up.id, content: up.content });
    if (error) console.error("Error updating", up.id, error.message);
  }

  console.log("Upserting changes to products...");
  for (const p of [dest1, dest2, dest3]) {
    if (p) {
      const { error } = await supabase.from('products').upsert(p);
      if (error) console.error("Error updating product", p.slug, error.message);
    }
  }

  console.log("Done. All copywriting injected.");
}
run();
