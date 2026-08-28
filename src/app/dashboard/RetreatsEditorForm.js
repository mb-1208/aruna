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

const Section = ({ title, children }) => (
  <div className="mb-8 border border-gray-200 p-6 rounded-xl">
    <h3 className="text-lg font-bold mb-4">{title}</h3>
    {children}
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

export default function RetreatsEditorForm({ content, setContent }) {
  const updateContent = (key, value) => setContent(prev => ({ ...prev, [key]: value }));
  
  const updateMosaic = (index, value) => {
    const newMosaic = [...(content.mosaicImages || [
      "https://placehold.co/800x800.png", "https://placehold.co/800x800.png", 
      "https://placehold.co/800x800.png", "https://placehold.co/800x800.png", 
      "https://placehold.co/800x800.png", "https://placehold.co/800x800.png"
    ])];
    newMosaic[index] = value;
    updateContent('mosaicImages', newMosaic);
  };

  const updateFaq = (index, key, value) => {
    const newFaqs = [...(content.faqItems || [
      { question: "How are accommodations assigned?", answer: "Accommodations are assigned based on the room type you select..." }
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
        <Input label="Scroll Down Text" value={content.scrollText} onChange={(val) => updateContent('scrollText', val)} />
        <ImageUpload label="Background Image" hint="1920x1080 (Landscape)" value={content.heroImage} onChange={(val) => updateContent('heroImage', val)} />
      </Section>

      <Section title="Introduction Section">
        <Input label="Subtitle" value={content.introSubtitle} onChange={(val) => updateContent('introSubtitle', val)} />
        <Input label="Title" type="textarea" value={content.introTitle} onChange={(val) => updateContent('introTitle', val)} />
        <Input label="Button Text" value={content.introButtonText} onChange={(val) => updateContent('introButtonText', val)} />
        <Input label="Modal Title" value={content.introModalTitle} onChange={(val) => updateContent('introModalTitle', val)} />
        <Input label="Modal Text" type="textarea" value={content.introModalText} onChange={(val) => updateContent('introModalText', val)} />
      </Section>

      <Section title="About Section">
        <Input label="Subtitle" value={content.aboutSubtitle} onChange={(val) => updateContent('aboutSubtitle', val)} />
        <Input label="Title" type="textarea" value={content.aboutTitle} onChange={(val) => updateContent('aboutTitle', val)} />
        <Input label="Description" type="textarea" value={content.aboutText} onChange={(val) => updateContent('aboutText', val)} />
        <Input label="Quote Text" type="textarea" value={content.aboutQuote} onChange={(val) => updateContent('aboutQuote', val)} />
        <ImageUpload label="About Image" hint="800x1200 (Portrait)" value={content.aboutImage} onChange={(val) => updateContent('aboutImage', val)} />
      </Section>

      <Section title="The Experience (Destinations) Header">
        <Input label="Subtitle" value={content.experienceSubtitle} onChange={(val) => updateContent('experienceSubtitle', val)} />
        <Input label="Title" value={content.experienceTitle} onChange={(val) => updateContent('experienceTitle', val)} />
      </Section>

      <Section title="Image Divider">
        <ImageUpload label="Divider Image" hint="1920x600 (Panoramic)" value={content.dividerImage1} onChange={(val) => updateContent('dividerImage1', val)} />
      </Section>

      <Section title="Testimonial Quote Header">
        <Input label="Subtitle" value={content.quoteSubtitle} onChange={(val) => updateContent('quoteSubtitle', val)} />
        <Input label="Title" type="textarea" value={content.quoteTitle} onChange={(val) => updateContent('quoteTitle', val)} />
      </Section>

      <Section title="Photo Mosaic Gallery">
        <Input label="Mosaic Title" value={content.mosaicTitle} onChange={(val) => updateContent('mosaicTitle', val)} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ImageUpload key={i} label={`Image ${i+1}`} hint="800x800 (Square)" value={(content.mosaicImages || [])[i]} onChange={(val) => updateMosaic(i, val)} />
        ))}
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
        <Input label="Box Title" value={content.ctaBoxTitle} onChange={(val) => updateContent('ctaBoxTitle', val)} />
        <Input label="Box Description" value={content.ctaText} type="textarea" onChange={(val) => updateContent('ctaText', val)} />
        <Input label="Email Input Label" value={content.ctaEmailLabel} onChange={(val) => updateContent('ctaEmailLabel', val)} />
        <Input label="Submit Button Text" value={content.ctaButtonText} onChange={(val) => updateContent('ctaButtonText', val)} />
        <ImageUpload label="Background Image" hint="1920x800 (Landscape)" value={content.ctaImage} onChange={(val) => updateContent('ctaImage', val)} />
      </Section>
    </div>
  );
}
