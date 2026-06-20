"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("EN");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const leftLinks = pathname.startsWith("/retreats")
    ? [
      { name: "Destinations", hash: "#destinations", targetPath: "/retreats" },
      { name: "Reviews", hash: "#reviews", targetPath: "/retreats" },
      { name: "Gallery", hash: "#gallery", targetPath: "/retreats" },
      { name: "FAQ", hash: "#faq", targetPath: "/retreats" }
    ]
    : [
      { name: "Services", hash: "#services", targetPath: "/travel" },
      { name: "About", hash: "#about", targetPath: "/travel" },
      { name: "Reviews", hash: "#reviews", targetPath: "/travel" },
      { name: "FAQ", hash: "#faq", targetPath: "/travel" }
    ];

  const handleLangChange = (lang) => {
    setCurrentLang(lang);
    setIsLangDropdownOpen(false);
  };

  const renderNavLink = (link, isMobile = false) => {
    const isSamePage = pathname === link.targetPath || (pathname === '/' && link.targetPath === '/');
    const href = isSamePage ? link.hash : `${link.targetPath}${link.hash}`;
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
      <Link key={link.name} href={href} onClick={closeMenu} className={className}>
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
        className={`fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 md:px-8 py-4 md:py-6 text-white font-sans transition-all duration-300 ${isScrolled ? "bg-black/40 backdrop-blur-md border-b border-white/10" : "bg-transparent"}`}
      >

        {/* Left Links (Desktop) */}
        <div className="hidden md:flex gap-8 items-center text-sm tracking-widest capitalize w-1/3">
          {leftLinks.map(link => renderNavLink(link, false))}
        </div>

        {/* Center Group: Travel - Logo - Retreats (Desktop) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center w-[340px] text-sm tracking-widest capitalize">
          <div className="flex-1 flex justify-end pr-8">
            <Link
              href="/travel"
              className={`hover:opacity-70 transition-all ${pathname === "/travel" ? "border-b border-white pb-1" : "pb-1 border-b border-transparent"}`}
            >
              Travel
            </Link>
          </div>

          <Link href="/" className="flex-shrink-0">
            <Image src={logo} alt="Aruna Logo" className="h-16 w-auto object-contain drop-shadow-md" priority />
          </Link>

          <div className="flex-1 flex justify-start pl-8">
            <Link
              href="/retreats"
              className={`hover:opacity-70 transition-all ${pathname.startsWith("/retreats") ? "border-b border-white pb-1" : "pb-1 border-b border-transparent"}`}
            >
              Retreats
            </Link>
          </div>
        </div>

        {/* Mobile Logo (Visible only on Mobile) */}
        <div className="md:hidden flex items-center">
          <Link href="/">
            <Image src={logo} alt="Aruna Logo" className="h-12 w-auto object-contain drop-shadow-md" priority />
          </Link>
        </div>

        {/* Right Links & Icons (Desktop) */}
        <div className="hidden md:flex gap-6 items-center text-sm tracking-widest capitalize justify-end w-1/3">
          {/* Social Icons */}
          <div className="flex gap-3 items-center">
            <a href="#" className="hover:opacity-70 transition-opacity"><IconBrandWhatsapp size={18} stroke={1.5} /></a>
            <a href="#" className="hover:opacity-70 transition-opacity"><IconBrandInstagram size={18} stroke={1.5} /></a>
            <a href="#" className="hover:opacity-70 transition-opacity"><IconBrandTiktok size={18} stroke={1.5} /></a>
            <a href="#" className="hover:opacity-70 transition-opacity"><IconBrandFacebook size={18} stroke={1.5} /></a>
          </div>

          {/* Language/Currency Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="bg-white text-black rounded-full px-3 py-1 hover:bg-gray-200 transition-colors flex items-center gap-1 uppercase cursor-pointer font-medium"
            >
              {currentLang} <IconChevronDown size={14} className={`transform transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
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
        <div className="md:hidden flex items-center">
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
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
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

                <Link href="/travel" onClick={closeMenu} className={`hover:text-black transition-colors ${pathname === "/travel" ? "text-black font-bold" : "text-gray-600"}`}>
                  Travel
                </Link>
                <Link href="/retreats" onClick={closeMenu} className={`hover:text-black transition-colors ${pathname.startsWith("/retreats") ? "text-black font-bold" : "text-gray-600"}`}>
                  Retreats
                </Link>

                <hr className="border-gray-200 my-4" />

                {/* Mobile Language Selector */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <button
                    onClick={() => handleLangChange("EN")}
                    className={`${currentLang === "EN" ? "text-black border-b border-black" : "hover:text-black"} transition-all pb-1`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => handleLangChange("ES")}
                    className={`${currentLang === "ES" ? "text-black border-b border-black" : "hover:text-black"} transition-all pb-1`}
                  >
                    ES
                  </button>
                </div>
              </div>

              {/* Mobile Social Icons */}
              <div className="mt-auto flex gap-6 items-center text-gray-600">
                <a href="#" className="hover:text-black transition-colors"><IconBrandWhatsapp size={24} stroke={1.5} /></a>
                <a href="#" className="hover:text-black transition-colors"><IconBrandInstagram size={24} stroke={1.5} /></a>
                <a href="#" className="hover:text-black transition-colors"><IconBrandTiktok size={24} stroke={1.5} /></a>
                <a href="#" className="hover:text-black transition-colors"><IconBrandFacebook size={24} stroke={1.5} /></a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
