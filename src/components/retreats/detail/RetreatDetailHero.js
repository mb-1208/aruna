"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { joinWaitingList, submitInquiry } from "@/app/actions/newsletter";
import { useLanguage } from "@/contexts/LanguageContext";
import { IconBrandWhatsapp, IconX, IconArrowUp } from "@tabler/icons-react";

export default function RetreatDetailHero({ title, subtitle, date, bgImage, bookNowText, whatsappNumber, isComingSoon, isService, lang = 'en' }) {
  const [email, setEmail] = useState("");
  const [showFab, setShowFab] = useState(false);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowFab(true);
      } else {
        setShowFab(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const { globalContent } = useLanguage();
  const inquiryContent = globalContent?.inquiry_modal?.[lang] || {};

  const modalTitle = inquiryContent.title || (lang === 'es' ? 'Consultar Disponibilidad' : 'Inquire Availability');
  const modalDesc = inquiryContent.description || (lang === 'es' ? 'Déjanos tus datos y nos pondremos en contacto contigo lo antes posible.' : 'Leave your details and we will get back to you as soon as possible.');
  const labelName = inquiryContent.label_name || (lang === 'es' ? 'Nombre' : 'Name');
  const labelEmail = inquiryContent.label_email || (lang === 'es' ? 'Correo Electrónico' : 'Email');
  const labelPhone = inquiryContent.label_phone || (lang === 'es' ? 'Teléfono' : 'Phone');
  const btnSubmit = inquiryContent.btn_submit || (lang === 'es' ? 'Enviar Consulta' : 'Submit Inquiry');
  const btnWhatsapp = inquiryContent.btn_whatsapp || (lang === 'es' ? 'Consultar por WhatsApp' : 'Inquire via WhatsApp');
  const finalWhatsappNumber = whatsappNumber || globalContent?.social_links?.whatsapp;

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("loading");
    
    const result = await submitInquiry({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      retreatTitle: title, // use title as the service name
      dateStr: "Service Inquiry", // fixed string for services since there's no date
      isService: isService
    });
    
    setSubmitStatus(result.success ? "success" : "error");
    setSubmitMessage(result.message || result.error);
    
    if (result.success) {
      const isEs = lang === 'es';
      const itemTitle = title || "Travel Service";
      const subject = isEs 
        ? `[Consulta] ${itemTitle} - ${formData.name}` 
        : `[Inquiry] ${itemTitle} - ${formData.name}`;
      
      const body = isEs
        ? `Hola equipo de Aruna,\n\nMe gustaría solicitar información para ${itemTitle} con los siguientes detalles:\n\n• Nombre: ${formData.name}\n• Correo electrónico: ${formData.email}\n• Teléfono / WhatsApp: ${formData.phone}\n• Servicio: ${itemTitle}\n\n¡Muchas gracias!`
        : `Hello Aruna Team,\n\nI would like to inquire about ${itemTitle} with the following details:\n\n• Name: ${formData.name}\n• Email: ${formData.email}\n• Phone / WhatsApp: ${formData.phone}\n• Service: ${itemTitle}\n\nThank you!`;

      const mailtoLink = `mailto:hello@arunatravelstudio.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;

      setTimeout(() => {
        setIsModalOpen(false);
        setFormData({ name: "", email: "", phone: "" });
      }, 3000);
    }
  };

  const handleWhatsAppInquiry = () => {
    if (!finalWhatsappNumber) return;
    
    const waMsg = lang === 'es' 
      ? `Hola Aruna, estoy interesado en el servicio "${title}".`
      : `Hello Aruna, I am interested in the "${title}" service.`;
      
    const encodedMessage = encodeURIComponent(waMsg);
    const cleanNumber = finalWhatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, "_blank");
  };

  const handleWaitingListSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    
    const result = await joinWaitingList(email, title);
    setStatus(result.success ? "success" : "error");
    setMessage(result.message || result.error);
    if (result.success) {
      const isEs = lang === 'es';
      const itemTitle = title || "Retreat / Service";
      const subject = isEs 
        ? `[Lista de Espera] ${itemTitle} - ${email}` 
        : `[Waiting List] ${itemTitle} - ${email}`;
      
      const body = isEs
        ? `Hola equipo de Aruna,\n\nPor favor agrégame a la lista de espera para ${itemTitle}.\n\n• Correo electrónico: ${email}\n\n¡Muchas gracias!`
        : `Hello Aruna Team,\n\nPlease add me to the waiting list for ${itemTitle}.\n\n• Email: ${email}\n\nThank you!`;

      const mailtoLink = `mailto:hello@arunatravelstudio.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;

      setTimeout(() => {
        setEmail("");
        setStatus("idle");
        setMessage("");
      }, 5000);
    }
  };

  const waitingListText = lang === 'es' ? "Manténme informado" : "Keep Me Updated";
  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${bgImage || 'http://placehold.co/1920x1080.png'}")` }}
      />
      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full h-full pt-20">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-light uppercase tracking-widest drop-shadow-lg mb-6 max-w-6xl mx-auto"
        >
          {title}
        </motion.h1>

        {date && (
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="text-white text-lg font-bold tracking-widest uppercase mb-4"
          >
            {date}
          </motion.p>
        )}
        {isComingSoon ? (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center mt-4 w-full max-w-sm mx-auto gap-4"
          >
            <form onSubmit={handleWaitingListSubmit} className="flex flex-col w-full gap-3">
              <input
                type="email"
                placeholder={lang === 'es' ? "Tu correo electrónico" : "Your email address"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-3 rounded-full text-black focus:outline-none bg-white/90 text-sm placeholder-gray-500"
                required
              />
              <button 
                type="submit"
                disabled={status === 'loading'}
                className="bg-white text-black px-12 py-3 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? '...' : waitingListText}
              </button>
            </form>
            {message && (
              <p className={`text-sm ${status === 'success' ? 'text-green-300' : 'text-red-300'}`}>
                {message}
              </p>
            )}
          </motion.div>
        ) : isService ? (
          <motion.button 
            onClick={() => {
              setIsModalOpen(true);
              setSubmitStatus("idle");
              setSubmitMessage("");
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="bg-white text-black px-12 py-3 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-gray-200 transition-colors inline-block mt-4 cursor-pointer"
          >
            {bookNowText || "Inquire Now"}
          </motion.button>
        ) : (
          <motion.a 
            href={`/${lang}/contact?subject=${encodeURIComponent(title)}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="bg-white text-black px-12 py-3 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-gray-200 transition-colors inline-block mt-4"
          >
            {bookNowText || "Book Now"}
          </motion.a>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false);
            }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all z-10"
              >
                <IconX size={20} />
              </button>

              <div className="p-8 sm:p-10 overflow-y-auto custom-scrollbar">
                <h3 className="text-3xl font-light font-cormorant text-brand-dark-brown mb-2 pr-8">{modalTitle}</h3>
                <p className="text-gray-500 text-sm mb-8">{modalDesc}</p>

                <form onSubmit={handleModalSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold tracking-widest uppercase text-gray-700">
                      {labelName}
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-dark-brown focus:ring-1 focus:ring-brand-dark-brown bg-gray-50 focus:bg-white transition-all text-sm text-black"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold tracking-widest uppercase text-gray-700">
                      {labelEmail}
                    </label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-dark-brown focus:ring-1 focus:ring-brand-dark-brown bg-gray-50 focus:bg-white transition-all text-sm text-black"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold tracking-widest uppercase text-gray-700">
                      {labelPhone}
                    </label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-dark-brown focus:ring-1 focus:ring-brand-dark-brown bg-gray-50 focus:bg-white transition-all text-sm text-black"
                    />
                  </div>

                  <div className="flex flex-col gap-4 mt-2">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold tracking-widest uppercase text-gray-700">Service</label>
                      <div className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-100 text-gray-500 text-xs truncate">
                        {title || '-'}
                      </div>
                    </div>
                  </div>

                  {submitMessage && (
                    <div className={`mt-2 p-4 rounded-xl text-sm font-medium ${submitStatus === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                      {submitMessage}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={submitStatus === 'loading'}
                    className="w-full py-4 mt-4 bg-brand-dark-brown text-white text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-[#b07023] transition-colors disabled:opacity-50"
                  >
                    {submitStatus === 'loading' ? '...' : btnSubmit}
                  </button>
                </form>

                {finalWhatsappNumber && (
                  <div className="mt-8 flex flex-col items-center">
                    <div className="flex items-center w-full gap-4 mb-6">
                      <div className="h-px bg-gray-200 flex-1" />
                      <span className="text-xs font-bold tracking-widest uppercase text-gray-400">
                        {lang === 'es' ? 'O' : 'OR'}
                      </span>
                      <div className="h-px bg-gray-200 flex-1" />
                    </div>
                    
                    <button
                      onClick={handleWhatsAppInquiry}
                      className="flex items-center justify-center w-full py-4 px-5 bg-black text-white text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-gray-800 hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-2">
                        <IconBrandWhatsapp size={18} />
                        <span>{btnWhatsapp}</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (Scroll to Top / Inquire) */}
      <AnimatePresence>
        {showFab && (
          <motion.button
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] bg-brand-dark-brown text-white px-5 py-3 md:px-6 md:py-4 rounded-full shadow-2xl flex items-center gap-3 hover:bg-[#b07023] hover:shadow-3xl transition-all"
          >
            <span className="text-[10px] md:text-xs uppercase tracking-widest font-bold">
              {bookNowText || "Inquire Now"}
            </span>
            <IconArrowUp size={16} stroke={2.5} />
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}
