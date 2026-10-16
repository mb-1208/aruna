import { useState } from "react";
import { 
  IconTrash, 
  IconPlus, 
  IconPhoto, 
  IconCalendar, 
  IconCheck, 
  IconX, 
  IconUpload, 
  IconInfoCircle,
  IconLanguage,
  IconAlertCircle,
  IconFileText,
  IconBed,
  IconListCheck,
  IconHelp
} from "@tabler/icons-react";
import { uploadImageToSupabase } from "@/lib/imageUpload";
import { deleteProduct as deleteProductAction } from "@/app/dashboard/actions";

function formatPreviewDate(startDate, endDate, lang = 'en') {
  if (!startDate || !endDate) return null;
  try {
    const [sYear, sMonth, sDay] = startDate.split('-');
    const [eYear, eMonth, eDay] = endDate.split('-');
    const start = new Date(sYear, sMonth - 1, sDay);
    const end = new Date(eYear, eMonth - 1, eDay);

    const sMonthStr = start.toLocaleString(lang === 'es' ? 'es-ES' : 'en-US', { month: 'long' });
    const eMonthStr = end.toLocaleString(lang === 'es' ? 'es-ES' : 'en-US', { month: 'long' });
    const sDayNum = start.getDate();
    const eDayNum = end.getDate();

    if (lang === 'es') {
      if (start.getMonth() === end.getMonth()) {
        return `Del ${sDayNum} al ${eDayNum} de ${sMonthStr.toLowerCase()}`;
      }
      return `Del ${sDayNum} de ${sMonthStr.toLowerCase()} al ${eDayNum} de ${eMonthStr.toLowerCase()}`;
    }

    const getOrdinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    if (start.getMonth() === end.getMonth()) {
      return `${sMonthStr} ${getOrdinal(sDayNum)} - ${getOrdinal(eDayNum)}`;
    }
    return `${sMonthStr} ${getOrdinal(sDayNum)} - ${eMonthStr} ${getOrdinal(eDayNum)}`;
  } catch {
    return null;
  }
}

const FormField = ({ label, helper, children }) => (
  <div className="space-y-1.5">
    <div className="flex items-baseline justify-between">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">{label}</label>
      {helper && <span className="text-[11px] text-gray-400 font-normal">{helper}</span>}
    </div>
    {children}
  </div>
);

const MediaUploadCard = ({ label, placementHint, value, onChange, aspectRatio = "landscape" }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setErrorMsg("");
      const publicUrl = await uploadImageToSupabase(file);
      onChange(publicUrl);
    } catch (err) {
      setErrorMsg("Failed to upload image. Please try again.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const aspectClass = 
    aspectRatio === "portrait" ? "aspect-[3/4]" :
    aspectRatio === "square" ? "aspect-square" : "aspect-[16/9]";

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">{label}</h4>
          {placementHint && (
            <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{placementHint}</p>
          )}
        </div>
        {value && (
          <button 
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
            title="Remove image"
          >
            Remove
          </button>
        )}
      </div>

      <div className={`relative w-full ${aspectClass} rounded-lg overflow-hidden bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center group`}>
        {value ? (
          <>
            <img src={value} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
              <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider shadow-md hover:bg-gray-100 transition-colors">
                Replace Photo
                <input 
                  type="file" 
                  accept="image/*" 
                  disabled={isUploading} 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
            </div>
          </>
        ) : (
          <label className="cursor-pointer flex flex-col items-center justify-center p-6 text-center w-full h-full hover:bg-gray-100 transition-colors">
            <IconPhoto size={32} className="text-gray-400 mb-2 stroke-1" />
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Upload Photo</span>
            <span className="text-[11px] text-gray-400 mt-1">PNG, JPG, or WebP up to 10MB</span>
            <input 
              type="file" 
              accept="image/*" 
              disabled={isUploading} 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </label>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mb-2" />
            <span className="text-xs font-medium text-gray-700">Compressing & Uploading...</span>
          </div>
        )}
      </div>

      {errorMsg && <p className="text-xs text-red-600 font-medium">{errorMsg}</p>}
    </div>
  );
};

export default function ProductsEditorForm({ products, setProducts }) {
  const [activeProductId, setActiveProductId] = useState(0);
  const [productTab, setProductTab] = useState("overview");
  const [langMode, setLangMode] = useState("split");
  const [deleteModalIndex, setDeleteModalIndex] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const activeProduct = products[activeProductId] || null;

  const addProduct = () => {
    const newProduct = {
      id: null,
      title: "New Retreat Experience",
      date: "Multiple Dates Available",
      description: "",
      slug: `retreat-${Date.now()}`,
      type: "retreat",
      content: {
        status: "active",
        title_es: "",
        date_es: "Múltiples Fechas Disponibles",
        description_es: "",
        hero_book_button: "Inquire Availability",
        hero_book_button_es: "Consultar Disponibilidad",
        overview_title: "Overview",
        overview_title_es: "Descripción general",
        overview: "",
        overview_es: "",
        location_title: "The Sanctuary",
        location_title_es: "El Santuario",
        location_text: "",
        location_text_es: "",
        location_images: ["", "", ""],
        pricing_title: "Packages & Dates",
        pricing_title_es: "Paquetes y Fechas",
        pricing_subtitle: "Select your stay",
        pricing_subtitle_es: "Elige tu estancia",
        packages: [
          {
            nights: "7 Nights",
            nights_es: "7 Noches",
            price: "",
            price_es: "",
            dates: [],
            dates_es: [],
            rooms: [],
            rooms_es: [],
            inclusions: [],
            inclusions_es: []
          }
        ],
        faqs: []
      }
    };
    setProducts([...products, newProduct]);
    setActiveProductId(products.length);
    setProductTab("overview");
  };

  const confirmDeleteProduct = async () => {
    if (deleteModalIndex === null) return;
    const prod = products[deleteModalIndex];

    try {
      setIsDeleting(true);
      if (prod.id) {
        await deleteProductAction(prod.id);
      }
      const updated = [...products];
      updated.splice(deleteModalIndex, 1);
      setProducts(updated);
      setActiveProductId(prev => (prev >= updated.length ? Math.max(0, updated.length - 1) : prev));
      setDeleteModalIndex(null);
    } catch (err) {
      alert("Error deleting product: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const updateProduct = (key, value) => {
    if (activeProductId === null || !products[activeProductId]) return;
    const newProducts = [...products];
    newProducts[activeProductId][key] = value;
    setProducts(newProducts);
  };

  const updateContent = (key, value) => {
    if (activeProductId === null || !products[activeProductId]) return;
    const newProducts = [...products];
    newProducts[activeProductId].content = newProducts[activeProductId].content || {};
    newProducts[activeProductId].content[key] = value;
    setProducts(newProducts);
  };

  const packages = activeProduct?.content?.packages || [];

  const updatePackage = (pkgIdx, key, value) => {
    const updated = [...packages];
    updated[pkgIdx] = { ...updated[pkgIdx], [key]: value };
    updateContent("packages", updated);
  };

  const addPackage = () => {
    const newPkg = {
      nights: "New Package",
      nights_es: "Nuevo Paquete",
      price: "",
      price_es: "",
      dates: [],
      dates_es: [],
      rooms: [],
      rooms_es: [],
      inclusions: [],
      inclusions_es: []
    };
    updateContent("packages", [...packages, newPkg]);
  };

  const removePackage = (pkgIdx) => {
    const updated = [...packages];
    updated.splice(pkgIdx, 1);
    updateContent("packages", updated);
  };

  const addDateToPackage = (pkgIdx, lang = 'en') => {
    const updated = [...packages];
    const key = lang === 'en' ? 'dates' : 'dates_es';
    const currentList = [...(updated[pkgIdx][key] || [])];
    const defaultStatus = lang === 'en' ? 'AVAILABLE' : 'DISPONIBLE';
    
    currentList.push({
      title: "",
      startDate: "",
      endDate: "",
      status: defaultStatus
    });
    
    updated[pkgIdx] = { ...updated[pkgIdx], [key]: currentList };
    updateContent("packages", updated);
  };

  const updateDateInPackage = (pkgIdx, lang, dateIdx, field, value) => {
    const updated = [...packages];
    const key = lang === 'en' ? 'dates' : 'dates_es';
    const currentList = [...(updated[pkgIdx][key] || [])];
    
    const existing = typeof currentList[dateIdx] === 'string' 
      ? { title: currentList[dateIdx], startDate: "", endDate: "", status: lang === 'en' ? 'AVAILABLE' : 'DISPONIBLE' }
      : { ...currentList[dateIdx] };

    existing[field] = value;
    currentList[dateIdx] = existing;
    updated[pkgIdx] = { ...updated[pkgIdx], [key]: currentList };
    updateContent("packages", updated);
  };

  const removeDateFromPackage = (pkgIdx, lang, dateIdx) => {
    const updated = [...packages];
    const key = lang === 'en' ? 'dates' : 'dates_es';
    const currentList = [...(updated[pkgIdx][key] || [])];
    currentList.splice(dateIdx, 1);
    updated[pkgIdx] = { ...updated[pkgIdx], [key]: currentList };
    updateContent("packages", updated);
  };

  const updateLocationImage = (index, url) => {
    const current = [...(activeProduct.content?.location_images || ["", "", ""])];
    current[index] = url;
    updateContent("location_images", current);
  };

  const addPackageItem = (pkgIdx, key, defaultVal = "") => {
    const updated = [...packages];
    const list = [...(updated[pkgIdx][key] || [])];
    list.push(defaultVal);
    updated[pkgIdx] = { ...updated[pkgIdx], [key]: list };
    updateContent("packages", updated);
  };

  const updatePackageItem = (pkgIdx, key, itemIdx, value) => {
    const updated = [...packages];
    const list = [...(updated[pkgIdx][key] || [])];
    list[itemIdx] = value;
    updated[pkgIdx] = { ...updated[pkgIdx], [key]: list };
    updateContent("packages", updated);
  };

  const removePackageItem = (pkgIdx, key, itemIdx) => {
    const updated = [...packages];
    const list = [...(updated[pkgIdx][key] || [])];
    list.splice(itemIdx, 1);
    updated[pkgIdx] = { ...updated[pkgIdx], [key]: list };
    updateContent("packages", updated);
  };

  const faqs = activeProduct?.content?.faqs || [];

  const addFaq = () => {
    updateContent("faqs", [...faqs, { question: "", question_es: "", answer: "", answer_es: "" }]);
  };

  const updateFaq = (idx, field, val) => {
    const updated = [...faqs];
    updated[idx] = { ...updated[idx], [field]: val };
    updateContent("faqs", updated);
  };

  const removeFaq = (idx) => {
    const updated = [...faqs];
    updated.splice(idx, 1);
    updateContent("faqs", updated);
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-170px)]">
      {/* Left Product Catalog List */}
      <div className="w-80 shrink-0 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">Product Catalog</h3>
            <span className="text-[11px] text-gray-500">{products.length} published products</span>
          </div>
          <button 
            type="button"
            onClick={addProduct} 
            className="flex items-center gap-1.5 bg-black text-white px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors shadow-sm"
          >
            <IconPlus size={14} /> New
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {products.map((prod, index) => {
            const isSelected = activeProductId === index;
            const isRetreat = prod.type === 'retreat';

            return (
              <div 
                key={prod.id || index}
                onClick={() => setActiveProductId(index)}
                className={`p-3.5 rounded-lg cursor-pointer border transition-all relative group flex flex-col gap-1.5 ${
                  isSelected 
                    ? 'border-black bg-gray-50/80 shadow-xs' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-sm text-gray-900 leading-snug line-clamp-2">
                    {prod.title || "Untitled Product"}
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteModalIndex(index);
                    }}
                    className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
                    title="Delete product"
                  >
                    <IconTrash size={15} />
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    isRetreat ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-blue-50 text-blue-800 border border-blue-200'
                  }`}>
                    {prod.type}
                  </span>
                  {prod.content?.status === 'coming_soon' && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                      Coming Soon
                    </span>
                  )}
                  {prod.date && (
                    <span className="text-[11px] text-gray-500 truncate max-w-[120px]">
                      {prod.date}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Product Editor */}
      <div className="flex-1 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
        {activeProduct ? (
          <>
            {/* Header: Title & Language Mode */}
            <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 bg-gray-50/60">
              <div className="min-w-0">
                <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400 block mb-0.5">
                  Editing {activeProduct.type === 'retreat' ? 'Retreat Experience' : 'Bespoke Travel Service'}
                </span>
                <h2 className="text-lg font-bold text-gray-900 truncate">
                  {activeProduct.title || "Untitled Experience"}
                </h2>
              </div>

              {/* Language Switcher Bar */}
              <div className="flex items-center gap-1 bg-gray-200/70 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setLangMode("split")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    langMode === 'split' ? 'bg-white text-black shadow-xs font-bold' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Side-by-Side (EN & ES)
                </button>
                <button
                  type="button"
                  onClick={() => setLangMode("en")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    langMode === 'en' ? 'bg-white text-black shadow-xs font-bold' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  English Only
                </button>
                <button
                  type="button"
                  onClick={() => setLangMode("es")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    langMode === 'es' ? 'bg-white text-black shadow-xs font-bold' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Español Only
                </button>
              </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="flex border-b border-gray-200 px-6 gap-2 bg-white overflow-x-auto text-xs uppercase tracking-wider font-semibold">
              <button
                type="button"
                onClick={() => setProductTab("overview")}
                className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-2 ${
                  productTab === 'overview' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'
                }`}
              >
                <IconFileText size={16} /> Details & Copy
              </button>
              <button
                type="button"
                onClick={() => setProductTab("media")}
                className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-2 ${
                  productTab === 'media' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'
                }`}
              >
                <IconPhoto size={16} /> Photos & Gallery
              </button>

              {activeProduct.type === 'retreat' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setProductTab("dates")}
                    className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-2 ${
                      productTab === 'dates' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'
                    }`}
                  >
                    <IconCalendar size={16} /> Dates & Availability
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductTab("packages")}
                    className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-2 ${
                      productTab === 'packages' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'
                    }`}
                  >
                    <IconBed size={16} /> Packages & Inclusions
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setProductTab("service_steps")}
                  className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-2 ${
                    productTab === 'service_steps' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'
                  }`}
                >
                  <IconListCheck size={16} /> Service Workflow
                </button>
              )}

              <button
                type="button"
                onClick={() => setProductTab("faq")}
                className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-2 ${
                  productTab === 'faq' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'
                }`}
              >
                <IconHelp size={16} /> FAQs & Location
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* TAB 1: DETAILS & COPY */}
              {productTab === "overview" && (
                <div className="space-y-6 max-w-4xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <FormField label="Product Type">
                      <select 
                        value={activeProduct.type} 
                        onChange={(e) => updateProduct('type', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:border-black font-medium"
                      >
                        <option value="retreat">Retreat Package</option>
                        <option value="service">Bespoke Travel Service</option>
                      </select>
                    </FormField>

                    {activeProduct.type === 'retreat' && (
                      <FormField label="Status Visibility">
                        <select 
                          value={activeProduct.content?.status || 'active'} 
                          onChange={(e) => updateContent('status', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:border-black font-medium"
                        >
                          <option value="active">Active (Open for bookings)</option>
                          <option value="coming_soon">Coming Soon (Waitlist Form)</option>
                        </select>
                      </FormField>
                    )}
                  </div>

                  {/* Title */}
                  <div className={`grid gap-4 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                    {(langMode === 'split' || langMode === 'en') && (
                      <FormField label="Title (English)" helper="Main headline on website">
                        <input 
                          type="text" 
                          value={activeProduct.title || ""} 
                          onChange={(e) => {
                            const val = e.target.value;
                            updateProduct('title', val);
                            const newSlug = val
                              .normalize('NFD')
                              .replace(/[\u0300-\u036f]/g, '')
                              .toLowerCase()
                              .replace(/\s+/g, '-')
                              .replace(/[^\w\-]+/g, '')
                              .replace(/\-\-+/g, '-')
                              .replace(/^-+/, '')
                              .replace(/-+$/, '');
                            updateProduct('slug', newSlug || `product-${Date.now()}`);
                          }}
                          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-black"
                        />
                      </FormField>
                    )}
                    {(langMode === 'split' || langMode === 'es') && (
                      <FormField label="Title (Español)" helper="Spanish translated title">
                        <input 
                          type="text" 
                          value={activeProduct.content?.title_es || ""} 
                          onChange={(e) => updateContent('title_es', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-black"
                        />
                      </FormField>
                    )}
                  </div>

                  {/* URL Slug */}
                  <FormField label="URL Slug" helper="Page path: /retreats/[slug]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-mono">/retreats/</span>
                      <input 
                        type="text" 
                        value={activeProduct.slug || ""} 
                        onChange={(e) => updateProduct('slug', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg p-2 text-xs font-mono focus:outline-none focus:border-black"
                      />
                    </div>
                  </FormField>

                  {/* WhatsApp Custom Number */}
                  <FormField 
                    label="Specific WhatsApp Inquiries Number (Optional)" 
                    helper="Leave blank to use the site-wide contact number"
                  >
                    <input 
                      type="text" 
                      placeholder="+62 812 3456 7890" 
                      value={activeProduct.content?.whatsapp_number || ""} 
                      onChange={(e) => updateContent('whatsapp_number', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-black font-mono text-xs"
                    />
                  </FormField>

                  {/* Short Description */}
                  <div className={`grid gap-4 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                    {(langMode === 'split' || langMode === 'en') && (
                      <FormField label="Catalog Summary (English)" helper="Short summary shown on retreat card slider">
                        <textarea 
                          rows={3} 
                          value={activeProduct.description || ""} 
                          onChange={(e) => updateProduct('description', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-black"
                        />
                      </FormField>
                    )}
                    {(langMode === 'split' || langMode === 'es') && (
                      <FormField label="Catalog Summary (Español)" helper="Resumen en español para la tarjeta">
                        <textarea 
                          rows={3} 
                          value={activeProduct.content?.description_es || ""} 
                          onChange={(e) => updateContent('description_es', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-black"
                        />
                      </FormField>
                    )}
                  </div>

                  {/* Overview Section Narrative */}
                  <div className="border-t border-gray-200 pt-6 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800">
                      Story & Narrative Section
                    </h3>
                    <div className={`grid gap-4 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                      {(langMode === 'split' || langMode === 'en') && (
                        <FormField label="Overview Heading (English)">
                          <input 
                            type="text" 
                            value={activeProduct.content?.overview_title || ""} 
                            onChange={(e) => updateContent('overview_title', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-black"
                          />
                        </FormField>
                      )}
                      {(langMode === 'split' || langMode === 'es') && (
                        <FormField label="Overview Heading (Español)">
                          <input 
                            type="text" 
                            value={activeProduct.content?.overview_title_es || ""} 
                            onChange={(e) => updateContent('overview_title_es', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-black"
                          />
                        </FormField>
                      )}
                    </div>

                    <div className={`grid gap-4 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                      {(langMode === 'split' || langMode === 'en') && (
                        <FormField label="Overview Narrative Text (English)">
                          <textarea 
                            rows={6} 
                            value={activeProduct.content?.overview || ""} 
                            onChange={(e) => updateContent('overview', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-black leading-relaxed"
                          />
                        </FormField>
                      )}
                      {(langMode === 'split' || langMode === 'es') && (
                        <FormField label="Overview Narrative Text (Español)">
                          <textarea 
                            rows={6} 
                            value={activeProduct.content?.overview_es || ""} 
                            onChange={(e) => updateContent('overview_es', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-black leading-relaxed"
                          />
                        </FormField>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PHOTOS & MEDIA */}
              {productTab === "media" && (
                <div className="space-y-8 max-w-5xl">
                  {/* Primary Presentation Photos */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-1">
                      Hero & Catalog Photographs
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      These primary photos establish the visual identity on catalog cards and the top of the detail page.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <MediaUploadCard 
                        label="1. Cover Photo"
                        placementHint="Shown on retreat cards in the catalog (/retreats)"
                        value={activeProduct.content?.cover_image}
                        onChange={(url) => updateContent('cover_image', url)}
                        aspectRatio="portrait"
                      />
                      <MediaUploadCard 
                        label="2. Hero Banner"
                        placementHint="Full-width opening banner on the detail page"
                        value={activeProduct.content?.hero_image}
                        onChange={(url) => updateContent('hero_image', url)}
                        aspectRatio="landscape"
                      />
                      <MediaUploadCard 
                        label="3. Overview Photo"
                        placementHint="Featured photograph beside the retreat narrative"
                        value={activeProduct.content?.overview_image}
                        onChange={(url) => updateContent('overview_image', url)}
                        aspectRatio="landscape"
                      />
                    </div>
                  </div>

                  {/* Location 3-Photo Gallery */}
                  {activeProduct.type === 'retreat' && (
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-1">
                        Location Gallery (3 Photos)
                      </h3>
                      <p className="text-xs text-gray-500 mb-4">
                        These 3 photos appear side-by-side in the &quot;Location&quot; section of the retreat page.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[0, 1, 2].map((idx) => (
                          <MediaUploadCard 
                            key={idx}
                            label={`Location Photo ${idx + 1}`}
                            placementHint={`Grid photo #${idx + 1} under Location section`}
                            value={(activeProduct.content?.location_images || [])[idx]}
                            onChange={(url) => updateLocationImage(idx, url)}
                            aspectRatio="portrait"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: DATES & AVAILABILITY */}
              {productTab === "dates" && activeProduct.type === 'retreat' && (
                <div className="space-y-8 max-w-4xl">
                  {/* Summary Label Section */}
                  <div className="border border-gray-200 p-5 rounded-xl bg-gray-50/60 space-y-3">
                    <div className="flex items-start gap-2">
                      <IconInfoCircle size={18} className="text-gray-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                          Date Summary Label
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          This headline text appears on the catalog card and directly under the main title on the retreat page.
                        </p>
                      </div>
                    </div>

                    <div className={`grid gap-4 pt-2 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                      {(langMode === 'split' || langMode === 'en') && (
                        <FormField label="Summary Text (English)" helper="e.g. 'Oct 9 - Oct 17' or 'Multiple Dates Available'">
                          <input 
                            type="text" 
                            value={activeProduct.date || ""} 
                            onChange={(e) => updateProduct('date', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:border-black font-medium"
                          />
                        </FormField>
                      )}
                      {(langMode === 'split' || langMode === 'es') && (
                        <FormField label="Summary Text (Español)" helper="ej. '9 - 17 de Octubre' o 'Múltiples Fechas Disponibles'">
                          <input 
                            type="text" 
                            value={activeProduct.content?.date_es || ""} 
                            onChange={(e) => updateContent('date_es', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:border-black font-medium"
                          />
                        </FormField>
                      )}
                    </div>
                  </div>

                  {/* Departure Dates List per Package */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800">
                          Booking Schedule (Available Dates)
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          These active dates populate the booking slider where guests click to inquire or reserve.
                        </p>
                      </div>
                    </div>

                    {packages.map((pkg, pkgIdx) => {
                      const enDates = pkg.dates || [];
                      const esDates = pkg.dates_es || [];

                      return (
                        <div key={pkgIdx} className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                              Package {pkgIdx + 1}: {pkg.nights || "Package"}
                            </span>
                          </div>

                          {/* Dates Manager */}
                          <div className="space-y-4">
                            {/* EN Dates */}
                            {(langMode === 'split' || langMode === 'en') && (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                                    English Departure Dates ({enDates.length})
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => addDateToPackage(pkgIdx, 'en')}
                                    className="flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors"
                                  >
                                    <IconPlus size={14} /> Add Date (EN)
                                  </button>
                                </div>

                                {enDates.length === 0 ? (
                                  <p className="text-xs text-gray-400 italic py-3 text-center border border-dashed border-gray-200 rounded-lg">
                                    No English dates configured for this package yet.
                                  </p>
                                ) : (
                                  <div className="space-y-3">
                                    {enDates.map((dateItem, dateIdx) => {
                                      const title = typeof dateItem === 'string' ? dateItem : (dateItem.title || '');
                                      const startDate = typeof dateItem === 'string' ? '' : (dateItem.startDate || '');
                                      const endDate = typeof dateItem === 'string' ? '' : (dateItem.endDate || '');
                                      const status = typeof dateItem === 'string' ? 'AVAILABLE' : (dateItem.status || 'AVAILABLE');
                                      const preview = formatPreviewDate(startDate, endDate, 'en');

                                      const isLimited = status.startsWith('ONLY');
                                      const matchSpots = status.match(/^ONLY (\d+) SPOTS AVAILABLE$/);
                                      const spotCount = matchSpots ? matchSpots[1] : '4';

                                      return (
                                        <div key={dateIdx} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 space-y-3">
                                          <div className="flex items-center justify-between gap-2">
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                                              Date #{dateIdx + 1}
                                            </span>
                                            <button 
                                              type="button"
                                              onClick={() => removeDateFromPackage(pkgIdx, 'en', dateIdx)}
                                              className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                                              title="Delete Date"
                                            >
                                              <IconTrash size={15} />
                                            </button>
                                          </div>

                                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div>
                                              <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Title / Label</label>
                                              <input 
                                                type="text" 
                                                placeholder="e.g. July Retreat or Easter"
                                                value={title}
                                                onChange={(e) => updateDateInPackage(pkgIdx, 'en', dateIdx, 'title', e.target.value)}
                                                className="w-full border border-gray-300 rounded p-2 text-xs bg-white focus:outline-none focus:border-black"
                                              />
                                            </div>
                                            <div>
                                              <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Start Date</label>
                                              <input 
                                                type="date" 
                                                value={startDate}
                                                onChange={(e) => updateDateInPackage(pkgIdx, 'en', dateIdx, 'startDate', e.target.value)}
                                                className="w-full border border-gray-300 rounded p-2 text-xs bg-white focus:outline-none focus:border-black font-mono"
                                              />
                                            </div>
                                            <div>
                                              <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">End Date</label>
                                              <input 
                                                type="date" 
                                                value={endDate}
                                                onChange={(e) => updateDateInPackage(pkgIdx, 'en', dateIdx, 'endDate', e.target.value)}
                                                className="w-full border border-gray-300 rounded p-2 text-xs bg-white focus:outline-none focus:border-black font-mono"
                                              />
                                            </div>
                                          </div>

                                          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-gray-200/60">
                                            <div className="flex items-center gap-2">
                                              <label className="text-[10px] uppercase font-bold text-gray-500">Booking Status:</label>
                                              <select
                                                value={isLimited ? 'LIMITED_SPOTS' : status}
                                                onChange={(e) => {
                                                  const val = e.target.value;
                                                  if (val === 'LIMITED_SPOTS') {
                                                    updateDateInPackage(pkgIdx, 'en', dateIdx, 'status', `ONLY ${spotCount} SPOTS AVAILABLE`);
                                                  } else {
                                                    updateDateInPackage(pkgIdx, 'en', dateIdx, 'status', val);
                                                  }
                                                }}
                                                className="text-xs border border-gray-300 rounded p-1.5 bg-white font-medium focus:outline-none focus:border-black"
                                              >
                                                <option value="AVAILABLE">Available</option>
                                                <option value="SPOTS AVAILABLE">Spots Available</option>
                                                <option value="LIMITED_SPOTS">Limited Spots...</option>
                                                <option value="PRIVATE GROUP">Private Group</option>
                                                <option value="FULLY BOOKED">Fully Booked (Sold Out)</option>
                                              </select>

                                              {isLimited && (
                                                <div className="flex items-center gap-1">
                                                  <input 
                                                    type="number"
                                                    min="1"
                                                    value={spotCount}
                                                    onChange={(e) => updateDateInPackage(pkgIdx, 'en', dateIdx, 'status', `ONLY ${e.target.value} SPOTS AVAILABLE`)}
                                                    className="w-12 text-xs border border-gray-300 rounded p-1 text-center font-bold"
                                                  />
                                                  <span className="text-[10px] text-gray-500 font-bold">SPOTS LEFT</span>
                                                </div>
                                              )}
                                            </div>

                                            {preview && (
                                              <span className="text-xs text-gray-600 italic bg-gray-200/50 px-2 py-0.5 rounded">
                                                Guest view: <strong className="font-semibold text-gray-900">{preview}</strong>
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* ES Dates */}
                            {(langMode === 'split' || langMode === 'es') && (
                              <div className="space-y-3 border-t border-gray-200 pt-4">
                                <div className="flex items-center justify-between">
                                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-amber-600 inline-block"></span>
                                    Español Departure Dates ({esDates.length})
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => addDateToPackage(pkgIdx, 'es')}
                                    className="flex items-center gap-1 bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-amber-800 transition-colors"
                                  >
                                    <IconPlus size={14} /> Add Date (ES)
                                  </button>
                                </div>

                                {esDates.length === 0 ? (
                                  <p className="text-xs text-gray-400 italic py-3 text-center border border-dashed border-gray-200 rounded-lg">
                                    No Spanish dates configured for this package yet.
                                  </p>
                                ) : (
                                  <div className="space-y-3">
                                    {esDates.map((dateItem, dateIdx) => {
                                      const title = typeof dateItem === 'string' ? dateItem : (dateItem.title || '');
                                      const startDate = typeof dateItem === 'string' ? '' : (dateItem.startDate || '');
                                      const endDate = typeof dateItem === 'string' ? '' : (dateItem.endDate || '');
                                      const status = typeof dateItem === 'string' ? 'DISPONIBLE' : (dateItem.status || 'DISPONIBLE');
                                      const preview = formatPreviewDate(startDate, endDate, 'es');

                                      const isLimited = status.startsWith('SÓLO') || status.startsWith('SOLO');
                                      const matchSpots = status.match(/^SÓLO (\d+) PLAZAS DISPONIBLES$/) || status.match(/^SOLO (\d+) PLAZAS DISPONIBLES$/);
                                      const spotCount = matchSpots ? matchSpots[1] : '4';

                                      return (
                                        <div key={dateIdx} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 space-y-3">
                                          <div className="flex items-center justify-between gap-2">
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                                              Fecha #{dateIdx + 1}
                                            </span>
                                            <button 
                                              type="button"
                                              onClick={() => removeDateFromPackage(pkgIdx, 'es', dateIdx)}
                                              className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                                              title="Delete Date"
                                            >
                                              <IconTrash size={15} />
                                            </button>
                                          </div>

                                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div>
                                              <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Título / Etiqueta</label>
                                              <input 
                                                type="text" 
                                                placeholder="ej. Retiro de Julio o Semana Santa"
                                                value={title}
                                                onChange={(e) => updateDateInPackage(pkgIdx, 'es', dateIdx, 'title', e.target.value)}
                                                className="w-full border border-gray-300 rounded p-2 text-xs bg-white focus:outline-none focus:border-black"
                                              />
                                            </div>
                                            <div>
                                              <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Fecha Inicio</label>
                                              <input 
                                                type="date" 
                                                value={startDate}
                                                onChange={(e) => updateDateInPackage(pkgIdx, 'es', dateIdx, 'startDate', e.target.value)}
                                                className="w-full border border-gray-300 rounded p-2 text-xs bg-white focus:outline-none focus:border-black font-mono"
                                              />
                                            </div>
                                            <div>
                                              <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Fecha Fin</label>
                                              <input 
                                                type="date" 
                                                value={endDate}
                                                onChange={(e) => updateDateInPackage(pkgIdx, 'es', dateIdx, 'endDate', e.target.value)}
                                                className="w-full border border-gray-300 rounded p-2 text-xs bg-white focus:outline-none focus:border-black font-mono"
                                              />
                                            </div>
                                          </div>

                                          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-gray-200/60">
                                            <div className="flex items-center gap-2">
                                              <label className="text-[10px] uppercase font-bold text-gray-500">Estado de Reserva:</label>
                                              <select
                                                value={isLimited ? 'LIMITED_SPOTS' : status}
                                                onChange={(e) => {
                                                  const val = e.target.value;
                                                  if (val === 'LIMITED_SPOTS') {
                                                    updateDateInPackage(pkgIdx, 'es', dateIdx, 'status', `SÓLO ${spotCount} PLAZAS DISPONIBLES`);
                                                  } else {
                                                    updateDateInPackage(pkgIdx, 'es', dateIdx, 'status', val);
                                                  }
                                                }}
                                                className="text-xs border border-gray-300 rounded p-1.5 bg-white font-medium focus:outline-none focus:border-black"
                                              >
                                                <option value="DISPONIBLE">Disponible</option>
                                                <option value="PLAZAS DISPONIBLES">Plazas Disponibles</option>
                                                <option value="LIMITED_SPOTS">Plazas Limitadas...</option>
                                                <option value="GRUPO PRIVADO">Grupo Privado</option>
                                                <option value="COMPLETO">Completo (Agotado)</option>
                                              </select>

                                              {isLimited && (
                                                <div className="flex items-center gap-1">
                                                  <input 
                                                    type="number"
                                                    min="1"
                                                    value={spotCount}
                                                    onChange={(e) => updateDateInPackage(pkgIdx, 'es', dateIdx, 'status', `SÓLO ${e.target.value} PLAZAS DISPONIBLES`)}
                                                    className="w-12 text-xs border border-gray-300 rounded p-1 text-center font-bold"
                                                  />
                                                  <span className="text-[10px] text-gray-500 font-bold">PLAZAS RESTANTES</span>
                                                </div>
                                              )}
                                            </div>

                                            {preview && (
                                              <span className="text-xs text-gray-600 italic bg-gray-200/50 px-2 py-0.5 rounded">
                                                Vista huésped: <strong className="font-semibold text-gray-900">{preview}</strong>
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: PACKAGES & INCLUSIONS */}
              {productTab === "packages" && activeProduct.type === 'retreat' && (
                <div className="space-y-6 max-w-4xl">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800">
                        Packages & Inclusions
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Define stay durations, accommodation rooms, and comprehensive inclusions.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addPackage}
                      className="flex items-center gap-1.5 bg-black text-white px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors"
                    >
                      <IconPlus size={14} /> Add Package
                    </button>
                  </div>

                  {packages.map((pkg, pkgIdx) => (
                    <div key={pkgIdx} className="border border-gray-200 rounded-xl p-5 bg-white space-y-6">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <h4 className="text-sm font-bold text-gray-900">
                          Package #{pkgIdx + 1}: {pkg.nights || "Untitled"}
                        </h4>
                        {packages.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePackage(pkgIdx)}
                            className="text-xs text-red-500 hover:text-red-700 font-medium"
                          >
                            Remove Package
                          </button>
                        )}
                      </div>

                      {/* Package Duration & Price */}
                      <div className={`grid gap-4 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                        {(langMode === 'split' || langMode === 'en') && (
                          <FormField label="Duration Title (English)" helper="e.g. '9 Nights' or '12 Nights'">
                            <input 
                              type="text" 
                              value={pkg.nights || ""} 
                              onChange={(e) => updatePackage(pkgIdx, 'nights', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-black font-medium"
                            />
                          </FormField>
                        )}
                        {(langMode === 'split' || langMode === 'es') && (
                          <FormField label="Duration Title (Español)" helper="ej. '9 Noches' o '12 Noches'">
                            <input 
                              type="text" 
                              value={pkg.nights_es || ""} 
                              onChange={(e) => updatePackage(pkgIdx, 'nights_es', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-black font-medium"
                            />
                          </FormField>
                        )}
                      </div>

                      <div className={`grid gap-4 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                        {(langMode === 'split' || langMode === 'en') && (
                          <FormField label="Display Price (English, Optional)" helper="e.g. 'From $2,400' (Leave empty if unlisted)">
                            <input 
                              type="text" 
                              value={pkg.price || ""} 
                              onChange={(e) => updatePackage(pkgIdx, 'price', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-black"
                            />
                          </FormField>
                        )}
                        {(langMode === 'split' || langMode === 'es') && (
                          <FormField label="Display Price (Español, Opcional)">
                            <input 
                              type="text" 
                              value={pkg.price_es || ""} 
                              onChange={(e) => updatePackage(pkgIdx, 'price_es', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-black"
                            />
                          </FormField>
                        )}
                      </div>

                      {/* Room Options */}
                      <div className="space-y-3 pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                            Room Options
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              addPackageItem(pkgIdx, 'rooms', '');
                              addPackageItem(pkgIdx, 'rooms_es', '');
                            }}
                            className="text-xs text-black hover:underline font-semibold flex items-center gap-1"
                          >
                            <IconPlus size={14} /> Add Room Option
                          </button>
                        </div>

                        {(pkg.rooms || []).map((room, roomIdx) => (
                          <div key={roomIdx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            <div className="flex-1 space-y-2">
                              {(langMode === 'split' || langMode === 'en') && (
                                <input 
                                  type="text" 
                                  placeholder="Room (EN): e.g. Private double room with ensuite bathroom"
                                  value={room} 
                                  onChange={(e) => updatePackageItem(pkgIdx, 'rooms', roomIdx, e.target.value)}
                                  className="w-full border border-gray-300 rounded p-2 text-xs bg-white focus:outline-none focus:border-black"
                                />
                              )}
                              {(langMode === 'split' || langMode === 'es') && (
                                <input 
                                  type="text" 
                                  placeholder="Habitación (ES): ej. Habitación privada doble con baño privado"
                                  value={(pkg.rooms_es || [])[roomIdx] || ""} 
                                  onChange={(e) => updatePackageItem(pkgIdx, 'rooms_es', roomIdx, e.target.value)}
                                  className="w-full border border-gray-300 rounded p-2 text-xs bg-white focus:outline-none focus:border-black"
                                />
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                removePackageItem(pkgIdx, 'rooms', roomIdx);
                                removePackageItem(pkgIdx, 'rooms_es', roomIdx);
                              }}
                              className="text-gray-400 hover:text-red-600 p-2"
                              title="Delete Room"
                            >
                              <IconTrash size={16} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Inclusions List */}
                      <div className="space-y-3 pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                            What&apos;s Included ({pkg.inclusions?.length || 0} items)
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              addPackageItem(pkgIdx, 'inclusions', '');
                              addPackageItem(pkgIdx, 'inclusions_es', '');
                            }}
                            className="text-xs text-black hover:underline font-semibold flex items-center gap-1"
                          >
                            <IconPlus size={14} /> Add Inclusion
                          </button>
                        </div>

                        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                          {(pkg.inclusions || []).map((inc, incIdx) => (
                            <div key={incIdx} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                              <span className="text-xs text-gray-400 font-mono mt-2 select-none w-5 text-right">
                                {incIdx + 1}.
                              </span>
                              <div className="flex-1 space-y-2">
                                {(langMode === 'split' || langMode === 'en') && (
                                  <textarea 
                                    rows={2} 
                                    placeholder="Inclusion item (English)..."
                                    value={inc} 
                                    onChange={(e) => updatePackageItem(pkgIdx, 'inclusions', incIdx, e.target.value)}
                                    className="w-full border border-gray-300 rounded p-2 text-xs bg-white focus:outline-none focus:border-black"
                                  />
                                )}
                                {(langMode === 'split' || langMode === 'es') && (
                                  <textarea 
                                    rows={2} 
                                    placeholder="Elemento incluido (Español)..."
                                    value={(pkg.inclusions_es || [])[incIdx] || ""} 
                                    onChange={(e) => updatePackageItem(pkgIdx, 'inclusions_es', incIdx, e.target.value)}
                                    className="w-full border border-gray-300 rounded p-2 text-xs bg-white focus:outline-none focus:border-black"
                                  />
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  removePackageItem(pkgIdx, 'inclusions', incIdx);
                                  removePackageItem(pkgIdx, 'inclusions_es', incIdx);
                                }}
                                className="text-gray-400 hover:text-red-600 p-2 mt-1"
                                title="Delete inclusion"
                              >
                                <IconTrash size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 5: SERVICE STEPS (Only if type === 'service') */}
              {productTab === "service_steps" && activeProduct.type === 'service' && (
                <div className="space-y-6 max-w-4xl">
                  <div className="border-b border-gray-200 pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800">
                      Service Workflow & How It Works
                    </h3>
                  </div>

                  <div className={`grid gap-4 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                    {(langMode === 'split' || langMode === 'en') && (
                      <FormField label="Process Section Title (EN)">
                        <input 
                          type="text" 
                          value={activeProduct.content?.how_it_works_title || ""} 
                          onChange={(e) => updateContent('how_it_works_title', e.target.value)}
                          className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black"
                        />
                      </FormField>
                    )}
                    {(langMode === 'split' || langMode === 'es') && (
                      <FormField label="Process Section Title (ES)">
                        <input 
                          type="text" 
                          value={activeProduct.content?.how_it_works_title_es || ""} 
                          onChange={(e) => updateContent('how_it_works_title_es', e.target.value)}
                          className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black"
                        />
                      </FormField>
                    )}
                  </div>

                  <div className="space-y-4">
                    {(activeProduct.content?.how_it_works || []).map((step, idx) => (
                      <div key={idx} className="border border-gray-200 p-4 rounded-xl bg-gray-50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider">Step {idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...(activeProduct.content?.how_it_works || [])];
                              updated.splice(idx, 1);
                              updateContent('how_it_works', updated);
                            }}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input 
                            type="text" 
                            placeholder="Step Title (EN)"
                            value={step.title || ""} 
                            onChange={(e) => {
                              const updated = [...(activeProduct.content?.how_it_works || [])];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              updateContent('how_it_works', updated);
                            }}
                            className="border border-gray-300 rounded p-2 text-xs bg-white"
                          />
                          <input 
                            type="text" 
                            placeholder="Título del Paso (ES)"
                            value={step.title_es || ""} 
                            onChange={(e) => {
                              const updated = [...(activeProduct.content?.how_it_works || [])];
                              updated[idx] = { ...updated[idx], title_es: e.target.value };
                              updateContent('how_it_works', updated);
                            }}
                            className="border border-gray-300 rounded p-2 text-xs bg-white"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <textarea 
                            rows={2} 
                            placeholder="Step Description (EN)"
                            value={step.description || ""} 
                            onChange={(e) => {
                              const updated = [...(activeProduct.content?.how_it_works || [])];
                              updated[idx] = { ...updated[idx], description: e.target.value };
                              updateContent('how_it_works', updated);
                            }}
                            className="border border-gray-300 rounded p-2 text-xs bg-white"
                          />
                          <textarea 
                            rows={2} 
                            placeholder="Descripción del Paso (ES)"
                            value={step.description_es || ""} 
                            onChange={(e) => {
                              const updated = [...(activeProduct.content?.how_it_works || [])];
                              updated[idx] = { ...updated[idx], description_es: e.target.value };
                              updateContent('how_it_works', updated);
                            }}
                            className="border border-gray-300 rounded p-2 text-xs bg-white"
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...(activeProduct.content?.how_it_works || [])];
                        updated.push({ title: "", title_es: "", description: "", description_es: "" });
                        updateContent('how_it_works', updated);
                      }}
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-600 hover:border-black hover:text-black transition-colors"
                    >
                      + Add Process Step
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 6: FAQS & LOCATION */}
              {productTab === "faq" && (
                <div className="space-y-8 max-w-4xl">
                  {/* Location Narrative */}
                  {activeProduct.type === 'retreat' && (
                    <div className="border border-gray-200 p-5 rounded-xl bg-gray-50/50 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                        Location Section Content
                      </h4>
                      <div className={`grid gap-4 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                        {(langMode === 'split' || langMode === 'en') && (
                          <FormField label="Location Section Title (EN)">
                            <input 
                              type="text" 
                              value={activeProduct.content?.location_title || ""} 
                              onChange={(e) => updateContent('location_title', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:border-black font-medium"
                            />
                          </FormField>
                        )}
                        {(langMode === 'split' || langMode === 'es') && (
                          <FormField label="Location Section Title (ES)">
                            <input 
                              type="text" 
                              value={activeProduct.content?.location_title_es || ""} 
                              onChange={(e) => updateContent('location_title_es', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:border-black font-medium"
                            />
                          </FormField>
                        )}
                      </div>

                      <div className={`grid gap-4 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                        {(langMode === 'split' || langMode === 'en') && (
                          <FormField label="Location Description (EN)">
                            <textarea 
                              rows={3} 
                              value={activeProduct.content?.location_text || ""} 
                              onChange={(e) => updateContent('location_text', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:border-black"
                            />
                          </FormField>
                        )}
                        {(langMode === 'split' || langMode === 'es') && (
                          <FormField label="Location Description (ES)">
                            <textarea 
                              rows={3} 
                              value={activeProduct.content?.location_text_es || ""} 
                              onChange={(e) => updateContent('location_text_es', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:border-black"
                            />
                          </FormField>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Frequently Asked Questions */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800">
                          Frequently Asked Questions
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Custom questions for this experience. Leave blank to display default site FAQs.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addFaq}
                        className="flex items-center gap-1.5 bg-black text-white px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors"
                      >
                        <IconPlus size={14} /> Add FAQ
                      </button>
                    </div>

                    {faqs.length === 0 ? (
                      <p className="text-xs text-gray-400 italic py-6 text-center border border-dashed border-gray-200 rounded-lg">
                        No custom FAQs added yet. The site-wide retreat FAQs will be displayed.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wider text-gray-600">FAQ #{idx + 1}</span>
                              <button
                                type="button"
                                onClick={() => removeFaq(idx)}
                                className="text-gray-400 hover:text-red-600 p-1"
                                title="Remove FAQ"
                              >
                                <IconTrash size={16} />
                              </button>
                            </div>

                            <div className={`grid gap-3 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                              {(langMode === 'split' || langMode === 'en') && (
                                <input 
                                  type="text" 
                                  placeholder="Question (English)..."
                                  value={faq.question || ""} 
                                  onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                                  className="w-full border border-gray-300 rounded p-2 text-xs bg-white focus:outline-none focus:border-black font-medium"
                                />
                              )}
                              {(langMode === 'split' || langMode === 'es') && (
                                <input 
                                  type="text" 
                                  placeholder="Pregunta (Español)..."
                                  value={faq.question_es || ""} 
                                  onChange={(e) => updateFaq(idx, 'question_es', e.target.value)}
                                  className="w-full border border-gray-300 rounded p-2 text-xs bg-white focus:outline-none focus:border-black font-medium"
                                />
                              )}
                            </div>

                            <div className={`grid gap-3 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                              {(langMode === 'split' || langMode === 'en') && (
                                <textarea 
                                  rows={2} 
                                  placeholder="Answer (English)..."
                                  value={faq.answer || ""} 
                                  onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                                  className="w-full border border-gray-300 rounded p-2 text-xs bg-white focus:outline-none focus:border-black"
                                />
                              )}
                              {(langMode === 'split' || langMode === 'es') && (
                                <textarea 
                                  rows={2} 
                                  placeholder="Respuesta (Español)..."
                                  value={faq.answer_es || ""} 
                                  onChange={(e) => updateFaq(idx, 'answer_es', e.target.value)}
                                  className="w-full border border-gray-300 rounded p-2 text-xs bg-white focus:outline-none focus:border-black"
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <IconPhoto size={40} className="text-gray-300 mb-3 stroke-1" />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-1">No Product Selected</h3>
            <p className="text-xs text-gray-500 max-w-sm mb-4">
              Select an experience from the left catalog, or click the button below to create a new one.
            </p>
            <button
              type="button"
              onClick={addProduct}
              className="bg-black text-white px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              + Create New Product
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <IconAlertCircle size={24} />
              <h3 className="text-base font-bold text-gray-900">Confirm Product Deletion</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-black">{products[deleteModalIndex]?.title || 'this product'}</strong>? This will permanently remove it from the database and live website.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteModalIndex(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDeleteProduct}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
