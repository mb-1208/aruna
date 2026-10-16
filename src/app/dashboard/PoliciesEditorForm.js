"use client";

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { uploadImageToSupabase } from '@/lib/imageUpload';

// Dynamically import DefaultEditor to avoid SSR issues
const DefaultEditor = dynamic(
  () => import('react-simple-wysiwyg').then(mod => mod.DefaultEditor), 
  { ssr: false }
);

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

const Input = ({ label, value, onChange, type="text" }) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold uppercase tracking-wider text-[#63594f] mb-2">{label}</label>
    {type === "textarea" ? (
      <textarea rows={4} value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full border border-[#ebd8c0] rounded-lg p-3 text-sm focus:outline-none focus:border-[#d18529] focus:ring-1 focus:ring-[#d18529] transition-colors bg-[#faf7f3]/50 text-[#1c1917]" />
    ) : (
      <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full border border-[#ebd8c0] rounded-lg p-3 text-sm focus:outline-none focus:border-[#d18529] focus:ring-1 focus:ring-[#d18529] transition-colors bg-[#faf7f3]/50 text-[#1c1917]" />
    )}
  </div>
);

const ImageUpload = ({ label, value, onChange, hint }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  return (
    <div className="mb-4">
      <div className="flex items-baseline gap-2 mb-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#63594f]">{label}</label>
        {hint && <span className="text-[10px] text-[#9c9184] italic">Recommended: {hint}</span>}
      </div>
      <div className="flex items-center gap-4">
        {value && (
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#faf6f0] shrink-0 border border-[#ebd8c0] relative group">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <input 
            type="file" 
            accept="image/*"
            disabled={isUploading}
            onChange={async (e) => {
              const file = e.target.files[0];
              if (file) {
                try {
                  setIsUploading(true);
                  setErrorMsg('');
                  const publicUrl = await uploadImageToSupabase(file);
                  onChange(publicUrl);
                } catch (err) {
                  setErrorMsg('Upload failed. Please try again.');
                  console.error(err);
                } finally {
                  setIsUploading(false);
                }
              }
            }}
            className={`block w-full text-xs text-[#786e65] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:uppercase file:tracking-wider ${isUploading ? 'file:bg-stone-200 file:text-stone-400 cursor-not-allowed' : 'file:bg-[#d18529] file:text-white hover:file:bg-[#b8701d] cursor-pointer'} transition-colors`} 
          />
          {isUploading && <div className="text-xs text-[#b8701d] mt-2 font-medium animate-pulse">Uploading and optimizing image...</div>}
          {errorMsg && <div className="text-xs text-red-600 mt-2 font-medium">{errorMsg}</div>}
        </div>
      </div>
    </div>
  );
};

export default function PoliciesEditorForm({ content, setContent }) {
  const updateContent = (key, value) => setContent(prev => ({ ...prev, [key]: value }));

  useEffect(() => {
    // Auto-migrate old structured content to new rich text on first load if rich text is empty
    if (!content.rich_text && content.content && content.content.length > 0) {
      setContent(prev => ({ ...prev, rich_text: generateHtmlFromSections(prev.content) }));
    }
    if (!content.rich_text_es && content.content_es && content.content_es.length > 0) {
      setContent(prev => ({ ...prev, rich_text_es: generateHtmlFromSections(prev.content_es) }));
    }
  }, [content.rich_text, content.rich_text_es, content.content, content.content_es, setContent]);


  return (
    <div className="space-y-8 pb-12">
      <div className="border border-[#ebd8c0]/80 rounded-2xl p-6 bg-white shadow-2xs space-y-6">
        <h3 className="text-base font-semibold text-[#1c1917] border-b border-[#ebd8c0]/60 pb-3 mb-4">Page Headers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Page Title (EN)" value={content.title} onChange={(val) => updateContent('title', val)} />
          <Input label="Page Title (ES)" value={content.title_es} onChange={(val) => updateContent('title_es', val)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Intro Text (EN)" type="textarea" value={content.intro_text} onChange={(val) => updateContent('intro_text', val)} />
          <Input label="Intro Text (ES)" type="textarea" value={content.intro_text_es} onChange={(val) => updateContent('intro_text_es', val)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageUpload label="Hero Image" hint="1920x1080 (Landscape)" value={content.hero_image} onChange={(val) => updateContent('hero_image', val)} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="border border-[#ebd8c0]/80 rounded-2xl p-6 bg-white shadow-2xs space-y-6">
          <h3 className="text-base font-semibold text-[#1c1917] border-b border-[#ebd8c0]/60 pb-3 mb-4">English Content (Rich Text)</h3>
          <div className="bg-white prose prose-sm max-w-none prose-ul:list-disc prose-ol:list-decimal">
            <DefaultEditor 
              value={content.rich_text || ""} 
              onChange={(e) => updateContent('rich_text', e.target.value)}
              className="min-h-[300px]"
            />
          </div>
        </div>
        
        <div className="border border-[#ebd8c0]/80 rounded-2xl p-6 bg-white shadow-2xs space-y-6">
          <h3 className="text-base font-semibold text-[#1c1917] border-b border-[#ebd8c0]/60 pb-3 mb-4">Spanish Content (Rich Text)</h3>
          <div className="bg-white prose prose-sm max-w-none prose-ul:list-disc prose-ol:list-decimal">
            <DefaultEditor 
              value={content.rich_text_es || ""} 
              onChange={(e) => updateContent('rich_text_es', e.target.value)} 
              className="min-h-[300px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
