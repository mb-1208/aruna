import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function generateHtmlFromSections(sections) {
  if (!sections || !Array.isArray(sections)) return "";
  return sections.map(section => {
    let html = `<h2>${section.title || ''}</h2>`;
    if (section.description) html += `<p>${section.description}</p>`;
    if (section.items && section.items.length > 0) {
      html += `<ul>${section.items.map(item => `<li>${item}</li>`).join('')}</ul>`;
    }
    return html;
  }).join('');
}

const legalContent = {
  title: "LEGAL CENTER",
  content: [
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
      description: "All content on this website, including but not limited to text, photographs, designs, brand identity, materials, itineraries, retreat programs, and other creative assets, is the property of Aruna and is protected by applicable intellectual property and copyright laws. The reproduction, distribution, modification, publication, or use of any content without the prior written consent of Aruna is strictly prohibited.",
      items: []
    },
    {
      title: "4. Have a Question?",
      description: "If you need further information about our policies, terms, or any aspect of your experience with Aruna, we're here to help. Please don't hesitate to get in touch.",
      items: [
        "Legal Inquiries: hello@aruna.com"
      ]
    }
  ]
};

const legalContentEs = {
  title: "CENTRO LEGAL",
  content: [
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
      description: "Todo el contenido de este sitio web, incluyendo, entre otros, textos, fotografías, diseños, identidad de marca, materiales, itinerarios, programas de retiro y demás elementos creativos, es propiedad de Aruna y está protegido por las leyes de propiedad intelectual y derechos de autor aplicables. Queda prohibida la reproducción, distribución, modificación o utilización de cualquier contenido sin la autorización previa y por escrito de Aruna.",
      items: []
    },
    {
      title: "4. ¿Tienes alguna pregunta?",
      description: "Si necesitas más información sobre nuestras políticas, términos o cualquier aspecto relacionado con tu experiencia, estaremos encantadas de ayudarte. No dudes en ponerte en contacto con nosotras.",
      items: [
        "Consultas Legales: hello@aruna.com"
      ]
    }
  ]
};

const privacyContent = {
  title: "PRIVACY POLICY",
  content: [
    {
      title: "1. What Information We Collect",
      description: "To create meaningful and well-curated travel experiences, we collect only the information necessary to plan, personalize, and support your journey. This may include:",
      items: [
        "Identity Information: Full name, passport details (for local tourism requirements), date of birth, and nationality.",
        "Contact Information: Email address, phone number, and emergency contact details.",
        "Personal Preferences & Wellbeing: Dietary requirements, allergies, relevant health information, activity preferences, and other details that allow us to tailor your experience to your needs.",
        "Technical Data: Information about your device and how you interact with our website (via cookies)."
      ]
    },
    {
      title: "2. How We Use Your Data",
      description: "We do not use your data for anything other than fulfilling our commitment to you. Your data is used to:",
      items: [
        "Process your booking and facilitate payment.",
        "Coordinate with our vendors (hotels, transportation, instructors) to ensure your accommodation and activities are prepared.",
        "To send you important information before your trip or experience, relevant updates, and marketing communications only where you have given your consent.",
        "Comply with Indonesian legal and immigration requirements."
      ]
    },
    {
      title: "3. Sharing and Disclosure",
      description: "We respect your privacy and never sell your personal information. However, we may share the information strictly necessary with trusted suppliers and service providers to plan, coordinate, and deliver your trip or experience. These third parties will only have access to the information required to perform their services and are expected to handle your data securely and confidentially. They may include:",
      items: [
        "Service Providers: Local hotels, transport operators, and excursion guides who require your details to provide the service.",
        "Payment Gateways: To process your transactions securely.",
        "Legal Requirements: If required by law or government authorities in Indonesia.",
        "We ensure that these partners are bound by confidentiality agreements and are prohibited from using your data for their own marketing purposes."
      ]
    },
    {
      title: "4. Data Security",
      description: "We implement robust security measures to protect your data from unauthorized access, alteration, or destruction.",
      items: [
        "We use SSL encryption on our website.",
        "We restrict access to your data to only those employees or partners who need it to provide your services.",
        "We retain your data only for as long as necessary to fulfill the purposes outlined in this policy or as required by law."
      ]
    },
    {
      title: "5. Your Rights",
      description: "In accordance with applicable data protection laws, you have the right to:",
      items: [
        "Access: Request a copy of the personal data we hold about you.",
        "Correction: Ask us to correct any inaccurate information.",
        "Erasure: Request that we delete your data (subject to our legal obligations to keep certain records).",
        "Opt-out: Unsubscribe from our marketing communications at any time.",
        "To exercise these rights, please contact us at hello@arunatravelstudio.com"
      ]
    },
    {
      title: "6. Cookies Policy",
      description: "Our website uses cookies to improve your user experience, analyze traffic, and personalize content. You can manage your cookie preferences through your browser settings.",
      items: []
    },
    {
      title: "7. Changes to This Policy",
      description: "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or a notice on our website.",
      items: []
    },
    {
      title: "8. Contact Us",
      description: "Your privacy is important to us. If you have any questions about this Privacy Policy or how your personal information is collected, used, or protected, we would be happy to assist you. You can contact us at:",
      items: [
        "Email: hello@arunatravelstudio.com",
        "Address: Jalan Raya Anyar Gang III E, Banjar Anyar Kelod Desa/Kelurahan Kerobokan, Kec. Kuta Utara, Kab. Badung"
      ]
    }
  ]
};

const privacyContentEs = {
  title: "POLÍTICA DE PRIVACIDAD",
  content: [
    {
      title: "1. Qué Información Recopilamos",
      description: "Para diseñar experiencias de viaje personalizadas y cuidadosamente seleccionadas, recopilamos únicamente la información necesaria para planificar y gestionar tu experiencia de la mejor manera posible. Esta información puede incluir:",
      items: [
        "Información de identidad: Nombre completo, datos del pasaporte (para requisitos de turismo local), fecha de nacimiento y nacionalidad.",
        "Información de contacto: Dirección de correo electrónico, número de teléfono y datos de contacto de emergencia.",
        "Preferencias personales y bienestar: requisitos dietéticos, alergias, información de salud relevante, preferencias de actividades y cualquier otro detalle que nos ayude a adaptar la experiencia a tus necesidades.",
        "Datos técnicos: Información sobre tu dispositivo y cómo interactúas con nuestro sitio web (a través de cookies)."
      ]
    },
    {
      title: "2. Cómo Usamos Tu Información",
      description: "No utilizamos tus datos para ningún otro fin que no sea cumplir con nuestro compromiso contigo. Tus datos se utilizan para:",
      items: [
        "Procesar tu reserva y facilitar el pago.",
        "Coordinar con nuestros proveedores (hoteles, transporte, instructores) para asegurar que tu alojamiento y actividades estén preparados.",
        "Enviarte información importante antes de tu viaje o experiencia, actualizaciones relevantes y comunicaciones de marketing únicamente cuando hayas dado tu consentimiento.",
        "Cumplir con los requisitos legales e inmigratorios de Indonesia."
      ]
    },
    {
      title: "3. Compartir y Divulgación",
      description: "Respetamos tu privacidad y nunca vendemos tu información personal. No obstante, en determinados casos podemos compartir la información estrictamente necesaria con proveedores y colaboradores de confianza para organizar y gestionar tu viaje o experiencia. Estos terceros solo tendrán acceso a los datos imprescindibles para prestar sus servicios y están obligados a tratarlos de forma segura y confidencial. Entre ellos pueden incluirse:",
      items: [
        "Proveedores de servicios: Hoteles locales, operadores de transporte y guías de excursiones que requieren tus datos para prestar el servicio.",
        "Pasarelas de pago: Para procesar tus transacciones de forma segura.",
        "Requisitos legales: Si así lo exige la ley o las autoridades gubernamentales en Indonesia.",
        "Nos aseguramos de que estos socios estén sujetos a acuerdos de confidencialidad y tengan prohibido usar tus datos para sus propios fines de marketing."
      ]
    },
    {
      title: "4. Seguridad de Datos",
      description: "Implementamos sólidas medidas de seguridad para proteger tus datos de accesos no autorizados, alteraciones o destrucción.",
      items: [
        "Utilizamos encriptación SSL en nuestro sitio web.",
        "Restringimos el acceso a tus datos solo a los empleados o socios que lo necesiten para brindarte los servicios.",
        "Conservamos tus datos solo durante el tiempo necesario para cumplir con los fines descritos en esta política o según lo exija la ley."
      ]
    },
    {
      title: "5. Tus Derechos",
      description: "De acuerdo con las leyes de protección de datos aplicables, tienes derecho a:",
      items: [
        "Acceso: Solicitar una copia de los datos personales que tenemos sobre ti.",
        "Corrección: Solicitarnos que corrijamos cualquier información inexacta.",
        "Eliminación: Solicitar que eliminemos tus datos (sujeto a nuestras obligaciones legales de conservar ciertos registros).",
        "Cancelar suscripción: Darte de baja de nuestras comunicaciones de marketing en cualquier momento.",
        "Para ejercer estos derechos, por favor contáctanos a hello@arunatravelstudio.com"
      ]
    },
    {
      title: "6. Política de Cookies",
      description: "Nuestro sitio web utiliza cookies para mejorar tu experiencia de usuario, analizar el tráfico y personalizar el contenido. Puedes administrar tus preferencias de cookies a través de la configuración de tu navegador.",
      items: []
    },
    {
      title: "7. Cambios en Esta Política",
      description: "Podemos actualizar esta Política de Privacidad de vez en cuando para reflejar cambios en nuestras prácticas o requisitos legales. Te notificaremos de los cambios significativos por correo electrónico o mediante un aviso en nuestro sitio web.",
      items: []
    },
    {
      title: "8. Contáctanos",
      description: "Tu privacidad es importante para nosotros. Si tienes cualquier pregunta sobre esta Política de Privacidad o sobre el tratamiento de tus datos personales, estaremos encantados de ayudarte. Puedes ponerte en contacto con nuestro equipo en:",
      items: [
        "Correo: hello@arunatravelstudio.com",
        "Dirección: Jalan Raya Anyar Gang III E, Banjar Anyar Kelod Desa/Kelurahan Kerobokan, Kec. Kuta Utara, Kab. Badung"
      ]
    }
  ]
};

async function run() {
  const { data: allContent } = await supabase.from('site_content').select('*').in('id', ['legal_page', 'privacy_page']);
  
  if (!allContent) {
    console.error("No content found");
    return;
  }

  for (let row of allContent) {
    let content = row.content || {};
    
    if (row.id === 'legal_page') {
      content.title = legalContent.title;
      content.content = legalContent.content;
      content.rich_text = generateHtmlFromSections(legalContent.content);
      
      content.title_es = legalContentEs.title;
      content.content_es = legalContentEs.content;
      content.rich_text_es = generateHtmlFromSections(legalContentEs.content);
    }
    
    if (row.id === 'privacy_page') {
      content.title = privacyContent.title;
      content.content = privacyContent.content;
      content.rich_text = generateHtmlFromSections(privacyContent.content);
      
      content.title_es = privacyContentEs.title;
      content.content_es = privacyContentEs.content;
      content.rich_text_es = generateHtmlFromSections(privacyContentEs.content);
    }
      
    const { error } = await supabase.from('site_content').upsert({ id: row.id, content: content });
    if (error) {
      console.error(`Error updating ${row.id}`, error);
    } else {
      console.log(`${row.id} fully updated with FULL content and rich text.`);
    }
  }
}
run();
