UPDATE retreats_destinations
SET content = '{
  "overview": "Immerse yourself in a transformative journey of peace and restoration. Our retreat is designed to reconnect you with nature and your inner self through daily practices and mindful exploration.",
  "overview_es": "Sumérgete en un viaje transformador de paz y restauración. Nuestro retiro está diseñado para reconectarte con la naturaleza y tu ser interior a través de prácticas diarias y exploración consciente.",
  "pricing_title": "UNLOCK THE JOURNEY",
  "pricing_title_es": "DESBLOQUEA EL VIAJE",
  "pricing_subtitle": "Itinerary & Pricing",
  "pricing_subtitle_es": "Itinerario y Precios",
  "pricing_price": "STARTING AT $1,299",
  "pricing_price_es": "DESDE $1,299",
  "pricing_text": "Secure your spot with a $500 deposit. The remaining balance is due 30 days before the retreat begins.",
  "pricing_text_es": "Asegura tu lugar con un depósito de $500. El saldo restante se debe 30 días antes de que comience el retiro.",
  "pricing_includes": [
    "5 Nights Luxury Accommodation",
    "Daily Vinyasa & Yin Yoga Sessions",
    "All Organic Farm-to-Table Meals",
    "Guided Nature Excursions",
    "One 60-Minute Spa Treatment",
    "Roundtrip Airport Transfers"
  ],
  "pricing_includes_es": [
    "5 Noches de Alojamiento de Lujo",
    "Sesiones Diarias de Vinyasa y Yin Yoga",
    "Todas las Comidas Orgánicas de la Granja a la Mesa",
    "Excursiones Guiadas por la Naturaleza",
    "Un Tratamiento de Spa de 60 Minutos",
    "Traslados de Ida y Vuelta al Aeropuerto"
  ],
  "faqs": [
    {
      "question": "What should I bring to the retreat?",
      "answer": "We recommend bringing comfortable, loose-fitting clothing for yoga and meditation, a swimsuit, walking shoes, a reusable water bottle, and any personal toiletries. A detailed packing list will be provided upon booking."
    },
    {
      "question": "Is there WiFi available at the venue?",
      "answer": "Yes, complimentary WiFi is available in common areas. However, to encourage a true digital detox, we recommend limiting screen time to fully immerse yourself in the experience."
    }
  ],
  "faqs_es": [
    {
      "question": "¿Qué debo llevar al retiro?",
      "answer": "Recomendamos llevar ropa cómoda y holgada para yoga y meditación, traje de baño, zapatos para caminar, una botella de agua reutilizable y cualquier artículo de tocador personal."
    },
    {
      "question": "¿Hay WiFi disponible en el lugar?",
      "answer": "Sí, hay WiFi de cortesía disponible en las áreas comunes. Sin embargo, para fomentar una verdadera desintoxicación digital, recomendamos limitar el tiempo frente a la pantalla."
    }
  ]
}'::jsonb
WHERE slug IN ('destination-1', 'destination-2', 'destination-3') AND (content IS NULL OR content::text = '{}'::text);
