"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "../assets/logo-2.webp";
import { IconBrandInstagram, IconBrandFacebook, IconBrandWhatsapp, IconBrandTiktok } from "@tabler/icons-react";
import { subscribeEmail } from "@/app/actions/newsletter";

export default function Footer() {
  const pathname = usePathname();
  const { currentLang, globalContent } = useLanguage();
  const lang = currentLang;
  const socialLinks = globalContent?.social_links || {};

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    const isRetreats = pathname.includes("/retreats");
    const subscribeTitle = isRetreats ? (foot.retreats_newsletter_title || foot.newsletter_title) : foot.newsletter_title;

    const result = await subscribeEmail(email, "Footer", subscribeTitle);
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

  const navContent = globalContent?.navbar?.[lang] || {
    travel: 'Travel',
    retreats: 'Retreats',
    services: 'Services',
    about: 'About',
    reviews: 'Reviews',
    faq: 'FAQ',
    destinations: 'Destinations',
    gallery: 'Gallery'
  };

  const foot = globalContent?.footer?.[lang] || {
    description: "Aruna brings you to exotic destinations with a personal, refined touch.",
    phone: "+62 851 2222 3333",
    email: "hello@arunatravelstudio.com",
    company_title: "The Company",
    newsletter_title: "Stay Connected",
    newsletter_desc: "Join our newsletter for exclusive travel tips and early access to our curated retreats.",
    subscribe_btn: "Subscribe",
    copyright: `© ${new Date().getFullYear()} Aruna. All rights reserved.`,
    link_contact: "Contact Us",
    link_legal: "Legal",
    link_privacy: "Privacy Policy"
  };

  return (
    <footer className="bg-[#D2B799] text-white pt-20 pb-8 px-8 font-sans">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16 md:gap-8 mb-16">

        {/* Column 1: Logo & Info */}
        <div className="flex-1 md:pr-12 mb-12 md:mb-0">
          <Link href={`/${lang}`} className="inline-block mb-2">
            <Image src={globalContent?.footer_logo_url || globalContent?.logo_url || logo} alt="Aruna Logo" className="h-20 2xl:h-44 w-auto opacity-80" unoptimized priority width={180} height={80} />
          </Link>
          <p className="pl-2 text-white/90 text-lg leading-relaxed mb-8">
            {foot.description}
          </p>
          <div className="pl-2 flex gap-4 items-center mb-8">
            {socialLinks.whatsapp && (
              <a 
                href={socialLinks.whatsapp.startsWith('http') ? socialLinks.whatsapp : `https://wa.me/${socialLinks.whatsapp.replace(/[^0-9]/g, '')}`} 
                className="text-white/90 hover:text-white transition-colors" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <IconBrandWhatsapp size={20} stroke={1.5} />
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} className="text-white/90 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <IconBrandInstagram size={20} stroke={1.5} />
              </a>
            )}
            {socialLinks.tiktok && (
              <a href={socialLinks.tiktok} className="text-white/90 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <IconBrandTiktok size={20} stroke={1.5} />
              </a>
            )}
            {socialLinks.facebook && (
              <a href={socialLinks.facebook} className="text-white/90 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <IconBrandFacebook size={20} stroke={1.5} />
              </a>
            )}
          </div>
          {foot.phone && (
            <a 
              href={`tel:${foot.phone.replace(/[^0-9+]/g, '')}`} 
              className="pl-2 text-white/90 text-lg hover:text-white transition-colors block mb-1"
            >
              {foot.phone}
            </a>
          )}
          {foot.email && (
            <a 
              href={`mailto:${foot.email}`} 
              className="pl-2 text-white/90 text-lg hover:text-white transition-colors block"
            >
              {foot.email}
            </a>
          )}
        </div>

        {/* Column 2: The Company */}
        <div className="flex-1">
          <h4 className="text-lg mb-6 tracking-wide">{foot.company_title}</h4>
          <ul className="space-y-4 text-base text-white/90">
            {pathname.startsWith(`/${lang}/retreats`) ? (
              <>
                <li>
                  {pathname === `/${lang}/retreats` || (pathname === `/${lang}` && `/${lang}/retreats` === `/${lang}`) ? (
                    <a href="#destinations" className="hover:text-white transition-colors">{navContent.destinations}</a>
                  ) : (
                    <Link href={`/${lang}/retreats#destinations`} className="hover:text-white transition-colors">{navContent.destinations}</Link>
                  )}
                </li>
                <li>
                  {pathname === `/${lang}/retreats` || (pathname === `/${lang}` && `/${lang}/retreats` === `/${lang}`) ? (
                    <a href="#reviews" className="hover:text-white transition-colors">{navContent.reviews}</a>
                  ) : (
                    <Link href={`/${lang}/retreats#reviews`} className="hover:text-white transition-colors">{navContent.reviews}</Link>
                  )}
                </li>
                <li>
                  {pathname === `/${lang}/retreats` || (pathname === `/${lang}` && `/${lang}/retreats` === `/${lang}`) ? (
                    <a href="#gallery" className="hover:text-white transition-colors">{navContent.gallery}</a>
                  ) : (
                    <Link href={`/${lang}/retreats#gallery`} className="hover:text-white transition-colors">{navContent.gallery}</Link>
                  )}
                </li>
                <li>
                  {pathname === `/${lang}/retreats` || (pathname === `/${lang}` && `/${lang}/retreats` === `/${lang}`) ? (
                    <a href="#faq" className="hover:text-white transition-colors">{navContent.faq}</a>
                  ) : (
                    <Link href={`/${lang}/retreats#faq`} className="hover:text-white transition-colors">{navContent.faq}</Link>
                  )}
                </li>
                <li><Link href={`/${lang}/contact`} className="hover:text-white transition-colors">{foot.link_contact}</Link></li>
              </>
            ) : (
              <>
                <li>
                  {pathname === `/${lang}/travel` || pathname === `/${lang}` ? (
                    <a href="#services" className="hover:text-white transition-colors">{navContent.services}</a>
                  ) : (
                    <Link href={`/${lang}/travel#services`} className="hover:text-white transition-colors">{navContent.services}</Link>
                  )}
                </li>
                <li>
                  {pathname === `/${lang}/travel` || pathname === `/${lang}` ? (
                    <a href="#about" className="hover:text-white transition-colors">{navContent.about}</a>
                  ) : (
                    <Link href={`/${lang}/travel#about`} className="hover:text-white transition-colors">{navContent.about}</Link>
                  )}
                </li>
                <li>
                  {pathname === `/${lang}/travel` || pathname === `/${lang}` ? (
                    <a href="#reviews" className="hover:text-white transition-colors">{navContent.reviews}</a>
                  ) : (
                    <Link href={`/${lang}/travel#reviews`} className="hover:text-white transition-colors">{navContent.reviews}</Link>
                  )}
                </li>
                <li>
                  {pathname === `/${lang}/travel` || pathname === `/${lang}` ? (
                    <a href="#faq" className="hover:text-white transition-colors">{navContent.faq}</a>
                  ) : (
                    <Link href={`/${lang}/travel#faq`} className="hover:text-white transition-colors">{navContent.faq}</Link>
                  )}
                </li>
                <li><Link href={`/${lang}/contact`} className="hover:text-white transition-colors">{foot.link_contact}</Link></li>
              </>
            )}
          </ul>
        </div>

        {/* Column 3: Stay Connected */}
        <div className="flex-1">
          <h4 className="text-lg mb-6 tracking-wide">
            {pathname.includes("/retreats")
              ? (foot.retreats_newsletter_title || foot.newsletter_title)
              : foot.newsletter_title}
          </h4>
          <p className="text-sm text-white/90 mb-6">
            {pathname.includes("/retreats")
              ? (foot.retreats_newsletter_desc || foot.newsletter_desc)
              : foot.newsletter_desc}
          </p>
          {status === "success" ? (
            <div className="text-green-500 font-medium py-2">
              {message}
            </div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                className="flex-1 bg-transparent border-b border-white/50 px-0 py-2 text-base text-white placeholder-white/60 focus:outline-none focus:border-white transition-colors disabled:opacity-50"
              />
              <button type="submit" disabled={status === "loading"} className="bg-white text-black px-8 py-2 rounded-full text-sm tracking-widest font-medium hover:bg-gray-200 transition-colors max-w-fit cursor-pointer disabled:opacity-50">
                {status === "loading" ? "..." : (pathname.includes("/retreats") ? (foot.retreats_subscribe_btn || foot.subscribe_btn) : foot.subscribe_btn)}
              </button>
              {status === "error" && <div className="text-red-500 text-sm mt-1">{message}</div>}
            </form>
          )}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="w-full max-w-7xl mx-auto border-t border-white/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/90">
        <p>{foot.copyright}</p>
        <div className="flex gap-6">
          <Link href={`/${lang}/legal`} className="hover:text-white transition-colors">{foot.link_legal}</Link>
          <Link href={`/${lang}/privacy`} className="hover:text-white transition-colors">{foot.link_privacy}</Link>
        </div>
      </div>
    </footer>
  );
}
