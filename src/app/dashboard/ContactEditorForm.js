import { useState } from 'react';
import { uploadImageToSupabase } from '@/lib/imageUpload';

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

const Section = ({ title, children }) => (
  <div className="mb-8 border border-[#ebd8c0]/80 p-6 rounded-2xl bg-white shadow-2xs">
    <h3 className="text-base font-semibold text-[#1c1917] mb-4">{title}</h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

export default function ContactEditorForm({ content, setContent }) {
  const updateContent = (key, value) => {
    setContent({ ...content, [key]: value });
  };

  const updateLabel = (key, value) => {
    setContent({
      ...content,
      labels: {
        ...(content.labels || {}),
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <Section title="Hero Section">
        <ImageUpload
          label="Hero Background Image"
          hint="1920x1080 (Landscape)"
          value={content.heroImage}
          onChange={(val) => updateContent("heroImage", val)}
        />
        <Input
          label="Title"
          value={content.title}
          onChange={(val) => updateContent("title", val)}
        />
      </Section>

      <Section title="Form Labels">
        <Input
          label="Name Label"
          value={content.labels?.name || ''}
          onChange={(val) => updateLabel("name", val)}
        />
        <Input
          label="Email Label"
          value={content.labels?.email || ''}
          onChange={(val) => updateLabel("email", val)}
        />
        <Input
          label="Phone Label"
          value={content.labels?.phone || ''}
          onChange={(val) => updateLabel("phone", val)}
        />
        <Input
          label="Subject Label"
          value={content.labels?.subject || ''}
          onChange={(val) => updateLabel("subject", val)}
        />
        <Input
          label="Comment Label"
          value={content.labels?.comment || ''}
          onChange={(val) => updateLabel("comment", val)}
        />
        <Input
          label="Button Text"
          value={content.labels?.button || ''}
          onChange={(val) => updateLabel("button", val)}
        />
      </Section>
    </div>
  );
}
