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

const Input = ({ label, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{label}</label>
    <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors" />
  </div>
);

const ImageUpload = ({ label, value, onChange, hint }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  return (
    <div className="mb-4">
      <div className="flex items-baseline gap-2 mb-2">
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">{label}</label>
        {hint && <span className="text-[10px] text-gray-400 italic">Recommended: {hint}</span>}
      </div>
      <div className="flex items-center gap-4">
        {value && (
          <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 shrink-0 border border-gray-200 relative group">
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
            className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest ${isUploading ? 'file:bg-gray-300 file:text-gray-500 cursor-not-allowed' : 'file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer'} transition-colors`} 
          />
          {isUploading && <div className="text-xs text-blue-500 mt-2 font-medium animate-pulse">Uploading and optimizing image...</div>}
          {errorMsg && <div className="text-xs text-red-500 mt-2 font-medium">{errorMsg}</div>}
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
      updateContent('rich_text', generateHtmlFromSections(content.content));
    }
    if (!content.rich_text_es && content.content_es && content.content_es.length > 0) {
      updateContent('rich_text_es', generateHtmlFromSections(content.content_es));
    }
  }, [content.rich_text, content.rich_text_es, content.content, content.content_es]);


  return (
    <div className="space-y-8 pb-12">
      <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm space-y-6">
        <h3 className="text-lg font-bold border-b border-gray-100 pb-4 mb-4">Page Headers</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Page Title (EN)" value={content.title} onChange={(val) => updateContent('title', val)} />
          <Input label="Page Title (ES)" value={content.title_es} onChange={(val) => updateContent('title_es', val)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ImageUpload label="Hero Image" hint="1920x1080 (Landscape)" value={content.hero_image} onChange={(val) => updateContent('hero_image', val)} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm space-y-6">
          <h3 className="text-lg font-bold border-b border-gray-100 pb-4 mb-4">English Content (Rich Text)</h3>
          <div className="bg-white prose prose-sm max-w-none prose-ul:list-disc prose-ol:list-decimal">
            <DefaultEditor 
              value={content.rich_text || ""} 
              onChange={(e) => updateContent('rich_text', e.target.value)}
              className="min-h-[300px]"
            />
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm space-y-6">
          <h3 className="text-lg font-bold border-b border-gray-100 pb-4 mb-4">Spanish Content (Rich Text)</h3>
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
