import { useState } from "react";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { uploadImageToSupabase } from '@/lib/imageUpload';

const Input = ({ label, value, onChange, type = "text" }) => (
  <div className="mb-4">
    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{label}</label>
    {type === "textarea" ? (
      <textarea rows={4} value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors" />
    ) : (
      <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors" />
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

export default function ProductsEditorForm({ products, setProducts }) {
  const [activeProductId, setActiveProductId] = useState(null);

  const addProduct = () => {
    const newProduct = {
      id: null,
      title: "New Product",
      date: "",
      description: "",
      slug: `new-product-${Date.now()}`,
      type: "retreat",
      content: {}
    };
    setProducts([...products, newProduct]);
    setActiveProductId(products.length); // use index for unsaved
  };

  const removeProduct = (index) => {
    const newProducts = [...products];
    newProducts.splice(index, 1);
    setProducts(newProducts);
    if (activeProductId === index) setActiveProductId(null);
  };

  const updateProduct = (index, key, value) => {
    const newProducts = [...products];
    newProducts[index][key] = value;
    setProducts(newProducts);
  };

  const updateContent = (index, key, value) => {
    const newProducts = [...products];
    newProducts[index].content = newProducts[index].content || {};
    newProducts[index].content[key] = value;
    setProducts(newProducts);
  };

  const addPackage = () => {
    const pkgs = products[activeProductId].content?.packages || [];
    updateContent(activeProductId, 'packages', [...pkgs, { nights: "New Package", price: "", inclusions: [] }]);
  };

  const removePackage = (idx) => {
    const pkgs = [...(products[activeProductId].content?.packages || [])];
    pkgs.splice(idx, 1);
    updateContent(activeProductId, 'packages', pkgs);
  };

  const updatePackage = (idx, key, value) => {
    const pkgs = [...(products[activeProductId].content?.packages || [])];
    pkgs[idx][key] = value;
    updateContent(activeProductId, 'packages', pkgs);
  };

  const addPackageArrayItem = (pkgIdx, key, defaultVal = "") => {
    const pkgs = [...(products[activeProductId].content?.packages || [])];
    const arr = [...(pkgs[pkgIdx][key] || [])];
    arr.push(defaultVal);
    pkgs[pkgIdx][key] = arr;
    updateContent(activeProductId, 'packages', pkgs);
  };

  const updatePackageArrayItem = (pkgIdx, key, itemIdx, value) => {
    const pkgs = [...(products[activeProductId].content?.packages || [])];
    const arr = [...(pkgs[pkgIdx][key] || [])];
    arr[itemIdx] = value;
    pkgs[pkgIdx][key] = arr;
    updateContent(activeProductId, 'packages', pkgs);
  };

  const updatePackageDateObject = (pkgIdx, key, itemIdx, field, value) => {
    const pkgs = [...(products[activeProductId].content?.packages || [])];
    const arr = [...(pkgs[pkgIdx][key] || [])];
    if (typeof arr[itemIdx] === 'string') {
      arr[itemIdx] = { title: arr[itemIdx], startDate: '', endDate: '', status: 'AVAILABLE' };
    }
    arr[itemIdx] = { ...arr[itemIdx], [field]: value };
    pkgs[pkgIdx][key] = arr;
    updateContent(activeProductId, 'packages', pkgs);
  };

  const getUIStatus = (statusStr, lang) => {
    if (!statusStr) return { type: lang === 'en' ? 'AVAILABLE' : 'DISPONIBLE', spots: '' };
    
    if (lang === 'en') {
      const match = statusStr.match(/^ONLY (\d+) SPOTS AVAILABLE$/);
      if (match) return { type: 'LIMITED_SPOTS', spots: match[1] };
    } else {
      const match = statusStr.match(/^SÓLO (\d+) PLAZAS DISPONIBLES$/);
      if (match) return { type: 'LIMITED_SPOTS', spots: match[1] };
    }
    
    return { type: statusStr, spots: '' };
  };

  const removePackageArrayItem = (pkgIdx, key, itemIdx) => {
    const pkgs = [...(products[activeProductId].content?.packages || [])];
    const arr = [...(pkgs[pkgIdx][key] || [])];
    arr.splice(itemIdx, 1);
    pkgs[pkgIdx][key] = arr;
    updateContent(activeProductId, 'packages', pkgs);
  };

  const addFaq = () => {
    const faqs = products[activeProductId].content?.faqs || [];
    updateContent(activeProductId, 'faqs', [...faqs, { question: "", answer: "" }]);
  };

  const removeFaq = (idx) => {
    const faqs = [...(products[activeProductId].content?.faqs || [])];
    faqs.splice(idx, 1);
    updateContent(activeProductId, 'faqs', faqs);
  };

  const updateFaq = (idx, key, value) => {
    const faqs = [...(products[activeProductId].content?.faqs || [])];
    faqs[idx][key] = value;
    updateContent(activeProductId, 'faqs', faqs);
  };


  return (
    <div className="flex gap-6 h-[calc(100vh-200px)]">
      {/* Sidebar List */}
      <div className="w-1/3 border-r border-gray-200 pr-4 overflow-y-auto space-y-2">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2">
          <h3 className="font-bold uppercase tracking-widest text-sm">Products</h3>
          <button onClick={addProduct} className="p-2 bg-black text-white rounded hover:bg-gray-800 transition-colors">
            <IconPlus size={16} />
          </button>
        </div>
        {products.map((prod, index) => (
          <div 
            key={prod.id || index} 
            onClick={() => setActiveProductId(index)}
            className={`p-4 rounded-lg cursor-pointer border ${activeProductId === index ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'} flex justify-between items-center`}
          >
            <div>
              <div className="font-bold text-sm">{prod.title || "Untitled"}</div>
              <div className="text-xs text-gray-500 uppercase">{prod.type}</div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); removeProduct(index); }} className="text-red-500 hover:text-red-700">
              <IconTrash size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Editor Form */}
      <div className="w-2/3 overflow-y-auto pl-2 pr-4 space-y-8">
        {activeProductId !== null && products[activeProductId] ? (
          <>
            <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm space-y-6">
              <h3 className="text-lg font-bold border-b border-gray-100 pb-4 mb-4">General Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Title (EN)" 
                  value={products[activeProductId].title} 
                  onChange={(val) => {
                    updateProduct(activeProductId, 'title', val);
                    
                    // Robust auto-generate slug
                    const newSlug = val
                      .toString()
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '') // Remove accents/diacritics
                      .toLowerCase()
                      .replace(/\s+/g, '-')            // Replace spaces with -
                      .replace(/[^\w\-]+/g, '')        // Remove all non-word chars
                      .replace(/\-\-+/g, '-')          // Replace multiple - with single -
                      .replace(/^-+/, '')              // Trim - from start of text
                      .replace(/-+$/, '');             // Trim - from end of text
                      
                    updateProduct(activeProductId, 'slug', newSlug || `new-product-${Date.now()}`);
                  }} 
                />
                <Input label="Title (ES)" value={products[activeProductId].content?.title_es} onChange={(val) => updateContent(activeProductId, 'title_es', val)} />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="mb-4">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Type</label>
                  <select 
                    value={products[activeProductId].type} 
                    onChange={(e) => {
                      if (e.target.value === 'service') {
                        const serviceCount = products.filter((p, i) => p.type === 'service' && i !== activeProductId).length;
                        if (serviceCount >= 3) {
                          alert("Maximum limit reached: You cannot have more than 3 services.");
                          return;
                        }
                      }
                      updateProduct(activeProductId, 'type', e.target.value);
                    }}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors"
                  >
                    <option value="retreat">Retreat</option>
                    <option value="service">Service</option>
                  </select>
                </div>
                {products[activeProductId].type === 'retreat' && (
                  <div className="mb-4">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Status</label>
                    <select 
                      value={products[activeProductId].content?.status || 'active'}
                      onChange={(e) => updateContent(activeProductId, 'status', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors"
                    >
                      <option value="active">Active</option>
                      <option value="coming_soon">Coming Soon</option>
                    </select>
                  </div>
                )}
                <Input label="WhatsApp Number" value={products[activeProductId].content?.whatsapp_number} onChange={(val) => updateContent(activeProductId, 'whatsapp_number', val)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Date Range (EN)" value={products[activeProductId].date} onChange={(val) => updateProduct(activeProductId, 'date', val)} />
                <Input label="Date Range (ES)" value={products[activeProductId].content?.date_es} onChange={(val) => updateContent(activeProductId, 'date_es', val)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Description (EN)" type="textarea" value={products[activeProductId].description} onChange={(val) => updateProduct(activeProductId, 'description', val)} />
                <Input label="Description (ES)" type="textarea" value={products[activeProductId].content?.description_es} onChange={(val) => updateContent(activeProductId, 'description_es', val)} />
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm space-y-6">
              <h3 className="text-lg font-bold border-b border-gray-100 pb-4 mb-4">Media & Hero</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <ImageUpload label="Hero Image" hint="1920x1080 (Landscape)" value={products[activeProductId].content?.hero_image} onChange={(val) => updateContent(activeProductId, 'hero_image', val)} />
                <ImageUpload label="Cover Image (Gallery)" hint="600x800 (Portrait)" value={products[activeProductId].content?.cover_image} onChange={(val) => updateContent(activeProductId, 'cover_image', val)} />
                <ImageUpload label="Overview Image" hint="800x600 (Landscape)" value={products[activeProductId].content?.overview_image} onChange={(val) => updateContent(activeProductId, 'overview_image', val)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Book Button Text (EN)" value={products[activeProductId].content?.hero_book_button} onChange={(val) => updateContent(activeProductId, 'hero_book_button', val)} />
                <Input label="Book Button Text (ES)" value={products[activeProductId].content?.hero_book_button_es} onChange={(val) => updateContent(activeProductId, 'hero_book_button_es', val)} />
              </div>
            </div>

            {products[activeProductId].content?.status !== 'coming_soon' && (
              <>
                <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm space-y-6">
              <h3 className="text-lg font-bold border-b border-gray-100 pb-4 mb-4">Overview Section</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Overview Content (EN)" type="textarea" value={products[activeProductId].content?.overview} onChange={(val) => updateContent(activeProductId, 'overview', val)} />
                <Input label="Overview Content (ES)" type="textarea" value={products[activeProductId].content?.overview_es} onChange={(val) => updateContent(activeProductId, 'overview_es', val)} />
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                <h3 className="text-lg font-bold">Itinerary & Pricing Packages</h3>
                <button onClick={addPackage} className="text-xs bg-black text-white px-3 py-1.5 rounded-full hover:bg-gray-800 transition-colors uppercase tracking-widest font-bold flex items-center gap-1">
                  <IconPlus size={14} /> Add Package
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Pricing Title (EN)" value={products[activeProductId].content?.pricing_title} onChange={(val) => updateContent(activeProductId, 'pricing_title', val)} />
                <Input label="Pricing Title (ES)" value={products[activeProductId].content?.pricing_title_es} onChange={(val) => updateContent(activeProductId, 'pricing_title_es', val)} />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <Input label="Pricing Subtitle (EN)" value={products[activeProductId].content?.pricing_subtitle} onChange={(val) => updateContent(activeProductId, 'pricing_subtitle', val)} />
                <Input label="Pricing Subtitle (ES)" value={products[activeProductId].content?.pricing_subtitle_es} onChange={(val) => updateContent(activeProductId, 'pricing_subtitle_es', val)} />
              </div>

              <div className="space-y-6">
                {(products[activeProductId].content?.packages || []).map((pkg, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-5 bg-gray-50 relative">
                    <button 
                      onClick={() => removePackage(idx)} 
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove Package"
                    >
                      <IconTrash size={18} />
                    </button>
                    
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Package {idx + 1}</h4>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <Input label="Duration Title (EN) (e.g. 5 NIGHTS)" value={pkg.nights} onChange={(val) => updatePackage(idx, 'nights', val)} />
                      <Input label="Duration Title (ES) (e.g. 5 NOCHES)" value={pkg.nights_es} onChange={(val) => updatePackage(idx, 'nights_es', val)} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <Input label="Price (EN) (e.g. Rp 10.000.000)" value={pkg.price} onChange={(val) => updatePackage(idx, 'price', val)} />
                      <Input label="Price (ES)" value={pkg.price_es} onChange={(val) => updatePackage(idx, 'price_es', val)} />
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                      {/* Dates EN */}
                      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">Available Dates (EN)</label>
                          <button onClick={() => addPackageArrayItem(idx, 'dates', { title: '', range: '', status: 'AVAILABLE' })} className="text-[10px] bg-black text-white px-2 py-1 rounded hover:bg-gray-800 uppercase tracking-widest font-bold">
                            + Add Date
                          </button>
                        </div>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                          {(pkg.dates || []).map((dateItem, dateIdx) => {
                            const currentStatus = typeof dateItem === 'string' ? 'AVAILABLE' : (dateItem.status || 'AVAILABLE');
                            const uiStatus = getUIStatus(currentStatus, 'en');
                            
                            return (
                              <div key={dateIdx} className="flex flex-col gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg relative group">
                                <button onClick={() => removePackageArrayItem(idx, 'dates', dateIdx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><IconTrash size={14} /></button>
                                <div className="pr-6">
                                  <input type="text" placeholder="Title (e.g. Easter Retreat 2027)" value={typeof dateItem === 'string' ? dateItem : (dateItem.title || '')} onChange={(e) => updatePackageDateObject(idx, 'dates', dateIdx, 'title', e.target.value)} className="w-full text-sm border-b border-gray-200 bg-transparent py-1 mb-2 focus:outline-none focus:border-black" />
                                  <div className="flex gap-2 mb-2">
                                    <div className="flex-1">
                                      <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 block">Start Date</label>
                                      <input type="date" value={typeof dateItem === 'string' ? '' : (dateItem.startDate || '')} onChange={(e) => updatePackageDateObject(idx, 'dates', dateIdx, 'startDate', e.target.value)} className="w-full text-xs p-1.5 border border-gray-200 rounded focus:outline-none focus:border-black text-gray-700" />
                                    </div>
                                    <div className="flex-1">
                                      <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 block">End Date</label>
                                      <input type="date" value={typeof dateItem === 'string' ? '' : (dateItem.endDate || '')} onChange={(e) => updatePackageDateObject(idx, 'dates', dateIdx, 'endDate', e.target.value)} className="w-full text-xs p-1.5 border border-gray-200 rounded focus:outline-none focus:border-black text-gray-700" />
                                    </div>
                                  </div>
                                  <div className="flex gap-2 items-center">
                                    <select 
                                      value={uiStatus.type} 
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === 'LIMITED_SPOTS') {
                                          updatePackageDateObject(idx, 'dates', dateIdx, 'status', `ONLY 4 SPOTS AVAILABLE`);
                                        } else {
                                          updatePackageDateObject(idx, 'dates', dateIdx, 'status', val);
                                        }
                                      }} 
                                      className="w-full text-xs p-1.5 border border-gray-200 rounded focus:outline-none"
                                    >
                                      <option value="AVAILABLE">Available</option>
                                      <option value="SPOTS AVAILABLE">Spots Available</option>
                                      <option value="LIMITED_SPOTS">Limited Spots...</option>
                                      <option value="PRIVATE GROUP">Private Group</option>
                                      <option value="FULLY BOOKED">Fully Booked</option>
                                    </select>
                                    {uiStatus.type === 'LIMITED_SPOTS' && (
                                      <div className="flex items-center gap-1">
                                        <input 
                                          type="number" 
                                          min="1" 
                                          className="w-16 text-xs p-1.5 border border-gray-200 rounded focus:outline-none text-center" 
                                          value={uiStatus.spots}
                                          onChange={(e) => updatePackageDateObject(idx, 'dates', dateIdx, 'status', `ONLY ${e.target.value} SPOTS AVAILABLE`)}
                                        />
                                        <span className="text-[10px] text-gray-500 font-bold">SPOTS</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          {(!pkg.dates || pkg.dates.length === 0) && <p className="text-xs text-gray-400 italic text-center py-2">No dates added yet.</p>}
                        </div>
                      </div>

                      {/* Dates ES */}
                      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">Available Dates (ES)</label>
                          <button onClick={() => addPackageArrayItem(idx, 'dates_es', { title: '', range: '', status: 'DISPONIBLE' })} className="text-[10px] bg-black text-white px-2 py-1 rounded hover:bg-gray-800 uppercase tracking-widest font-bold">
                            + Add Date
                          </button>
                        </div>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                          {(pkg.dates_es || []).map((dateItem, dateIdx) => {
                            const currentStatus = typeof dateItem === 'string' ? 'DISPONIBLE' : (dateItem.status || 'DISPONIBLE');
                            const uiStatus = getUIStatus(currentStatus, 'es');
                            
                            return (
                              <div key={dateIdx} className="flex flex-col gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg relative group">
                                <button onClick={() => removePackageArrayItem(idx, 'dates_es', dateIdx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><IconTrash size={14} /></button>
                                <div className="pr-6">
                                  <input type="text" placeholder="Title (e.g. Semana Santa 2027)" value={typeof dateItem === 'string' ? dateItem : (dateItem.title || '')} onChange={(e) => updatePackageDateObject(idx, 'dates_es', dateIdx, 'title', e.target.value)} className="w-full text-sm border-b border-gray-200 bg-transparent py-1 mb-2 focus:outline-none focus:border-black" />
                                  <div className="flex gap-2 mb-2">
                                    <div className="flex-1">
                                      <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 block">Start Date</label>
                                      <input type="date" value={typeof dateItem === 'string' ? '' : (dateItem.startDate || '')} onChange={(e) => updatePackageDateObject(idx, 'dates_es', dateIdx, 'startDate', e.target.value)} className="w-full text-xs p-1.5 border border-gray-200 rounded focus:outline-none focus:border-black text-gray-700" />
                                    </div>
                                    <div className="flex-1">
                                      <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 block">End Date</label>
                                      <input type="date" value={typeof dateItem === 'string' ? '' : (dateItem.endDate || '')} onChange={(e) => updatePackageDateObject(idx, 'dates_es', dateIdx, 'endDate', e.target.value)} className="w-full text-xs p-1.5 border border-gray-200 rounded focus:outline-none focus:border-black text-gray-700" />
                                    </div>
                                  </div>
                                  <div className="flex gap-2 items-center">
                                    <select 
                                      value={uiStatus.type} 
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === 'LIMITED_SPOTS') {
                                          updatePackageDateObject(idx, 'dates_es', dateIdx, 'status', `SÓLO 4 PLAZAS DISPONIBLES`);
                                        } else {
                                          updatePackageDateObject(idx, 'dates_es', dateIdx, 'status', val);
                                        }
                                      }} 
                                      className="w-full text-xs p-1.5 border border-gray-200 rounded focus:outline-none"
                                    >
                                      <option value="DISPONIBLE">Disponible</option>
                                      <option value="PLAZAS DISPONIBLES">Plazas Disponibles</option>
                                      <option value="LIMITED_SPOTS">Plazas Limitadas...</option>
                                      <option value="GRUPO PRIVADO">Grupo Privado</option>
                                      <option value="COMPLETO">Completo</option>
                                    </select>
                                    {uiStatus.type === 'LIMITED_SPOTS' && (
                                      <div className="flex items-center gap-1">
                                        <input 
                                          type="number" 
                                          min="1" 
                                          className="w-16 text-xs p-1.5 border border-gray-200 rounded focus:outline-none text-center" 
                                          value={uiStatus.spots}
                                          onChange={(e) => updatePackageDateObject(idx, 'dates_es', dateIdx, 'status', `SÓLO ${e.target.value} PLAZAS DISPONIBLES`)}
                                        />
                                        <span className="text-[10px] text-gray-500 font-bold">PLAZAS</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          {(!pkg.dates_es || pkg.dates_es.length === 0) && <p className="text-xs text-gray-400 italic text-center py-2">No dates added yet.</p>}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                      {/* Rooms EN */}
                      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">Room Options (EN)</label>
                          <button onClick={() => addPackageArrayItem(idx, 'rooms', '')} className="text-[10px] bg-black text-white px-2 py-1 rounded hover:bg-gray-800 uppercase tracking-widest font-bold">
                            + Add Room
                          </button>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                          {(pkg.rooms || []).map((room, roomIdx) => (
                            <div key={roomIdx} className="flex items-center gap-2">
                              <input type="text" value={room} onChange={(e) => updatePackageArrayItem(idx, 'rooms', roomIdx, e.target.value)} placeholder="e.g. Room: Private double room..." className="flex-1 text-sm p-2 border border-gray-200 rounded focus:outline-none focus:border-black" />
                              <button onClick={() => removePackageArrayItem(idx, 'rooms', roomIdx)} className="text-gray-400 hover:text-red-500 p-2"><IconTrash size={16} /></button>
                            </div>
                          ))}
                          {(!pkg.rooms || pkg.rooms.length === 0) && <p className="text-xs text-gray-400 italic text-center py-2">No rooms added yet.</p>}
                        </div>
                      </div>

                      {/* Rooms ES */}
                      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">Room Options (ES)</label>
                          <button onClick={() => addPackageArrayItem(idx, 'rooms_es', '')} className="text-[10px] bg-black text-white px-2 py-1 rounded hover:bg-gray-800 uppercase tracking-widest font-bold">
                            + Add Room
                          </button>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                          {(pkg.rooms_es || []).map((room, roomIdx) => (
                            <div key={roomIdx} className="flex items-center gap-2">
                              <input type="text" value={room} onChange={(e) => updatePackageArrayItem(idx, 'rooms_es', roomIdx, e.target.value)} placeholder="e.g. Habitación: Privada doble..." className="flex-1 text-sm p-2 border border-gray-200 rounded focus:outline-none focus:border-black" />
                              <button onClick={() => removePackageArrayItem(idx, 'rooms_es', roomIdx)} className="text-gray-400 hover:text-red-500 p-2"><IconTrash size={16} /></button>
                            </div>
                          ))}
                          {(!pkg.rooms_es || pkg.rooms_es.length === 0) && <p className="text-xs text-gray-400 italic text-center py-2">No rooms added yet.</p>}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {/* Inclusions EN */}
                      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">Included Items (EN)</label>
                          <button onClick={() => addPackageArrayItem(idx, 'inclusions', '')} className="text-[10px] bg-black text-white px-2 py-1 rounded hover:bg-gray-800 uppercase tracking-widest font-bold">
                            + Add Item
                          </button>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                          {(pkg.inclusions || []).map((inc, incIdx) => (
                            <div key={incIdx} className="flex items-start gap-2">
                              <textarea rows={2} value={inc} onChange={(e) => updatePackageArrayItem(idx, 'inclusions', incIdx, e.target.value)} placeholder="e.g. Daily morning yoga classes" className="flex-1 text-sm p-2 border border-gray-200 rounded focus:outline-none focus:border-black" />
                              <button onClick={() => removePackageArrayItem(idx, 'inclusions', incIdx)} className="text-gray-400 hover:text-red-500 p-2 mt-1"><IconTrash size={16} /></button>
                            </div>
                          ))}
                          {(!pkg.inclusions || pkg.inclusions.length === 0) && <p className="text-xs text-gray-400 italic text-center py-2">No inclusions added yet.</p>}
                        </div>
                      </div>

                      {/* Inclusions ES */}
                      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">Included Items (ES)</label>
                          <button onClick={() => addPackageArrayItem(idx, 'inclusions_es', '')} className="text-[10px] bg-black text-white px-2 py-1 rounded hover:bg-gray-800 uppercase tracking-widest font-bold">
                            + Add Item
                          </button>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                          {(pkg.inclusions_es || []).map((inc, incIdx) => (
                            <div key={incIdx} className="flex items-start gap-2">
                              <textarea rows={2} value={inc} onChange={(e) => updatePackageArrayItem(idx, 'inclusions_es', incIdx, e.target.value)} placeholder="e.g. Clases diarias de yoga" className="flex-1 text-sm p-2 border border-gray-200 rounded focus:outline-none focus:border-black" />
                              <button onClick={() => removePackageArrayItem(idx, 'inclusions_es', incIdx)} className="text-gray-400 hover:text-red-500 p-2 mt-1"><IconTrash size={16} /></button>
                            </div>
                          ))}
                          {(!pkg.inclusions_es || pkg.inclusions_es.length === 0) && <p className="text-xs text-gray-400 italic text-center py-2">No inclusions added yet.</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!products[activeProductId].content?.packages || products[activeProductId].content.packages.length === 0) && (
                  <div className="text-center text-sm text-gray-400 italic py-4 border-2 border-dashed border-gray-200 rounded-lg">
                    No packages added yet. Click "Add Package" to create one.
                  </div>
                )}
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm space-y-6">
              <h3 className="text-lg font-bold border-b border-gray-100 pb-4 mb-4">Location Section</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Location Title (EN)" value={products[activeProductId].content?.location_title} onChange={(val) => updateContent(activeProductId, 'location_title', val)} />
                <Input label="Location Title (ES)" value={products[activeProductId].content?.location_title_es} onChange={(val) => updateContent(activeProductId, 'location_title_es', val)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Location Description (EN)" type="textarea" value={products[activeProductId].content?.location_text} onChange={(val) => updateContent(activeProductId, 'location_text', val)} />
                <Input label="Location Description (ES)" type="textarea" value={products[activeProductId].content?.location_text_es} onChange={(val) => updateContent(activeProductId, 'location_text_es', val)} />
              </div>
              <div className="space-y-4">
                {[0, 1, 2].map((i) => (
                  <ImageUpload 
                    key={i} 
                    label={`Location Image ${i+1}`} 
                    hint="600x800 (Portrait)" 
                    value={(products[activeProductId].content?.location_images || [])[i]} 
                    onChange={(val) => {
                      const newImages = [...(products[activeProductId].content?.location_images || [])];
                      newImages[i] = val;
                      updateContent(activeProductId, 'location_images', newImages);
                    }} 
                  />
                ))}
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                <h3 className="text-lg font-bold">Frequently Asked Questions</h3>
                <button onClick={addFaq} className="text-xs bg-black text-white px-3 py-1.5 rounded-full hover:bg-gray-800 transition-colors uppercase tracking-widest font-bold flex items-center gap-1">
                  <IconPlus size={14} /> Add FAQ
                </button>
              </div>

              <div className="space-y-6">
                {(products[activeProductId].content?.faqs || []).map((faq, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-5 bg-gray-50 relative">
                    <button 
                      onClick={() => removeFaq(idx)} 
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove FAQ"
                    >
                      <IconTrash size={18} />
                    </button>
                    
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-4">FAQ {idx + 1}</h4>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <Input label="Question (EN)" value={faq.question} onChange={(val) => updateFaq(idx, 'question', val)} />
                      <Input label="Question (ES)" value={faq.question_es} onChange={(val) => updateFaq(idx, 'question_es', val)} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Answer (EN)" type="textarea" value={faq.answer} onChange={(val) => updateFaq(idx, 'answer', val)} />
                      <Input label="Answer (ES)" type="textarea" value={faq.answer_es} onChange={(val) => updateFaq(idx, 'answer_es', val)} />
                    </div>
                  </div>
                ))}
                
                {(!products[activeProductId].content?.faqs || products[activeProductId].content.faqs.length === 0) && (
                  <div className="text-center text-sm text-gray-400 italic py-4 border-2 border-dashed border-gray-200 rounded-lg">
                    No FAQs added yet. Leave blank to use default site FAQs, or click "Add FAQ" to create custom ones.
                  </div>
                )}
              </div>
            </div>
            </>
          )}
          </>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
            Select a product from the sidebar to edit.
          </div>
        )}
      </div>
    </div>
  );
}
