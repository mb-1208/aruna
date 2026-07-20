"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.webp";
import {
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandWhatsapp,
  IconBrandTiktok,
  IconChevronDown,
  IconMenu2,
  IconX
} from "@tabler/icons-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const { currentLang, globalContent, isMounted } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const lang = currentLang;
  const socialLinks = globalContent?.social_links || {};
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

  const leftLinks = pathname.includes("/retreats")
    ? [
      { name: navContent.destinations || 'Destinations', hash: "#destinations", targetPath: "/retreats" },
      { name: navContent.reviews || 'Reviews', hash: "#reviews", targetPath: "/retreats" },
      { name: navContent.gallery || 'Gallery', hash: "#gallery", targetPath: "/retreats" },
      { name: navContent.faq || 'FAQ', hash: "#faq", targetPath: "/retreats" }
    ]
    : [
      { name: navContent.services || 'Services', hash: "#services", targetPath: "/travel" },
      { name: navContent.about || 'About', hash: "#about", targetPath: "/travel" },
      { name: navContent.reviews || 'Reviews', hash: "#reviews", targetPath: "/travel" },
      { name: navContent.faq || 'FAQ', hash: "#faq", targetPath: "/travel" }
    ];


  const handleLangChange = (newLang) => {
    const lang = newLang.toLowerCase();
    const segments = pathname.split('/');
    if (segments[1] === 'en' || segments[1] === 'es') {
      segments[1] = lang;
    } else {
      segments.splice(1, 0, lang);
    }
    const newPath = segments.join('/');

    setIsLangDropdownOpen(false);
    router.push(newPath);
  };

  const renderNavLink = (link, isMobile = false) => {
    const targetLocalized = link.targetPath === '/' ? `/${currentLang}` : `/${currentLang}${link.targetPath}`;
    const isSamePage = pathname === targetLocalized || pathname === `${targetLocalized}/`;
    const href = isSamePage ? link.hash : `${targetLocalized}${link.hash}`;
    const className = isMobile
      ? "text-gray-600 hover:text-black transition-colors"
      : "hover:opacity-70 transition-opacity";

    if (isSamePage) {
      return (
        <a key={link.name} href={href} onClick={closeMenu} className={className}>
          {link.name}
        </a>
      );
    }
    return (
      <Link
        key={link.name}
        href={href}
        onClick={(e) => {
          if (typeof window !== 'undefined' && window !== window.parent) {
            e.preventDefault();
            window.location.href = href;
          } else {
            closeMenu();
          }
        }}
        className={className}
      >
        {link.name}
      </Link>
    );
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 lg:px-8 py-4 lg:py-6 2xl:py-10 text-white font-sans transition-colors duration-300 border-b ${isScrolled ? "bg-[#d18529]/40 backdrop-blur-md border-[#feeedf]/10" : "bg-transparent border-transparent"}`}
      >

        {/* Left Links & Logo (Desktop) */}
        <div className="hidden lg:flex flex-1 gap-4 xl:gap-8 items-center text-sm tracking-widest capitalize overflow-hidden">
          <Link
            href={`/${currentLang}`}
            onClick={(e) => {
              if (typeof window !== 'undefined' && window !== window.parent) {
                e.preventDefault();
                window.location.href = `/${currentLang}`;
              }
            }}
            className="flex-shrink-0 mr-2 xl:mr-4"
          >
            <Image src={globalContent?.logo_url || logo} alt="Aruna Logo" className="h-16 xl:h-20 2xl:h-24 w-auto object-contain drop-shadow-md" priority unoptimized={!!globalContent?.logo_url} width={180} height={80} />
          </Link>
          <div className="flex items-center gap-4 xl:gap-8 flex-nowrap whitespace-nowrap">
            {leftLinks.map(link => renderNavLink(link, false))}
          </div>
        </div>

        {/* Center Group: Travel - Retreats (Desktop) */}
        <div className="hidden lg:flex flex-none items-center gap-8 xl:gap-12 text-sm tracking-widest capitalize mx-4">
          <Link
            href={`/${currentLang}/travel`}
            onClick={(e) => {
              if (typeof window !== 'undefined' && window !== window.parent) {
                e.preventDefault();
                window.location.href = `/${currentLang}/travel`;
              }
            }}
            className={`hover:opacity-70 transition-all ${pathname === `/${currentLang}/travel` || (pathname.startsWith(`/${currentLang}/travel`) && pathname !== `/${currentLang}/travel`) ? "border-b border-white pb-1" : "pb-1 border-b border-transparent"}`}
          >
            {navContent.travel || 'Travel'}
          </Link>

          <Link
            href={`/${currentLang}/retreats`}
            onClick={(e) => {
              if (typeof window !== 'undefined' && window !== window.parent) {
                e.preventDefault();
                window.location.href = `/${currentLang}/retreats`;
              }
            }}
            className={`hover:opacity-70 transition-all ${pathname === `/${currentLang}/retreats` || (pathname.startsWith(`/${currentLang}/retreats`) && pathname !== `/${currentLang}/retreats`) ? "border-b border-white pb-1" : "pb-1 border-b border-transparent"}`}
          >
            {navContent.retreats || 'Retreats'}
          </Link>
        </div>

        {/* Mobile Logo (Visible only on Mobile) */}
        <div className="lg:hidden flex items-center">
          <Link href={`/${currentLang}`}>
            <Image src={globalContent?.logo_url || logo} alt="Aruna Logo" className="h-16 w-auto object-contain drop-shadow-md" priority unoptimized={!!globalContent?.logo_url} width={160} height={80} />
          </Link>
        </div>

        {/* Right Links & Icons (Desktop) */}
        <div className="hidden lg:flex flex-1 gap-4 xl:gap-6 items-center text-sm tracking-widest capitalize justify-end overflow-hidden">
          {/* Social Icons */}
          <div className="flex gap-2 xl:gap-3 items-center">
            <a href={socialLinks.whatsapp || "#"} className="hover:opacity-70 transition-opacity" target="_blank" rel="noopener noreferrer"><IconBrandWhatsapp size={18} stroke={1.5} /></a>
            <a href={socialLinks.instagram || "#"} className="hover:opacity-70 transition-opacity" target="_blank" rel="noopener noreferrer"><IconBrandInstagram size={18} stroke={1.5} /></a>
            <a href={socialLinks.tiktok || "#"} className="hover:opacity-70 transition-opacity" target="_blank" rel="noopener noreferrer"><IconBrandTiktok size={18} stroke={1.5} /></a>
            <a href={socialLinks.facebook || "#"} className="hover:opacity-70 transition-opacity" target="_blank" rel="noopener noreferrer"><IconBrandFacebook size={18} stroke={1.5} /></a>
          </div>

          {/* Language/Currency Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="bg-white text-black rounded-full px-3 py-1 hover:bg-gray-200 transition-colors flex items-center gap-1 uppercase cursor-pointer font-medium"
            >
              {isMounted ? currentLang.toUpperCase() : "EN"} <IconChevronDown size={14} className={`transform transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isLangDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg py-2 w-24 overflow-hidden"
                >
                  <button onClick={() => handleLangChange("EN")} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors">EN</button>
                  <button onClick={() => handleLangChange("ES")} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors">ES</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden flex items-center">
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-white focus:outline-none pr-4">
            <IconMenu2 size={28} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Slide-Over Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[70] flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="absolute inset-0 bg-[#d18529]/60 backdrop-blur-sm"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="relative w-64 md:w-80 h-full bg-white text-black flex flex-col p-8 shadow-2xl"
            >
              <button onClick={closeMenu} className="absolute top-6 right-6 text-gray-500 hover:text-black transition-colors">
                <IconX size={28} />
              </button>

              <div className="mt-12 flex flex-col gap-6 text-lg tracking-widest uppercase">
                {leftLinks.map(link => renderNavLink(link, true))}

                <hr className="border-gray-200 my-4" />

                <Link href={`/${currentLang}/travel`} onClick={closeMenu} className={`hover:text-black transition-colors ${pathname === `/${currentLang}/travel` ? "text-black font-bold" : "text-gray-600"}`}>
                  {navContent.travel || 'Travel'}
                </Link>
                <Link href={`/${currentLang}/retreats`} onClick={closeMenu} className={`hover:text-black transition-colors ${pathname.startsWith(`/${currentLang}/retreats`) ? "text-black font-bold" : "text-gray-600"}`}>
                  {navContent.retreats || 'Retreats'}
                </Link>

                <hr className="border-gray-200 my-4" />

                {/* Mobile Language Selector */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <button
                    onClick={() => handleLangChange("EN")}
                    className={`${currentLang === "en" ? "text-black border-b border-black" : "hover:text-black"} transition-all pb-1`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => handleLangChange("ES")}
                    className={`${currentLang === "es" ? "text-black border-b border-black" : "hover:text-black"} transition-all pb-1`}
                  >
                    ES
                  </button>
                </div>
              </div>

              {/* Mobile Social Icons */}
              <div className="mt-auto flex gap-6 items-center text-gray-600">
                <a href={socialLinks.whatsapp || "#"} className="hover:text-black transition-colors" target="_blank" rel="noopener noreferrer"><IconBrandWhatsapp size={24} stroke={1.5} /></a>
                <a href={socialLinks.instagram || "#"} className="hover:text-black transition-colors" target="_blank" rel="noopener noreferrer"><IconBrandInstagram size={24} stroke={1.5} /></a>
                <a href={socialLinks.tiktok || "#"} className="hover:text-black transition-colors" target="_blank" rel="noopener noreferrer"><IconBrandTiktok size={24} stroke={1.5} /></a>
                <a href={socialLinks.facebook || "#"} className="hover:text-black transition-colors" target="_blank" rel="noopener noreferrer"><IconBrandFacebook size={24} stroke={1.5} /></a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
