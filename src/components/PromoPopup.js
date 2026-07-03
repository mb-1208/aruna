"use client";

import { useState, useEffect } from "react";
import { IconX } from "@tabler/icons-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { subscribeEmail } from "@/app/actions/newsletter";

export default function PromoPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const { currentLang, globalContent } = useLanguage();
  const lang = currentLang;

  const promo = globalContent?.promo?.[lang] || {
    title: "Get 10% off on your<br />first trip",
    description: "Become a part of our community and be the first to get notified about new destinations",
    placeholder: "E-mail",
    button: "Sign Up Now"
  };

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    const result = await subscribeEmail(email, "Promo Popup", promo.title.replace(/<[^>]*>?/gm, ' '));
    setStatus(result.success ? "success" : "error");
    setMessage(result.message || result.error);
    if (result.success) {
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }
  };

  useEffect(() => {
    // Show popup shortly after page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500); 
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 bg-white p-8 w-[90%] max-w-[400px] shadow-2xl flex flex-col font-sans border border-gray-100 animate-in slide-in-from-bottom-10 fade-in duration-500">
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 text-black hover:text-gray-500 transition-colors"
      >
        <IconX size={24} stroke={1.5} />
      </button>
      
      <div className="text-center mt-4 mb-6">
        <h3 className="text-3xl font-light leading-tight mb-4 text-black" dangerouslySetInnerHTML={{ __html: promo.title }} />
        <p className="text-base text-gray-800 leading-relaxed px-2">
          {promo.description}
        </p>
      </div>

      {status === "success" ? (
        <div className="text-center py-6 text-green-600 font-medium">
          {message}
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder={promo.placeholder} 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            className="w-full border border-gray-400 p-4 text-base focus:outline-none focus:border-black transition-colors disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={status === "loading"}
            className="w-full bg-black text-white py-4 text-base hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "..." : promo.button}
          </button>
          {status === "error" && <div className="text-red-500 text-sm text-center">{message}</div>}
        </form>
      )}
    </div>
  );
}
