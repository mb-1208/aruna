"use client";

import { useState } from "react";

export default function LocalizationEditor({
  localizationTab,
  setLocalizationTab,
  homeContent,
  esHomeContent,
  setEsHomeContent,
  travelContent,
  esTravelContent,
  setEsTravelContent,
  retreatsContent,
  esRetreatsContent,
  setEsRetreatsContent,
  contactContent,
  esContactContent,
  setEsContactContent,
  legalContent,
  esLegalContent,
  setEsLegalContent,
  privacyContent,
  esPrivacyContent,
  setEsPrivacyContent,
  globalContent,
  setGlobalContent,
  reviews,
  setReviews,
  isSaving,
  handleSaveTranslations
}) {

  // Helper to safely update global content (which stores {en, es})
  const updateGlobal = (section, key, lang, value) => {
    setGlobalContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [lang]: {
          ...(prev[section]?.[lang] || {}),
          [key]: value
        }
      }
    }));
  };

  // Helper for arrays
  const updateEsArray = (state, setState, arrayName, index, field, value) => {
    const newArray = [...(state[arrayName] || [])];
    if (!newArray[index]) newArray[index] = {};
    newArray[index] = { ...newArray[index], [field]: value };
    setState({ ...state, [arrayName]: newArray });
  };

  return (
    <div className="flex h-full bg-gray-50">
      
      {/* Split Screen Editor */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row relative">
        
        {/* Left Column: English (Master) */}
        <div className="flex-1 border-r border-gray-200 bg-gray-50 p-10 overflow-y-auto pb-32">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">EN</div>
            <h3 className="font-bold text-lg">English (Master)</h3>
          </div>

          {/* HOME EN */}
          {localizationTab === 'home_page' && (
            <div className="space-y-6">
              <ReadOnlyField label="Travel Title" value={homeContent?.travelTitle} />
              <ReadOnlyField label="Travel Button" value={homeContent?.travelButton} />
              <ReadOnlyField label="Retreats Title" value={homeContent?.retreatsTitle} />
              <ReadOnlyField label="Retreats Button" value={homeContent?.retreatsButton} />
            </div>
          )}

          {/* TRAVEL EN */}
          {localizationTab === 'travel_page' && (
            <div className="space-y-6">
              <ReadOnlyField label="Hero Title" value={travelContent?.heroTitle} />
              <ReadOnlyField label="Scroll Label" value={travelContent?.scrollLabel} />

              <ReadOnlyField label="About Subtitle" value={travelContent?.aboutSubtitle} />
              <ReadOnlyField label="About Title" value={travelContent?.aboutTitle} />
              <ReadOnlyField label="About Text" value={travelContent?.aboutText} isTextarea />
              <ReadOnlyField label="About Quote" value={travelContent?.aboutQuote} isTextarea />
              <ReadOnlyField label="Testimonials Subtitle" value={travelContent?.testimonialsSubtitle} />
              <ReadOnlyField label="Testimonials Title" value={travelContent?.testimonialsTitle} />
              <ReadOnlyField label="Testimonials Subtext" value={travelContent?.testimonialsSubtext} isTextarea />
              <ReadOnlyField label="FAQ Subtitle" value={travelContent?.faqSubtitle} />
              <ReadOnlyField label="FAQ Title" value={travelContent?.faqTitle} />
              <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
                <h4 className="text-xs font-bold uppercase text-gray-400">FAQ Items</h4>
                {(travelContent?.faqItems || []).map((f, i) => (
                  <div key={i} className="pl-4 border-l-2 border-gray-200">
                    <ReadOnlyField label={`Q${i+1}`} value={f.question} />
                    <ReadOnlyField label={`A${i+1}`} value={f.answer} isTextarea />
                  </div>
                ))}
              </div>
              <ReadOnlyField label="CTA Title" value={travelContent?.ctaTitle} />
              <ReadOnlyField label="CTA Button Text" value={travelContent?.ctaText} />
              <ReadOnlyField label="CTA Promo Text" value={travelContent?.ctaPromoText} isTextarea />
            </div>
          )}

          {/* RETREATS EN */}
          {localizationTab === 'retreats_page' && (
            <div className="space-y-6">
              <ReadOnlyField label="Hero Title" value={retreatsContent?.heroTitle} />
              <ReadOnlyField label="Scroll Text" value={retreatsContent?.scrollText} />
              <ReadOnlyField label="Intro Subtitle" value={retreatsContent?.introSubtitle} />
              <ReadOnlyField label="Intro Title" value={retreatsContent?.introTitle} />
              <ReadOnlyField label="Intro Button Text" value={retreatsContent?.introButtonText} />
              <ReadOnlyField label="Experience Subtitle" value={retreatsContent?.experienceSubtitle} />
              <ReadOnlyField label="Experience Title" value={retreatsContent?.experienceTitle} />
              <ReadOnlyField label="Quote Subtitle" value={retreatsContent?.quoteSubtitle} />
              <ReadOnlyField label="Quote Title" value={retreatsContent?.quoteTitle} />
              <ReadOnlyField label="Mosaic Title" value={retreatsContent?.mosaicTitle} />
              <ReadOnlyField label="FAQ Subtitle" value={retreatsContent?.faqSubtitle} />
              <ReadOnlyField label="FAQ Title" value={retreatsContent?.faqTitle} />
              <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
                <h4 className="text-xs font-bold uppercase text-gray-400">FAQ Items</h4>
                {(retreatsContent?.faqItems || []).map((f, i) => (
                  <div key={i} className="pl-4 border-l-2 border-gray-200">
                    <ReadOnlyField label={`Q${i+1}`} value={f.question} />
                    <ReadOnlyField label={`A${i+1}`} value={f.answer} isTextarea />
                  </div>
                ))}
              </div>
              <ReadOnlyField label="CTA Title" value={retreatsContent?.ctaTitle} />
              <ReadOnlyField label="CTA Box Title" value={retreatsContent?.ctaBoxTitle} />
              <ReadOnlyField label="CTA Box Description" value={retreatsContent?.ctaText} isTextarea />
              <ReadOnlyField label="CTA Email Label" value={retreatsContent?.ctaEmailLabel} />
              <ReadOnlyField label="CTA Button Text" value={retreatsContent?.ctaButtonText} />
            </div>
          )}

          {/* CONTACT EN */}
          {localizationTab === 'contact_page' && (
            <div className="space-y-6">
              <ReadOnlyField label="Title" value={contactContent?.title} />
              <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
                <h4 className="text-xs font-bold uppercase text-gray-400">Form Labels</h4>
                {Object.entries(contactContent?.labels || {}).map(([key, val]) => (
                  <ReadOnlyField key={key} label={key} value={val} />
                ))}
              </div>
            </div>
          )}

          {/* GLOBAL EN */}
          {localizationTab === 'information' && (
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
                <h4 className="text-xs font-bold uppercase text-gray-400">SEO & Meta Data</h4>
                <ReadOnlyField label="Site Title" value={globalContent?.title?.en} />
                <ReadOnlyField label="Site Description" value={globalContent?.description?.en} isTextarea />
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
                <h4 className="text-xs font-bold uppercase text-gray-400">Footer Content</h4>
                {['description', 'newsletter_title', 'newsletter_desc', 'subscribe_btn', 'retreats_newsletter_title', 'retreats_newsletter_desc', 'retreats_subscribe_btn', 'copyright', 'company_title', 'link_legal', 'link_contact', 'link_privacy'].map(key => (
                  globalContent?.footer?.en?.[key] && <ReadOnlyField key={key} label={key.replace('_', ' ')} value={globalContent.footer.en[key]} isTextarea={key.includes('desc')} />
                ))}
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
                <h4 className="text-xs font-bold uppercase text-gray-400">Travel Navbar Specific Links</h4>
                {['services', 'about'].map(key => (
                  globalContent?.navbar?.en?.[key] && <ReadOnlyField key={key} label={key} value={globalContent.navbar.en[key]} />
                ))}
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
                <h4 className="text-xs font-bold uppercase text-gray-400">Retreats Navbar Specific Links</h4>
                {['destinations', 'gallery'].map(key => (
                  globalContent?.navbar?.en?.[key] && <ReadOnlyField key={key} label={key} value={globalContent.navbar.en[key]} />
                ))}
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
                <h4 className="text-xs font-bold uppercase text-gray-400">Promo Popup</h4>
                {Object.entries(globalContent?.promo?.en || {}).map(([key, val]) => (
                  <ReadOnlyField key={key} label={key} value={val} isTextarea={val.length > 50} />
                ))}
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
                <h4 className="text-xs font-bold uppercase text-gray-400">Products CTA Section</h4>
                <ReadOnlyField label="Title" value={globalContent?.cta?.en?.title} />
                <ReadOnlyField label="Box Title" value={globalContent?.cta?.en?.boxTitle} />
                <ReadOnlyField label="Text" value={globalContent?.cta?.en?.text} isTextarea />
                <ReadOnlyField label="Button Text" value={globalContent?.cta?.en?.buttonText} />
                <ReadOnlyField label="Email Label" value={globalContent?.cta?.en?.emailLabel} />
              </div>
            </div>
          )}

          {/* REVIEWS EN */}
          {localizationTab === 'reviews' && (
            <div className="space-y-6">
              {reviews.map((rev, index) => (
                <div key={rev.id || index} className="p-6 bg-white rounded-xl border border-gray-100">
                  <h4 className="text-xs font-bold uppercase text-gray-400 mb-4">Review {index + 1} ({rev.category})</h4>
                  <ReadOnlyField label="Name" value={rev.name} />
                  <ReadOnlyField label="Quote" value={rev.quote} isTextarea />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Spanish (Translation) */}
        <div className="flex-1 bg-white p-10 overflow-y-auto shadow-inner pb-32">
          <div className="flex items-center gap-2 mb-8 justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center text-xs font-bold">ES</div>
              <h3 className="font-bold text-lg">Spanish (Translation)</h3>
            </div>
            {/* The Save button will be fixed at the bottom, but we keep the title row here */}
          </div>
          
          {/* HOME ES */}
          {localizationTab === 'home_page' && (
            <div className="space-y-6">
              <EditField label="Travel Title" value={esHomeContent?.travelTitle} onChange={(val) => setEsHomeContent({...esHomeContent, travelTitle: val})} />
              <EditField label="Travel Button" value={esHomeContent?.travelButton} onChange={(val) => setEsHomeContent({...esHomeContent, travelButton: val})} />
              <EditField label="Retreats Title" value={esHomeContent?.retreatsTitle} onChange={(val) => setEsHomeContent({...esHomeContent, retreatsTitle: val})} />
              <EditField label="Retreats Button" value={esHomeContent?.retreatsButton} onChange={(val) => setEsHomeContent({...esHomeContent, retreatsButton: val})} />
            </div>
          )}

          {/* TRAVEL ES */}
          {localizationTab === 'travel_page' && (
            <div className="space-y-6">
              <EditField label="Hero Title" value={esTravelContent?.heroTitle} onChange={(val) => setEsTravelContent({...esTravelContent, heroTitle: val})} />
              <EditField label="Scroll Label" value={esTravelContent?.scrollLabel} onChange={(val) => setEsTravelContent({...esTravelContent, scrollLabel: val})} />
              <EditField label="About Subtitle" value={esTravelContent?.aboutSubtitle} onChange={(val) => setEsTravelContent({...esTravelContent, aboutSubtitle: val})} />
              <EditField label="About Title" value={esTravelContent?.aboutTitle} onChange={(val) => setEsTravelContent({...esTravelContent, aboutTitle: val})} />
              <EditField label="About Text" isTextarea value={esTravelContent?.aboutText} onChange={(val) => setEsTravelContent({...esTravelContent, aboutText: val})} />
              <EditField label="About Quote" isTextarea value={esTravelContent?.aboutQuote} onChange={(val) => setEsTravelContent({...esTravelContent, aboutQuote: val})} />
              <EditField label="Testimonials Subtitle" value={esTravelContent?.testimonialsSubtitle} onChange={(val) => setEsTravelContent({...esTravelContent, testimonialsSubtitle: val})} />
              <EditField label="Testimonials Title" value={esTravelContent?.testimonialsTitle} onChange={(val) => setEsTravelContent({...esTravelContent, testimonialsTitle: val})} />
              <EditField label="Testimonials Subtext" value={esTravelContent?.testimonialsSubtext} isTextarea onChange={(val) => setEsTravelContent({...esTravelContent, testimonialsSubtext: val})} />
              <EditField label="FAQ Subtitle" value={esTravelContent?.faqSubtitle} onChange={(val) => setEsTravelContent({...esTravelContent, faqSubtitle: val})} />
              <EditField label="FAQ Title" value={esTravelContent?.faqTitle} onChange={(val) => setEsTravelContent({...esTravelContent, faqTitle: val})} />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                <h4 className="text-xs font-bold uppercase text-gray-400">FAQ Items</h4>
                {(travelContent?.faqItems || []).map((f, i) => (
                  <div key={i} className="pl-4 border-l-2 border-yellow-200 space-y-4 mb-4">
                    <EditField label={`Q${i+1}`} value={esTravelContent?.faqItems?.[i]?.question} onChange={(val) => updateEsArray(esTravelContent, setEsTravelContent, 'faqItems', i, 'question', val)} />
                    <EditField label={`A${i+1}`} isTextarea value={esTravelContent?.faqItems?.[i]?.answer} onChange={(val) => updateEsArray(esTravelContent, setEsTravelContent, 'faqItems', i, 'answer', val)} />
                  </div>
                ))}
              </div>
              <EditField label="CTA Title" value={esTravelContent?.ctaTitle} onChange={(val) => setEsTravelContent({...esTravelContent, ctaTitle: val})} />
              <EditField label="CTA Button Text" value={esTravelContent?.ctaText} onChange={(val) => setEsTravelContent({...esTravelContent, ctaText: val})} />
              <EditField label="CTA Promo Text" value={esTravelContent?.ctaPromoText} isTextarea onChange={(val) => setEsTravelContent({...esTravelContent, ctaPromoText: val})} />
            </div>
          )}

          {/* RETREATS ES */}
          {localizationTab === 'retreats_page' && (
            <div className="space-y-6">
              <EditField label="Hero Title" value={esRetreatsContent?.heroTitle} onChange={(val) => setEsRetreatsContent({...esRetreatsContent, heroTitle: val})} />
              <EditField label="Scroll Text" value={esRetreatsContent?.scrollText} onChange={(val) => setEsRetreatsContent({...esRetreatsContent, scrollText: val})} />
              <EditField label="Intro Subtitle" value={esRetreatsContent?.introSubtitle} onChange={(val) => setEsRetreatsContent({...esRetreatsContent, introSubtitle: val})} />
              <EditField label="Intro Title" value={esRetreatsContent?.introTitle} onChange={(val) => setEsRetreatsContent({...esRetreatsContent, introTitle: val})} />
              <EditField label="Intro Button Text" value={esRetreatsContent?.introButtonText} onChange={(val) => setEsRetreatsContent({...esRetreatsContent, introButtonText: val})} />
              <EditField label="Experience Subtitle" value={esRetreatsContent?.experienceSubtitle} onChange={(val) => setEsRetreatsContent({...esRetreatsContent, experienceSubtitle: val})} />
              <EditField label="Experience Title" value={esRetreatsContent?.experienceTitle} onChange={(val) => setEsRetreatsContent({...esRetreatsContent, experienceTitle: val})} />
              <EditField label="Quote Subtitle" value={esRetreatsContent?.quoteSubtitle} onChange={(val) => setEsRetreatsContent({...esRetreatsContent, quoteSubtitle: val})} />
              <EditField label="Quote Title" value={esRetreatsContent?.quoteTitle} onChange={(val) => setEsRetreatsContent({...esRetreatsContent, quoteTitle: val})} />
              <EditField label="Mosaic Title" value={esRetreatsContent?.mosaicTitle} onChange={(val) => setEsRetreatsContent({...esRetreatsContent, mosaicTitle: val})} />
              <EditField label="FAQ Subtitle" value={esRetreatsContent?.faqSubtitle} onChange={(val) => setEsRetreatsContent({...esRetreatsContent, faqSubtitle: val})} />
              <EditField label="FAQ Title" value={esRetreatsContent?.faqTitle} onChange={(val) => setEsRetreatsContent({...esRetreatsContent, faqTitle: val})} />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                <h4 className="text-xs font-bold uppercase text-gray-400">FAQ Items</h4>
                {(retreatsContent?.faqItems || []).map((f, i) => (
                  <div key={i} className="pl-4 border-l-2 border-yellow-200 space-y-4 mb-4">
                    <EditField label={`Q${i+1}`} value={esRetreatsContent?.faqItems?.[i]?.question} onChange={(val) => updateEsArray(esRetreatsContent, setEsRetreatsContent, 'faqItems', i, 'question', val)} />
                    <EditField label={`A${i+1}`} isTextarea value={esRetreatsContent?.faqItems?.[i]?.answer} onChange={(val) => updateEsArray(esRetreatsContent, setEsRetreatsContent, 'faqItems', i, 'answer', val)} />
                  </div>
                ))}
              </div>
              <EditField label="CTA Title" value={esRetreatsContent?.ctaTitle} onChange={(val) => setEsRetreatsContent({...esRetreatsContent, ctaTitle: val})} />
              <EditField label="CTA Box Title" value={esRetreatsContent?.ctaBoxTitle} onChange={(val) => setEsRetreatsContent({...esRetreatsContent, ctaBoxTitle: val})} />
              <EditField label="CTA Box Description" value={esRetreatsContent?.ctaText} isTextarea onChange={(val) => setEsRetreatsContent({...esRetreatsContent, ctaText: val})} />
              <EditField label="CTA Email Label" value={esRetreatsContent?.ctaEmailLabel} onChange={(val) => setEsRetreatsContent({...esRetreatsContent, ctaEmailLabel: val})} />
              <EditField label="CTA Button Text" value={esRetreatsContent?.ctaButtonText} onChange={(val) => setEsRetreatsContent({...esRetreatsContent, ctaButtonText: val})} />
            </div>
          )}

          {/* CONTACT ES */}
          {localizationTab === 'contact_page' && (
            <div className="space-y-6">
              <EditField label="Title" value={esContactContent?.title} onChange={(val) => updateState('esContactContent', 'title', val)} />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                <h4 className="text-xs font-bold uppercase text-gray-400">Form Labels</h4>
                {Object.entries(contactContent?.labels || {}).map(([key, _]) => (
                  <EditField 
                    key={key} 
                    label={key} 
                    value={esContactContent?.labels?.[key]} 
                    onChange={(val) => {
                      setEsContactContent(prev => ({
                        ...prev,
                        labels: {
                          ...(prev?.labels || {}),
                          [key]: val
                        }
                      }));
                    }} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* GLOBAL ES */}
          {localizationTab === 'information' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                <h4 className="text-xs font-bold uppercase text-gray-400">SEO & Meta Data</h4>
                <EditField label="Site Title" value={globalContent?.title?.es} onChange={(val) => setGlobalContent(prev => ({...prev, title: {...(prev.title || {}), es: val}}))} />
                <EditField label="Site Description" value={globalContent?.description?.es} isTextarea onChange={(val) => setGlobalContent(prev => ({...prev, description: {...(prev.description || {}), es: val}}))} />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                <h4 className="text-xs font-bold uppercase text-gray-400">Navbar Links (Shared)</h4>
                {['travel', 'retreats', 'reviews', 'testimonials', 'faq'].map(key => (
                  globalContent?.navbar?.en?.[key] && <EditField key={key} label={key} value={globalContent?.navbar?.es?.[key]} onChange={(val) => updateGlobal('navbar', key, 'es', val)} />
                ))}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                <h4 className="text-xs font-bold uppercase text-gray-400">Travel Navbar Specific Links</h4>
                {['services', 'about'].map(key => (
                  globalContent?.navbar?.en?.[key] && <EditField key={key} label={key} value={globalContent?.navbar?.es?.[key]} onChange={(val) => updateGlobal('navbar', key, 'es', val)} />
                ))}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                <h4 className="text-xs font-bold uppercase text-gray-400">Retreats Navbar Specific Links</h4>
                {['destinations', 'gallery'].map(key => (
                  globalContent?.navbar?.en?.[key] && <EditField key={key} label={key} value={globalContent?.navbar?.es?.[key]} onChange={(val) => updateGlobal('navbar', key, 'es', val)} />
                ))}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                <h4 className="text-xs font-bold uppercase text-gray-400">Footer Content</h4>
                {['description', 'newsletter_title', 'newsletter_desc', 'subscribe_btn', 'retreats_newsletter_title', 'retreats_newsletter_desc', 'retreats_subscribe_btn', 'copyright', 'company_title', 'link_legal', 'link_contact', 'link_privacy'].map(key => (
                  globalContent?.footer?.en?.[key] && <EditField key={key} label={key.replace('_', ' ')} value={globalContent?.footer?.es?.[key]} isTextarea={key.includes('desc')} onChange={(val) => updateGlobal('footer', key, 'es', val)} />
                ))}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                <h4 className="text-xs font-bold uppercase text-gray-400">Promo Popup</h4>
                {Object.entries(globalContent?.promo?.en || {}).map(([key, val]) => (
                  <EditField key={key} label={key} value={globalContent?.promo?.es?.[key]} isTextarea={val.length > 50} onChange={(val) => updateGlobal('promo', key, 'es', val)} />
                ))}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                <h4 className="text-xs font-bold uppercase text-gray-400">Products CTA Section</h4>
                <EditField label="Title" value={globalContent?.cta?.es?.title} onChange={(val) => updateGlobal('cta', 'title', 'es', val)} />
                <EditField label="Box Title" value={globalContent?.cta?.es?.boxTitle} onChange={(val) => updateGlobal('cta', 'boxTitle', 'es', val)} />
                <EditField label="Text" value={globalContent?.cta?.es?.text} isTextarea onChange={(val) => updateGlobal('cta', 'text', 'es', val)} />
                <EditField label="Button Text" value={globalContent?.cta?.es?.buttonText} onChange={(val) => updateGlobal('cta', 'buttonText', 'es', val)} />
                <EditField label="Email Label" value={globalContent?.cta?.es?.emailLabel} onChange={(val) => updateGlobal('cta', 'emailLabel', 'es', val)} />
              </div>
            </div>
          )}

          {/* REVIEWS ES */}
          {localizationTab === 'reviews' && (
            <div className="space-y-6">
              {reviews.map((rev, index) => (
                <div key={rev.id || index} className="p-6 bg-white rounded-xl border border-gray-100">
                  <h4 className="text-xs font-bold uppercase text-gray-400 mb-4">Review {index + 1} ({rev.category})</h4>
                  <ReadOnlyField label="Name" value={rev.name} />
                  <EditField label="Quote" isTextarea value={rev.quote_es} onChange={(val) => {
                    const newRevs = [...reviews];
                    newRevs[index] = { ...newRevs[index], quote_es: val };
                    setReviews(newRevs);
                  }} />
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Floating Save Button Area */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200 flex justify-end shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
            <button 
              onClick={handleSaveTranslations}
              disabled={isSaving}
              className="bg-black text-white px-8 py-3 rounded-md text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Translations"}
            </button>
        </div>

      </div>
    </div>
  );
}

function ReadOnlyField({ label, value, isTextarea = false }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{label}</label>
      <div className={`w-full bg-gray-100 border border-gray-200 rounded-lg p-3 text-sm text-gray-600 ${isTextarea ? 'min-h-[80px] whitespace-pre-wrap' : 'min-h-[46px]'}`}>
        {value || ''}
      </div>
    </div>
  );
}

function EditField({ label, value, onChange, isTextarea = false }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{label}</label>
      {isTextarea ? (
        <textarea 
          rows={3}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" 
        />
      ) : (
        <input 
          type="text" 
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" 
        />
      )}
    </div>
  );
}
