import { useState } from 'react';
import { uploadImageToSupabase } from '@/lib/imageUpload';

const Input = ({ label, value, onChange, type="text" }) => (
  <div className="mb-4">
    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{label}</label>
    {type === "textarea" ? (
      <textarea rows={4} value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors" />
    ) : (
      <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors" />
    )}
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

const Section = ({ title, children }) => (
  <div className="mb-8 border border-gray-200 p-6 rounded-xl bg-white shadow-sm">
    <h3 className="text-lg font-bold mb-4">{title}</h3>
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
