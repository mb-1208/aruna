"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { submitContactForm } from "@/app/actions/newsletter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactClient({ data }) {
  const { currentLang } = useLanguage();
  const lang = currentLang || 'en';
  const isEs = lang === 'es';

  const [defaultSubject, setDefaultSubject] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [mailtoUrl, setMailtoUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const subjectParam = params.get("subject");
      if (subjectParam) {
        setDefaultSubject(subjectParam);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(e.target);
    const name = formData.get("name") || "";
    const email = formData.get("email") || "";
    const phone = formData.get("phone") || "";
    const subject = formData.get("subject") || (isEs ? "Consulta de Contacto" : "Contact Inquiry");
    const comment = formData.get("comment") || "";

    // 1. Save lead to Database and send Resend email notification
    const result = await submitContactForm({ name, email, phone, subject, comment });
    setStatus(result.success ? "success" : "error");

    if (result.success) {
      setMessage(
        isEs
          ? "¡Gracias! Tu mensaje ha sido enviado con éxito. Nuestro equipo se pondrá en contacto contigo a la brevedad."
          : "Thank you! Your message has been sent successfully. Our team will get back to you shortly."
      );
      
      const bodyText = isEs 
        ? `Hola equipo de Aruna,\n\n${comment}\n\n• Nombre: ${name}\n• Correo electrónico: ${email}\n• Teléfono: ${phone}`
        : `Hello Aruna Team,\n\n${comment}\n\n• Name: ${name}\n• Email: ${email}\n• Phone: ${phone}`;
      
      const mailtoLink = `mailto:hello@arunatravelstudio.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
      setMailtoUrl(mailtoLink);
      e.target.reset();
    } else {
      setMessage(result.error || (isEs ? "Error al enviar el mensaje." : "Failed to send message."));
    }
  };

  const defaultLabels = {
    name: isEs ? "Nombre" : "Name",
    email: isEs ? "Correo Electrónico" : "Email",
    phone: isEs ? "Teléfono" : "Phone",
    subject: isEs ? "Asunto" : "Subject",
    comment: isEs ? "Mensaje" : "Comment",
    button: isEs ? "Enviar Mensaje" : "Send Message"
  };

  const labels = { ...defaultLabels, ...(data?.labels || {}) };

  return (
    <main className="min-h-screen bg-white font-sans text-black flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] w-full flex items-center justify-center overflow-hidden flex-shrink-0">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${data?.heroImage || 'https://placehold.co/1920x800.png'}")` }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/20" />
      </section>

      {/* Content Section */}
      <section className="w-full max-w-4xl mx-auto px-8 py-20 font-sans flex-1">
        <h1 className="text-4xl md:text-5xl font-light uppercase mb-12">{data?.title || "GET IN TOUCH"}</h1>

        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-3xl">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm text-gray-800">{labels.name}</label>
            <input 
              type="text" 
              id="name" 
              name="name"
              required
              className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          {/* Email and Phone */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="email" className="text-sm text-gray-800">{labels.email}</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                required
                className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="phone" className="text-sm text-gray-800">{labels.phone}</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone"
                required
                className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-2">
            <label htmlFor="subject" className="text-sm text-gray-800">{labels.subject}</label>
            <input 
              type="text" 
              id="subject" 
              name="subject"
              required
              value={defaultSubject}
              onChange={(e) => setDefaultSubject(e.target.value)}
              className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          {/* Comment */}
          <div className="flex flex-col gap-2">
            <label htmlFor="comment" className="text-sm text-gray-800">{labels.comment}</label>
            <textarea 
              id="comment" 
              name="comment"
              rows="6"
              required
              className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition-colors resize-y"
            ></textarea>
          </div>

          {/* Feedback Message */}
          {message && (
            <div className={`p-4 rounded-md text-sm ${status === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              <p className="font-medium">{message}</p>
              {status === 'success' && mailtoUrl && (
                <p className="mt-2 text-xs text-gray-600">
                  {isEs 
                    ? "¿Prefieres enviar una copia directamente desde tu app de correo? " 
                    : "Prefer to also send a copy directly from your email app? "}
                  <a href={mailtoUrl} className="underline font-bold text-black hover:text-gray-700">
                    {isEs ? "haz clic aquí para abrir un borrador." : "click here to open an email draft."}
                  </a>
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="bg-black text-white px-10 py-3 text-sm tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? (isEs ? "Enviando..." : "Sending...") : labels.button}
            </button>
          </div>
        </form>
      </section>

      <Footer />
    </main>
  );
}
