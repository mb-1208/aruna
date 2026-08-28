"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { subscribeEmail } from "@/app/actions/newsletter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RetreatCTA({ title, text, image, boxTitle, emailLabel, buttonText, source = "Retreats CTA" }) {
  const { currentLang } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    // Strip HTML from title for the details field
    const cleanTitle = (title || "DON'T WANNA MISS A THING?").replace(/<[^>]*>?/gm, ' ');
    const result = await subscribeEmail(email, source, cleanTitle);
    
    setStatus(result.success ? "success" : "error");
    setMessage(result.message || result.error);
    
    if (result.success) {
      setTimeout(() => {
        setEmail("");
        setStatus("idle");
        setMessage("");
      }, 4000);
    }
  };

  return (
    <section className="relative w-full h-auto min-h-[500px] flex items-center overflow-hidden font-sans">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${image || 'https://placehold.co/1920x800.png'}")` }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 py-16 flex flex-col md:flex-row justify-between items-center gap-12">

        {/* Left Side: Headline */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-center md:text-left"
        >
          <h2 
            className="text-white text-4xl md:text-5xl lg:text-6xl font-light uppercase tracking-wide drop-shadow-md"
            dangerouslySetInnerHTML={{ __html: title || "DON'T WANNA MISS<br className=\"hidden md:block\" />A THING?" }}
          />
        </motion.div>

        {/* Right Side: Subscription Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-md bg-white p-8 md:p-12 shadow-2xl"
        >
          <h3 className="text-2xl font-light uppercase text-center mb-4 tracking-widest text-black">
            {boxTitle || "GET IN TOUCH"}
          </h3>
          <p className="text-center text-sm text-gray-600 mb-8 leading-relaxed">
            {text || "Add this email form so that they will be the first to know your details & early booking."}
          </p>

          {status === "success" ? (
            <div className="text-center py-6 text-green-600 font-medium tracking-wide">
              {message}
            </div>
          ) : (
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label htmlFor="cta-email" className="text-xs uppercase tracking-widest text-gray-500">
                  {emailLabel || "Email"}
                </label>
                <input
                  type="email"
                  id="cta-email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent text-black disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-black text-white py-4 text-sm tracking-widest uppercase hover:bg-gray-800 transition-colors mt-2 disabled:opacity-50"
              >
                {status === "loading" ? "..." : (buttonText || "Subscribe")}
              </button>
              {status === "error" && <div className="text-red-500 text-sm text-center">{message}</div>}
            </form>
          )}
        </motion.div>

      </div>
    </section>
  );
}
