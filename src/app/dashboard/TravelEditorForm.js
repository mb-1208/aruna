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
  <div className="mb-8 border border-gray-200 p-6 rounded-xl">
    <h3 className="text-lg font-bold mb-4">{title}</h3>
    {children}
  </div>
);

export default function TravelEditorForm({ content, setContent }) {
  const updateContent = (key, value) => setContent(prev => ({ ...prev, [key]: value }));

  const updateFaq = (index, key, value) => {
    const newFaqs = [...(content.faqItems || [
      { question: "How do I book a travel package?", answer: "Simply browse our curated offerings..." }
    ])];
    newFaqs[index] = { ...newFaqs[index], [key]: value };
    updateContent('faqItems', newFaqs);
  };

  const addFaq = () => {
    const newFaqs = [...(content.faqItems || [])];
    newFaqs.push({ question: "New Question", answer: "New Answer" });
    updateContent('faqItems', newFaqs);
  };

  const removeFaq = (index) => {
    const newFaqs = [...(content.faqItems || [])];
    newFaqs.splice(index, 1);
    updateContent('faqItems', newFaqs);
  };



  return (
    <div className="space-y-6">
      <Section title="Hero Section">
        <Input label="Hero Title" type="textarea" value={content.heroTitle} onChange={(val) => updateContent('heroTitle', val)} />
        <Input label="Scroll Indicator Text" value={content.scrollText} onChange={(val) => updateContent('scrollText', val)} />
        <ImageUpload label="Background Image" hint="1920x1080 (Landscape)" value={content.heroImage} onChange={(val) => updateContent('heroImage', val)} />
      </Section>

      <Section title="About Section">
        <Input label="Subtitle" value={content.aboutSubtitle} onChange={(val) => updateContent('aboutSubtitle', val)} />
        <Input label="Title" type="textarea" value={content.aboutTitle} onChange={(val) => updateContent('aboutTitle', val)} />
        <Input label="Paragraph Text" type="textarea" value={content.aboutText} onChange={(val) => updateContent('aboutText', val)} />
        <Input label="Quote" type="textarea" value={content.aboutQuote} onChange={(val) => updateContent('aboutQuote', val)} />
        <ImageUpload label="Side Image" hint="800x1200 (Portrait)" value={content.aboutImage} onChange={(val) => updateContent('aboutImage', val)} />
      </Section>

      <Section title="Image Divider">
        <ImageUpload label="Divider Image" hint="1920x600 (Panoramic)" value={content.dividerImage} onChange={(val) => updateContent('dividerImage', val)} />
      </Section>

      <Section title="Testimonials Header">
        <Input label="Subtitle" value={content.testimonialsSubtitle} onChange={(val) => updateContent('testimonialsSubtitle', val)} />
        <Input label="Title" value={content.testimonialsTitle} onChange={(val) => updateContent('testimonialsTitle', val)} />
      </Section>

      <Section title="FAQ Section">
        <Input label="Subtitle" value={content.faqSubtitle} onChange={(val) => updateContent('faqSubtitle', val)} />
        <Input label="Title" value={content.faqTitle} onChange={(val) => updateContent('faqTitle', val)} />
        
        <div className="mt-6">
          <h4 className="font-semibold mb-3">FAQ Items</h4>
          {(content.faqItems || []).map((faq, i) => (
            <div key={i} className="mb-4 p-4 border border-gray-200 rounded-lg relative">
              <button onClick={() => removeFaq(i)} className="absolute top-4 right-4 text-red-500 text-xs uppercase font-bold">Remove</button>
              <Input label={`Question ${i+1}`} value={faq.question} onChange={(val) => updateFaq(i, 'question', val)} />
              <Input label="Answer" type="textarea" value={faq.answer} onChange={(val) => updateFaq(i, 'answer', val)} />
            </div>
          ))}
          <button onClick={addFaq} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-bold uppercase text-xs hover:border-black hover:text-black transition-colors">
            + Add FAQ Item
          </button>
        </div>
      </Section>

      <Section title="Call To Action (CTA)">
        <Input label="Title" value={content.ctaTitle} onChange={(val) => updateContent('ctaTitle', val)} />
        <Input label="Button Text" value={content.ctaText} onChange={(val) => updateContent('ctaText', val)} />
        <Input label="Promo Text (Right Side)" value={content.ctaPromoText} type="textarea" onChange={(val) => updateContent('ctaPromoText', val)} />
        <ImageUpload label="Background Image" hint="1920x800 (Landscape)" value={content.ctaImage} onChange={(val) => updateContent('ctaImage', val)} />
      </Section>
    </div>
  );
}
