-- Full Translation Seed Script
-- Updates the `site_content` and `retreats_destinations` tables with original English text and Spanish translations

-- 1. GLOBAL (Navbar, Footer, Promo)
INSERT INTO site_content (id, content) VALUES (
  'global',
  '{
    "navbar": {
      "en": {
        "travel": "Travel",
        "retreats": "Retreats",
        "services": "Services",
        "about": "About",
        "reviews": "Reviews",
        "faq": "FAQ",
        "destinations": "Destinations",
        "gallery": "Gallery"
      },
      "es": {
        "travel": "Viajes",
        "retreats": "Retiros",
        "services": "Servicios",
        "about": "Sobre Nosotros",
        "reviews": "Reseñas",
        "faq": "Preguntas Frecuentes",
        "destinations": "Destinos",
        "gallery": "Galería"
      }
    },
    "footer": {
      "en": {
        "description": "Curating bespoke journeys and soulful retreats that restore peace and inspire discovery.",
        "explore": "Explore",
        "destinations": "Destinations",
        "retreats": "Retreats",
        "ourStory": "Our Story",
        "journal": "Journal",
        "legal": "Legal",
        "privacyPolicy": "Privacy Policy",
        "terms": "Terms & Conditions",
        "contact": "Contact",
        "connect": "Connect",
        "newsletterTitle": "Join Our Journey",
        "newsletterDesc": "Subscribe to receive curated travel inspiration and exclusive retreat offers.",
        "newsletterButton": "Subscribe",
        "rights": "All rights reserved."
      },
      "es": {
        "description": "Curando viajes a medida y retiros para el alma que restauran la paz e inspiran el descubrimiento.",
        "explore": "Explorar",
        "destinations": "Destinos",
        "retreats": "Retiros",
        "ourStory": "Nuestra Historia",
        "journal": "Diario",
        "legal": "Legal",
        "privacyPolicy": "Política de Privacidad",
        "terms": "Términos y Condiciones",
        "contact": "Contacto",
        "connect": "Conectar",
        "newsletterTitle": "Únete a Nuestro Viaje",
        "newsletterDesc": "Suscríbete para recibir inspiración de viajes curada y ofertas exclusivas de retiros.",
        "newsletterButton": "Suscribirse",
        "rights": "Todos los derechos reservados."
      }
    },
    "promo": {
      "en": {
        "title": "Welcome to Aruna",
        "description": "Join our newsletter and receive a complimentary wellness guide for your next journey.",
        "button": "Subscribe Now",
        "placeholder": "Enter your email"
      },
      "es": {
        "title": "Bienvenido a Aruna",
        "description": "Únete a nuestro boletín y recibe una guía de bienestar de cortesía para tu próximo viaje.",
        "button": "Suscribirse Ahora",
        "placeholder": "Ingresa tu correo electrónico"
      }
    }
  }'::jsonb
) ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content;


-- 2. HOME PAGE (Simulated via parts of Travel & Retreats previously)
INSERT INTO site_content (id, content) VALUES (
  'home_page',
  '{
    "travelTitle": "DISCOVER THE WORLD",
    "travelButton": "Explore Travel",
    "retreatsTitle": "FIND YOUR PEACE",
    "retreatsButton": "Explore Retreats"
  }'::jsonb
) ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content;


-- 3. TRAVEL PAGE
INSERT INTO site_content (id, content) VALUES (
  'travel_page',
  '{
    "heroTitle": "Explore The Best<br />Curated Travel<br />Experiences",
    "services": [
      {
        "title": "Service A",
        "subtitle": "Explore"
      },
      {
        "title": "Service B",
        "subtitle": "Explore"
      },
      {
        "title": "Service C",
        "subtitle": "Explore"
      }
    ],
    "aboutSubtitle": "About Us",
    "aboutTitle": "Find Serenity In<br />Every Journey",
    "aboutText": "We believe that travel is more than just a change of scenery—it is an opportunity to reconnect with yourself. At Aruna, we curate bespoke travel experiences that blend untouched natural beauty with soul-soothing luxury. Let us craft a journey that not only explores the world but also restores your spirit.",
    "aboutQuote": "\"Hello! I am Jessica, the founder of Aruna. Having traveled extensively, I believe true luxury is finding peace in the world''s most beautiful corners. I created Aruna to blend world-class adventure with soul-restoring tranquility, crafting deeply personal, transformative journeys just for you.\"",
    "testimonialsSubtitle": "Stories From Our Travelers",
    "testimonialsTitle": "Stories From<br />Our Travelers",
    "faqSubtitle": "Frequently Asked Questions",
    "faqTitle": "WHAT YOU NEED TO KNOW",
    "faqItems": [
      {
        "question": "What is included in a bespoke travel package?",
        "answer": "Our bespoke packages are fully customized. Generally, they include luxury accommodations, private transfers, exclusive guided tours, and personalized concierge services throughout your journey."
      },
      {
        "question": "How far in advance should I book?",
        "answer": "We recommend booking at least 3-6 months in advance for peak seasons to ensure the availability of our exclusive partner properties and top-tier guides."
      },
      {
        "question": "Can you accommodate dietary restrictions?",
        "answer": "Absolutely. We work closely with our culinary partners globally to ensure all your dietary needs and preferences are seamlessly met."
      },
      {
        "question": "Do you arrange flights and visas?",
        "answer": "While we handle all on-ground logistics, accommodations, and experiences, we recommend booking international flights through our trusted aviation partners. We provide full guidance for visa requirements."
      }
    ],
    "ctaTitle": "Ready For Your Next<br className=\"hidden md:block\" /> Bespoke Adventure?",
    "ctaText": "10% Off<br />First Trip"
  }'::jsonb
) ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content;


-- TRAVEL PAGE (ES)
UPDATE site_content
SET content = jsonb_set(
  content, 
  '{es}', 
  '{
    "heroTitle": "Explora Las Mejores<br />Experiencias de Viaje<br />Curadas",
    "services": [
      { "title": "Servicio A", "subtitle": "Explorar" },
      { "title": "Servicio B", "subtitle": "Explorar" },
      { "title": "Servicio C", "subtitle": "Explorar" }
    ],
    "aboutSubtitle": "Sobre Nosotros",
    "aboutTitle": "Encuentra Serenidad en<br />Cada Viaje",
    "aboutText": "Creemos que viajar es más que un simple cambio de escenario: es una oportunidad para reconectarte contigo mismo. En Aruna, curamos experiencias de viaje a medida que combinan la belleza natural intacta con un lujo que calma el alma. Permítenos crear un viaje que no solo explore el mundo, sino que también restaure tu espíritu.",
    "aboutQuote": "\"¡Hola! Soy Jessica, la fundadora de Aruna. Habiendo viajado extensamente, creo que el verdadero lujo es encontrar la paz en los rincones más hermosos del mundo. Creé Aruna para combinar aventuras de clase mundial con una tranquilidad que restaura el alma, creando viajes transformadores y profundamente personales solo para ti.\"",
    "testimonialsSubtitle": "Historias de Nuestros Viajeros",
    "testimonialsTitle": "Historias de<br />Nuestros Viajeros",
    "faqSubtitle": "Preguntas Frecuentes",
    "faqTitle": "LO QUE NECESITAS SABER",
    "faqItems": [
      {
        "question": "¿Qué incluye un paquete de viaje a medida?",
        "answer": "Nuestros paquetes a medida están totalmente personalizados. Generalmente, incluyen alojamiento de lujo, traslados privados, visitas guiadas exclusivas y servicios de conserjería personalizados durante todo tu viaje."
      },
      {
        "question": "¿Con cuánta anticipación debo reservar?",
        "answer": "Recomendamos reservar con al menos 3 a 6 meses de anticipación para las temporadas altas para garantizar la disponibilidad de nuestras exclusivas propiedades asociadas y guías de primer nivel."
      },
      {
        "question": "¿Pueden adaptarse a las restricciones dietéticas?",
        "answer": "Absolutamente. Trabajamos en estrecha colaboración con nuestros socios culinarios a nivel mundial para garantizar que se satisfagan todas tus necesidades y preferencias dietéticas."
      },
      {
        "question": "¿Organizan vuelos y visas?",
        "answer": "Si bien manejamos toda la logística en tierra, el alojamiento y las experiencias, recomendamos reservar vuelos internacionales a través de nuestros socios de aviación de confianza. Brindamos orientación completa sobre los requisitos de visa."
      }
    ],
    "ctaTitle": "¿Listo para tu próxima<br className=\"hidden md:block\" /> Aventura a Medida?",
    "ctaText": "10% de Descuento<br />Primer Viaje"
  }'::jsonb
)
WHERE id = 'travel_page';


-- 4. RETREATS PAGE
INSERT INTO site_content (id, content) VALUES (
  'retreats_page',
  '{
    "heroTitle": "RECONNECT WITH YOURSELF IN TOTAL SERENITY",
    "introSubtitle": "Meet Aruna Retreats",
    "introTitle": "ESCAPE THE NOISE AND RECONNECT WITH YOUR INNER SELF. ARUNA RETREATS OFFERS CURATED WELLNESS JOURNEYS DESIGNED TO RESTORE YOUR MIND, BODY, AND SPIRIT IN NATURE''S MOST TRANQUIL SANCTUARIES.",
    "experienceSubtitle": "Destinations",
    "experienceTitle": "THE EXPERIENCE",
    "quoteSubtitle": "Reviews",
    "quoteTitle": "WHAT THEY SAY",
    "faqSubtitle": "FREQUENTLY ASKED QUESTIONS",
    "faqTitle": "WHAT YOU NEED TO KNOW",
    "faqItems": [
      {
        "question": "How are accommodations assigned?",
        "answer": "Accommodations are assigned based on the room type you select during booking. We offer private and shared options to suit your comfort and budget."
      },
      {
        "question": "Do I need prior yoga experience?",
        "answer": "Not at all. Our classes are designed for all levels, and our instructors provide modifications to ensure everyone feels comfortable and supported."
      },
      {
        "question": "What meals are provided during the retreat?",
        "answer": "We provide nutritious, locally-sourced meals daily. We can accommodate most dietary restrictions if notified in advance."
      },
      {
        "question": "Can I customize the daily schedule?",
        "answer": "While we offer a curated schedule to maximize your experience, all activities are optional. You are free to skip any session to rest or explore on your own."
      },
      {
        "question": "What is included in the retreat package?",
        "answer": "Most packages include accommodation, daily meals, scheduled wellness activities, and group excursions. Flights and personal expenses are generally not included."
      }
    ],
    "ctaTitle": "DON''T WANNA MISS<br className=\"hidden md:block\" />A THING?",
    "ctaText": "Add this email form so that they will be the first to know your details & early booking."
  }'::jsonb
) ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content;


-- RETREATS PAGE (ES)
UPDATE site_content
SET content = jsonb_set(
  content, 
  '{es}', 
  '{
    "heroTitle": "RECONECTA CONTIGO MISMO EN TOTAL SERENIDAD",
    "introSubtitle": "Conoce Aruna Retreats",
    "introTitle": "ESCAPA DEL RUIDO Y RECONECTA CON TU SER INTERIOR. ARUNA RETREATS OFRECE VIAJES DE BIENESTAR CURADOS DISEÑADOS PARA RESTAURAR TU MENTE, CUERPO Y ESPÍRITU EN LOS SANTUARIOS MÁS TRANQUILOS DE LA NATURALEZA.",
    "experienceSubtitle": "Destinos",
    "experienceTitle": "LA EXPERIENCIA",
    "quoteSubtitle": "Reseñas",
    "quoteTitle": "LO QUE DICEN",
    "faqSubtitle": "PREGUNTAS FRECUENTES",
    "faqTitle": "LO QUE NECESITAS SABER",
    "faqItems": [
      {
        "question": "¿Cómo se asignan los alojamientos?",
        "answer": "Los alojamientos se asignan en función del tipo de habitación que selecciones durante la reserva. Ofrecemos opciones privadas y compartidas para adaptarnos a tu comodidad y presupuesto."
      },
      {
        "question": "¿Necesito experiencia previa en yoga?",
        "answer": "En absoluto. Nuestras clases están diseñadas para todos los niveles y nuestros instructores ofrecen modificaciones para garantizar que todos se sientan cómodos y apoyados."
      },
      {
        "question": "¿Qué comidas se ofrecen durante el retiro?",
        "answer": "Ofrecemos comidas nutritivas de origen local todos los días. Podemos adaptarnos a la mayoría de las restricciones dietéticas si se notifica con anticipación."
      },
      {
        "question": "¿Puedo personalizar el horario diario?",
        "answer": "Si bien ofrecemos un horario curado para maximizar tu experiencia, todas las actividades son opcionales. Eres libre de saltarte cualquier sesión para descansar o explorar por tu cuenta."
      },
      {
        "question": "¿Qué incluye el paquete del retiro?",
        "answer": "La mayoría de los paquetes incluyen alojamiento, comidas diarias, actividades de bienestar programadas y excursiones grupales. Los vuelos y gastos personales generalmente no están incluidos."
      }
    ],
    "ctaTitle": "¿NO QUIERES PERDERTE<br className=\"hidden md:block\" />NADA?",
    "ctaText": "Agrega este formulario de correo electrónico para que sean los primeros en conocer tus detalles y reservas anticipadas."
  }'::jsonb
)
WHERE id = 'retreats_page';


-- 5. CONTACT PAGE
INSERT INTO site_content (id, content) VALUES (
  'contact_page',
  '{
    "title": "GET IN TOUCH",
    "labels": {
      "name": "Name",
      "email": "Email",
      "phone": "Phone",
      "subject": "Subject",
      "comment": "Comment",
      "button": "Send Message"
    }
  }'::jsonb
) ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content;


-- CONTACT PAGE (ES)
UPDATE site_content
SET content = jsonb_set(
  content, 
  '{es}', 
  '{
    "title": "PONTE EN CONTACTO",
    "labels": {
      "name": "Nombre",
      "email": "Correo",
      "phone": "Teléfono",
      "subject": "Asunto",
      "comment": "Comentario",
      "button": "Enviar Mensaje"
    }
  }'::jsonb
)
WHERE id = 'contact_page';


-- 6. LEGAL PAGE
INSERT INTO site_content (id, content) VALUES (
  'legal_page',
  '{
    "title": "LEGAL CENTER",
    "content": [
      {
        "title": "1. Company Identity",
        "description": "For official correspondence and transparency, here are our business details:",
        "items": [
          "Registered Name: PT. XYZ Travel Indonesia",
          "Business Address: Full Office Address in Bali",
          "Business Registration (NIB): Insert Number",
          "Contact Email: legal@yourdomain.com"
        ]
      },
      {
        "title": "2. Important Disclaimers",
        "description": "By participating in our retreats, you acknowledge the following:",
        "items": [
          "Travel Risks & Insurance: While we prioritize safety, travel in Indonesia involves inherent risks. We require all participants to hold valid comprehensive travel insurance.",
          "Physical & Mental Wellbeing: Our retreats may include physical activities (yoga, hiking). You confirm you are fit to participate.",
          "Force Majeure: We cannot be held liable for failure to perform our obligations due to events beyond our control (natural disasters, pandemics, government actions)."
        ]
      },
      {
        "title": "3. Intellectual Property",
        "description": "All content found on this website—including photography, branding, retreat itineraries, and written copy—is the exclusive property of [Business Name] and is protected by international copyright laws. Unauthorized reproduction or use is strictly prohibited.",
        "items": []
      },
      {
        "title": "4. Get in Touch",
        "description": "If you have any questions regarding these documents, or if you need clarification on a specific policy, please reach out to us. We are happy to help.",
        "items": [
          "Legal Inquiries: legal@yourdomain.com",
          "Response Time: We aim to respond to all formal inquiries within 48 hours."
        ]
      }
    ]
  }'::jsonb
) ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content;


-- LEGAL PAGE (ES)
UPDATE site_content
SET content = jsonb_set(
  content, 
  '{es}', 
  '{
    "title": "CENTRO LEGAL",
    "content": [
      {
        "title": "1. Identidad de la Empresa",
        "description": "Para correspondencia oficial y transparencia, aquí están nuestros detalles comerciales:",
        "items": [
          "Nombre Registrado: PT. XYZ Travel Indonesia",
          "Dirección Comercial: Dirección completa de la oficina en Bali",
          "Registro Comercial (NIB): Insertar Número",
          "Correo de Contacto: legal@yourdomain.com"
        ]
      },
      {
        "title": "2. Avisos Importantes",
        "description": "Al participar en nuestros retiros, reconoces lo siguiente:",
        "items": [
          "Riesgos de Viaje y Seguro: Aunque priorizamos la seguridad, viajar en Indonesia implica riesgos inherentes. Requerimos que todos los participantes tengan un seguro de viaje integral válido.",
          "Bienestar Físico y Mental: Nuestros retiros pueden incluir actividades físicas (yoga, senderismo). Confirmas que estás en condiciones de participar.",
          "Fuerza Mayor: No podemos ser considerados responsables por el incumplimiento de nuestras obligaciones debido a eventos fuera de nuestro control (desastres naturales, pandemias, acciones gubernamentales)."
        ]
      },
      {
        "title": "3. Propiedad Intelectual",
        "description": "Todo el contenido que se encuentra en este sitio web, incluyendo fotografías, marca, itinerarios de retiros y textos escritos, es propiedad exclusiva de [Nombre del Negocio] y está protegido por las leyes internacionales de derechos de autor. La reproducción o uso no autorizado está estrictamente prohibido.",
        "items": []
      },
      {
        "title": "4. Ponte en Contacto",
        "description": "Si tienes alguna pregunta sobre estos documentos, o si necesitas aclaración sobre una política específica, comunícate con nosotros. Estaremos encantados de ayudarte.",
        "items": [
          "Consultas Legales: legal@yourdomain.com",
          "Tiempo de Respuesta: Nuestro objetivo es responder a todas las consultas formales en un plazo de 48 horas."
        ]
      }
    ]
  }'::jsonb
)
WHERE id = 'legal_page';


-- 7. PRIVACY PAGE
INSERT INTO site_content (id, content) VALUES (
  'privacy_page',
  '{
    "title": "PRIVACY POLICY",
    "content": [
      {
        "title": "1. What Information We Collect",
        "description": "To provide you with a seamless retreat experience, we collect only the information that is necessary. This includes:",
        "items": [
          "Identity Information: Full name, passport details (for local tourism requirements), date of birth, and nationality.",
          "Contact Information: Email address, phone number, and emergency contact details.",
          "Travel Preferences: Dietary restrictions, allergies, physical fitness levels, and accommodation preferences.",
          "Technical Data: Information about your device and how you interact with our website (via cookies)."
        ]
      },
      {
        "title": "2. How We Use Your Data",
        "description": "We do not use your data for anything other than fulfilling our commitment to you. Your data is used to:",
        "items": [
          "Process your booking and facilitate payment.",
          "Coordinate with our vendors (hotels, transportation, instructors) to ensure your accommodation and activities are prepared.",
          "Send you important pre-arrival information, retreat updates, and newsletters (only if you have opted in).",
          "Comply with Indonesian legal and immigration requirements."
        ]
      },
      {
        "title": "3. Sharing and Disclosure",
        "description": "We respect your privacy and do not sell your personal data. However, we may share information with trusted third-party partners strictly to fulfill your booking. These partners include:",
        "items": [
          "Service Providers: Local hotels, transport operators, and excursion guides who require your details to provide the service.",
          "Payment Gateways: To process your transactions securely.",
          "Legal Requirements: If required by law or government authorities in Indonesia."
        ]
      },
      {
        "title": "4. Data Security",
        "description": "We implement robust security measures to protect your data from unauthorized access, alteration, or destruction.",
        "items": [
          "We use SSL encryption on our website.",
          "We restrict access to your data to only those employees or partners who need it to provide your services.",
          "We retain your data only for as long as necessary to fulfill the purposes outlined in this policy or as required by law."
        ]
      },
      {
        "title": "5. Your Rights",
        "description": "In accordance with applicable data protection laws, you have the right to:",
        "items": [
          "Access: Request a copy of the personal data we hold about you.",
          "Correction: Ask us to correct any inaccurate information.",
          "Erasure: Request that we delete your data (subject to our legal obligations to keep certain records).",
          "Opt-out: Unsubscribe from our marketing communications at any time."
        ]
      },
      {
        "title": "6. Cookies Policy",
        "description": "Our website uses cookies to improve your user experience, analyze traffic, and personalize content. You can manage your cookie preferences through your browser settings.",
        "items": []
      },
      {
        "title": "7. Changes to This Policy",
        "description": "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or a notice on our website.",
        "items": []
      },
      {
        "title": "8. Contact Us",
        "description": "If you have questions, concerns, or complaints regarding this Privacy Policy or how your data is handled, please reach out to our privacy team:",
        "items": [
          "Email: legal@yourdomain.com",
          "Address: Full Business Address in Bali"
        ]
      }
    ]
  }'::jsonb
) ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content;


-- PRIVACY PAGE (ES)
UPDATE site_content
SET content = jsonb_set(
  content, 
  '{es}', 
  '{
    "title": "POLÍTICA DE PRIVACIDAD",
    "content": [
      {
        "title": "1. Qué Información Recopilamos",
        "description": "Para brindarte una experiencia de retiro perfecta, recopilamos solo la información que es necesaria. Esto incluye:",
        "items": [
          "Información de Identidad: Nombre completo, detalles del pasaporte (para los requisitos de turismo local), fecha de nacimiento y nacionalidad.",
          "Información de Contacto: Dirección de correo electrónico, número de teléfono y datos de contacto de emergencia.",
          "Preferencias de Viaje: Restricciones dietéticas, alergias, niveles de condición física y preferencias de alojamiento.",
          "Datos Técnicos: Información sobre tu dispositivo y cómo interactúas con nuestro sitio web (a través de cookies)."
        ]
      },
      {
        "title": "2. Cómo Usamos Tus Datos",
        "description": "No usamos tus datos para nada más que para cumplir con nuestro compromiso contigo. Tus datos se utilizan para:",
        "items": [
          "Procesar tu reserva y facilitar el pago.",
          "Coordinar con nuestros proveedores (hoteles, transporte, instructores) para asegurar que tu alojamiento y actividades estén preparados.",
          "Enviarte información importante antes de la llegada, actualizaciones sobre retiros y boletines (solo si has optado por recibirlos).",
          "Cumplir con los requisitos legales y de inmigración de Indonesia."
        ]
      },
      {
        "title": "3. Intercambio y Divulgación",
        "description": "Respetamos tu privacidad y no vendemos tus datos personales. Sin embargo, podemos compartir información con socios externos de confianza estrictamente para cumplir con tu reserva. Estos socios incluyen:",
        "items": [
          "Proveedores de Servicios: Hoteles locales, operadores de transporte y guías de excursiones que requieren tus datos para brindar el servicio.",
          "Pasarelas de Pago: Para procesar tus transacciones de forma segura.",
          "Requisitos Legales: Si lo requiere la ley o las autoridades gubernamentales de Indonesia."
        ]
      },
      {
        "title": "4. Seguridad de los Datos",
        "description": "Implementamos medidas de seguridad sólidas para proteger tus datos contra el acceso, la alteración o la destrucción no autorizados.",
        "items": [
          "Usamos cifrado SSL en nuestro sitio web.",
          "Restringimos el acceso a tus datos solo a aquellos empleados o socios que los necesitan para brindarte los servicios.",
          "Retenemos tus datos solo durante el tiempo necesario para cumplir con los propósitos descritos en esta política o según lo exija la ley."
        ]
      },
      {
        "title": "5. Tus Derechos",
        "description": "De acuerdo con las leyes de protección de datos aplicables, tienes derecho a:",
        "items": [
          "Acceso: Solicitar una copia de los datos personales que tenemos sobre ti.",
          "Corrección: Pedirnos que corrijamos cualquier información inexacta.",
          "Borrado: Solicitar que eliminemos tus datos (sujeto a nuestras obligaciones legales de mantener ciertos registros).",
          "Exclusión Voluntaria: Cancelar la suscripción a nuestras comunicaciones de marketing en cualquier momento."
        ]
      },
      {
        "title": "6. Política de Cookies",
        "description": "Nuestro sitio web utiliza cookies para mejorar tu experiencia de usuario, analizar el tráfico y personalizar el contenido. Puedes gestionar tus preferencias de cookies a través de la configuración de tu navegador.",
        "items": []
      },
      {
        "title": "7. Cambios en Esta Política",
        "description": "Podemos actualizar esta Política de Privacidad de vez en cuando para reflejar cambios en nuestras prácticas o requisitos legales. Te notificaremos sobre cambios significativos por correo electrónico o mediante un aviso en nuestro sitio web.",
        "items": []
      },
      {
        "title": "8. Contáctanos",
        "description": "Si tienes preguntas, inquietudes o quejas sobre esta Política de Privacidad o sobre cómo se manejan tus datos, comunícate con nuestro equipo de privacidad:",
        "items": [
          "Correo Electrónico: legal@yourdomain.com",
          "Dirección: Dirección comercial completa en Bali"
        ]
      }
    ]
  }'::jsonb
)
WHERE id = 'privacy_page';


-- 8. DESTINATIONS DETAIL PAGE (RETREATS)
UPDATE retreats_destinations
SET content = '{
  "overview": "Experience a curated escape designed to harmonize your mind, body, and spirit. Tucked away in a serene sanctuary, this retreat invites you to unplug from the demands of modern life and reconnect with your inner self through mindful movement, nourishing rituals, and moments of profound stillness. Whether you seek quiet reflection or holistic healing, allow this space to become your home for rejuvenation.",
  "overview_es": "Experimenta un escape curado diseñado para armonizar tu mente, cuerpo y espíritu. Escondido en un santuario sereno, este retiro te invita a desconectarte de las demandas de la vida moderna y reconectarte con tu ser interior a través del movimiento consciente, rituales nutritivos y momentos de profunda quietud. Ya sea que busques una reflexión tranquila o una curación holística, permite que este espacio se convierta en tu hogar para el rejuvenecimiento.",
  "pricing_title": "UNLOCK THE JOURNEY",
  "pricing_title_es": "DESBLOQUEA EL VIAJE",
  "pricing_subtitle": "Itinerary & Pricing",
  "pricing_subtitle_es": "Itinerario y Precios",
  "pricing_price": "STARTING AT Rp 10.000.000",
  "pricing_price_es": "DESDE Rp 10.000.000",
  "pricing_text": "",
  "pricing_text_es": "",
  "pricing_includes": [
    "Roundtrip Airport Transfers",
    "Full Board of Healthy Plant-Based Cuisine",
    "Welcome Wellness Consultation & Goal Setting",
    "Daily Group Morning Yoga",
    "One 60-minute Custom Holistic Massage",
    "One Sound Healing Group Session",
    "Full Access to Wellness Facilities"
  ],
  "pricing_includes_es": [
    "Traslados de Ida y Vuelta al Aeropuerto",
    "Pensión Completa de Cocina Saludable Basada en Plantas",
    "Consulta de Bienestar de Bienvenida y Establecimiento de Objetivos",
    "Yoga Matutino Grupal Diario",
    "Un Masaje Holístico Personalizado de 60 minutos",
    "Una Sesión Grupal de Sanación con Sonido",
    "Acceso Total a las Instalaciones de Bienestar"
  ],
  "faqs": [
    {
      "question": "What should I bring to the retreat?",
      "answer": "We recommend bringing comfortable, loose-fitting clothing for yoga and meditation, a swimsuit, walking shoes, a reusable water bottle, and any personal toiletries. A detailed packing list will be provided upon booking."
    },
    {
      "question": "Is there WiFi available at the venue?",
      "answer": "Yes, complimentary WiFi is available in common areas. However, to encourage a true digital detox, we recommend limiting screen time to fully immerse yourself in the experience."
    },
    {
      "question": "How do I get to the retreat location?",
      "answer": "Roundtrip airport transfers are included in most of our packages. Our concierge team will coordinate your pickup based on your flight details."
    },
    {
      "question": "Can I attend the retreat solo?",
      "answer": "Absolutely! Many of our guests travel solo. It''s a wonderful opportunity to connect with like-minded individuals in a safe and welcoming environment."
    },
    {
      "question": "Is there an age requirement?",
      "answer": "Guests must be at least 18 years old to attend our standard retreats. For family or specialized youth retreats, please check the specific program details."
    }
  ],
  "faqs_es": [
    {
      "question": "¿Qué debo llevar al retiro?",
      "answer": "Recomendamos llevar ropa cómoda y holgada para yoga y meditación, traje de baño, zapatos para caminar, una botella de agua reutilizable y cualquier artículo de tocador personal. Se proporcionará una lista de empaque detallada al momento de la reserva."
    },
    {
      "question": "¿Hay WiFi disponible en el lugar?",
      "answer": "Sí, hay WiFi de cortesía disponible en las áreas comunes. Sin embargo, para fomentar una verdadera desintoxicación digital, recomendamos limitar el tiempo frente a la pantalla para sumergirte por completo en la experiencia."
    },
    {
      "question": "¿Cómo llego al lugar del retiro?",
      "answer": "Los traslados de ida y vuelta al aeropuerto están incluidos en la mayoría de nuestros paquetes. Nuestro equipo de conserjería coordinará tu recogida según los detalles de tu vuelo."
    },
    {
      "question": "¿Puedo asistir al retiro solo?",
      "answer": "¡Absolutamente! Muchos de nuestros huéspedes viajan solos. Es una maravillosa oportunidad para conectar con personas de ideas afines en un entorno seguro y acogedor."
    },
    {
      "question": "¿Hay un requisito de edad?",
      "answer": "Los huéspedes deben tener al menos 18 años para asistir a nuestros retiros estándar. Para retiros familiares o especializados para jóvenes, consulta los detalles específicos del programa."
    }
  ]
}'::jsonb;
