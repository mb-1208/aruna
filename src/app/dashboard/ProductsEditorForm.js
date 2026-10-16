"use client";

import { useState, useMemo } from "react";
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
  IconHelp,
  IconArrowLeft,
  IconSearch,
  IconExternalLink,
  IconDeviceFloppy,
  IconLayersLinked,
  IconSparkles,
  IconEye,
  IconChevronRight,
  IconArrowUp,
  IconArrowDown,
  IconCopy,
  IconChevronDown,
  IconChevronUp,
  IconRoute,
  IconUsers
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

function getStatusBadgeClass(status = "") {
  const lower = status.toLowerCase();
  if (lower.includes("fully booked") || lower.includes("completo") || lower.includes("sold out")) {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }
  if (lower.includes("private") || lower.includes("privado") || lower.includes("cerrado")) {
    return "bg-purple-50 text-purple-700 border-purple-200";
  }
  if (lower.includes("only") || lower.includes("sólo") || lower.includes("solo") || lower.includes("limited") || lower.includes("limitada")) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  return "bg-emerald-50 text-emerald-700 border-emerald-200";
}

const FormField = ({ label, helper, children }) => (
  <div className="space-y-1.5">
    <div className="flex items-baseline justify-between">
      <label className="text-xs font-semibold uppercase tracking-wider text-[#574e44]">{label}</label>
      {helper && <span className="text-[11px] text-[#918374] font-normal">{helper}</span>}
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
    <div className="border border-[#ebd8c0]/80 rounded-xl p-4 bg-[#fdfcfb] space-y-3 shadow-xs">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1c1917]">{label}</h4>
          {placementHint && (
            <p className="text-[11px] text-[#73685c] mt-0.5 leading-snug">{placementHint}</p>
          )}
        </div>
        {value && (
          <button 
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-[#a84236] hover:text-[#842e24] font-medium transition-colors cursor-pointer"
            title="Remove image"
          >
            Remove
          </button>
        )}
      </div>

      <div className={`relative w-full ${aspectClass} rounded-lg overflow-hidden bg-[#faf6f0] border border-dashed border-[#ebd8c0] flex items-center justify-center group`}>
        {value ? (
          <>
            <img src={value} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#1c1a17]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
              <label className="cursor-pointer bg-white text-[#1c1917] px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider shadow-md hover:bg-[#faf6f0] transition-colors">
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
          <label className="cursor-pointer flex flex-col items-center justify-center p-6 text-center w-full h-full hover:bg-[#faf4ec] transition-colors">
            <IconUpload className="w-8 h-8 text-[#918374] mb-2 stroke-1" />
            <span className="text-xs font-semibold text-[#443d35]">Click to Upload</span>
            <span className="text-[10px] text-[#918374] mt-0.5">Auto-converted to optimized WebP</span>
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
          <div className="absolute inset-0 bg-[#fdfcfb]/90 backdrop-blur-xs flex flex-col items-center justify-center p-4">
            <div className="w-6 h-6 border-2 border-[#d18529] border-t-transparent rounded-full animate-spin mb-2" />
            <span className="text-xs font-medium text-[#443d35]">Compressing &amp; Uploading...</span>
          </div>
        )}
      </div>

      {errorMsg && <p className="text-xs text-[#a84236] font-medium">{errorMsg}</p>}
    </div>
  );
};

export default function ProductsEditorForm({ products, setProducts, isSaving, handleSave }) {
  // Navigation State: null = Catalog Directory View; number = Focused Editor View
  const [activeProductId, setActiveProductId] = useState(null);
  const [catalogFilter, setCatalogFilter] = useState("all"); // 'all', 'retreat', 'service'
  const [searchQuery, setSearchQuery] = useState("");
  const [productTab, setProductTab] = useState("overview");
  const [langMode, setLangMode] = useState("split"); // 'split', 'en', 'es'
  const [deleteModalIndex, setDeleteModalIndex] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(0);

  const activeProduct = activeProductId !== null ? products[activeProductId] : null;

  // Filtered catalog list for directory
  const filteredProducts = useMemo(() => {
    return (products || []).filter(item => {
      if (catalogFilter === "retreat" && item.type !== "retreat") return false;
      if (catalogFilter === "service" && item.type !== "service") return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = (item.title || "").toLowerCase().includes(q);
        const titleEsMatch = (item.content?.title_es || "").toLowerCase().includes(q);
        const slugMatch = (item.slug || "").toLowerCase().includes(q);
        return titleMatch || titleEsMatch || slugMatch;
      }
      return true;
    });
  }, [products, catalogFilter, searchQuery]);

  const retreatCount = useMemo(() => (products || []).filter(p => p.type === 'retreat').length, [products]);
  const serviceCount = useMemo(() => (products || []).filter(p => p.type === 'service').length, [products]);

  // Handle switching product gracefully with type-aware tab fallback
  const handleSelectProduct = (idx) => {
    setActiveProductId(idx);
    const prod = products[idx];
    if (prod && prod.type === 'service' && (productTab === 'dates' || productTab === 'packages')) {
      setProductTab('overview');
    } else if (prod && prod.type === 'retreat' && (productTab === 'process' || productTab === 'audience')) {
      setProductTab('overview');
    }
  };

  // Product Actions
  const addRetreatExperience = () => {
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
            rooms: ["Room: Choose between private double room or shared twin suite"],
            rooms_es: ["Habitación: Elige entre habitación doble privada o suite compartida"],
            inclusions: [],
            inclusions_es: []
          }
        ],
        faqs: []
      }
    };
    const nextProducts = [...products, newProduct];
    setProducts(nextProducts);
    setActiveProductId(nextProducts.length - 1);
    setProductTab("overview");
  };

  const addServiceExperience = () => {
    const newProduct = {
      id: null,
      title: "New Tailored Service",
      date: "Year-Round Concierge",
      description: "",
      slug: `service-${Date.now()}`,
      type: "service",
      content: {
        status: "active",
        title_es: "",
        date_es: "Disponible Todo el Año",
        description_es: "",
        hero_book_button: "Request Service",
        hero_book_button_es: "Solicitar Servicio",
        overview_title: "Service Overview",
        overview_title_es: "Descripción del Servicio",
        overview: "",
        overview_es: "",
        how_it_works_title: "How Does It Work?",
        how_it_works_title_es: "Cómo trabajamos contigo",
        how_it_works: [
          {
            title: "Book your consultation.",
            title_es: "Reserva tu sesión.",
            description: "Choose the service and tell us a little about your travel vision.",
            description_es: "Elige el servicio y cuéntanos brevemente sobre tu viaje soñado."
          },
          {
            title: "Meet with us online.",
            title_es: "Nos reunimos por videollamada.",
            description: "During a personalized consultation, we'll answer your questions and provide expert guidance.",
            description_es: "Durante una sesión personalizada resolveremos todas tus dudas con asesoría experta."
          },
          {
            title: "Receive our bespoke itinerary.",
            title_es: "Recibe tu ruta personalizada.",
            description: "We'll deliver a tailored travel plan and trusted local contacts.",
            description_es: "Te entregaremos una propuesta detallada con contactos locales de confianza."
          }
        ],
        right_for_you_title: "Is This Service Right for You?",
        right_for_you_title_es: "¿Este servicio es para ti?",
        right_for_you: "If you'd rather skip the endless hours of research and enjoy peace of mind with a tailor-made travel itinerary, this service is designed for you.",
        right_for_you_es: "Si prefieres ahorrarte horas de búsqueda y disfrutar de la tranquilidad de un itinerario a medida con asistencia experta, este servicio es para ti.",
        service_duration: "Flexible",
        service_duration_es: "Flexible",
        service_price: "On Request",
        service_price_es: "Bajo Consulta",
        packages: [],
        faqs: []
      }
    };
    const nextProducts = [...products, newProduct];
    setProducts(nextProducts);
    setActiveProductId(nextProducts.length - 1);
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
      
      if (activeProductId === deleteModalIndex) {
        setActiveProductId(null);
      } else if (activeProductId !== null && activeProductId > deleteModalIndex) {
        setActiveProductId(activeProductId - 1);
      }
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

  // ==========================================
  // DYNAMIC DEPARTURE BATCH HELPERS (DATES TAB)
  // ==========================================
  const addDepartureBatch = () => {
    if (activeProductId === null || !products[activeProductId]) return;
    const newProducts = [...products];
    const pkgs = [...(newProducts[activeProductId].content?.packages || [])];
    if (pkgs.length === 0) {
      pkgs.push({ nights: "7 Nights", nights_es: "7 Noches", dates: [], dates_es: [] });
    }
    const today = new Date().toISOString().split('T')[0];
    const newBatchEn = {
      title: "New Departure Batch",
      startDate: today,
      endDate: today,
      status: "AVAILABLE"
    };
    const newBatchEs = {
      title: "Nuevo Grupo",
      startDate: today,
      endDate: today,
      status: "DISPONIBLE"
    };

    pkgs[0].dates = [...(pkgs[0].dates || []), newBatchEn];
    pkgs[0].dates_es = [...(pkgs[0].dates_es || []), newBatchEs];
    newProducts[activeProductId].content.packages = pkgs;
    setProducts(newProducts);
  };

  const updateDepartureBatch = (dateIdx, field, val, lang = 'en') => {
    if (activeProductId === null || !products[activeProductId]) return;
    const newProducts = [...products];
    const pkgs = [...(newProducts[activeProductId].content?.packages || [])];
    if (!pkgs[0]) return;
    
    pkgs[0].dates = [...(pkgs[0].dates || [])];
    pkgs[0].dates_es = [...(pkgs[0].dates_es || [])];
    
    while (pkgs[0].dates.length <= dateIdx) {
      pkgs[0].dates.push({ title: "", startDate: "", endDate: "", status: "AVAILABLE" });
    }
    while (pkgs[0].dates_es.length <= dateIdx) {
      pkgs[0].dates_es.push({ title: "", startDate: "", endDate: "", status: "DISPONIBLE" });
    }

    if (field === 'startDate' || field === 'endDate') {
      pkgs[0].dates[dateIdx] = { ...pkgs[0].dates[dateIdx], [field]: val };
      pkgs[0].dates_es[dateIdx] = { ...pkgs[0].dates_es[dateIdx], [field]: val };
    } else if (lang === 'es') {
      pkgs[0].dates_es[dateIdx] = { ...pkgs[0].dates_es[dateIdx], [field]: val };
    } else {
      pkgs[0].dates[dateIdx] = { ...pkgs[0].dates[dateIdx], [field]: val };
    }

    newProducts[activeProductId].content.packages = pkgs;
    setProducts(newProducts);
  };

  const removeDepartureBatch = (dateIdx) => {
    if (activeProductId === null || !products[activeProductId]) return;
    const newProducts = [...products];
    const pkgs = [...(newProducts[activeProductId].content?.packages || [])];
    if (pkgs[0]) {
      const datesEn = [...(pkgs[0].dates || [])];
      const datesEs = [...(pkgs[0].dates_es || [])];
      datesEn.splice(dateIdx, 1);
      datesEs.splice(dateIdx, 1);
      pkgs[0].dates = datesEn;
      pkgs[0].dates_es = datesEs;
      newProducts[activeProductId].content.packages = pkgs;
      setProducts(newProducts);
    }
  };

  const moveDepartureBatch = (dateIdx, direction) => {
    if (activeProductId === null || !products[activeProductId]) return;
    const targetIdx = dateIdx + direction;
    const newProducts = [...products];
    const pkgs = [...(newProducts[activeProductId].content?.packages || [])];
    if (!pkgs[0]) return;
    const datesEn = [...(pkgs[0].dates || [])];
    const datesEs = [...(pkgs[0].dates_es || [])];
    const maxLen = Math.max(datesEn.length, datesEs.length);
    if (targetIdx < 0 || targetIdx >= maxLen) return;

    if (datesEn[dateIdx] && datesEn[targetIdx]) {
      const temp = datesEn[dateIdx];
      datesEn[dateIdx] = datesEn[targetIdx];
      datesEn[targetIdx] = temp;
    }
    if (datesEs[dateIdx] && datesEs[targetIdx]) {
      const temp = datesEs[dateIdx];
      datesEs[dateIdx] = datesEs[targetIdx];
      datesEs[targetIdx] = temp;
    }

    pkgs[0].dates = datesEn;
    pkgs[0].dates_es = datesEs;
    newProducts[activeProductId].content.packages = pkgs;
    setProducts(newProducts);
  };

  const duplicateDepartureBatch = (dateIdx) => {
    if (activeProductId === null || !products[activeProductId]) return;
    const newProducts = [...products];
    const pkgs = [...(newProducts[activeProductId].content?.packages || [])];
    if (!pkgs[0]) return;
    const datesEn = [...(pkgs[0].dates || [])];
    const datesEs = [...(pkgs[0].dates_es || [])];
    if (!datesEn[dateIdx]) return;

    const clonedEn = {
      ...datesEn[dateIdx],
      title: `${datesEn[dateIdx].title || 'Batch'} (Copy)`
    };
    const clonedEs = {
      ...(datesEs[dateIdx] || datesEn[dateIdx]),
      title: `${datesEs[dateIdx]?.title || datesEn[dateIdx].title || 'Grupo'} (Copia)`
    };

    datesEn.splice(dateIdx + 1, 0, clonedEn);
    datesEs.splice(dateIdx + 1, 0, clonedEs);
    pkgs[0].dates = datesEn;
    pkgs[0].dates_es = datesEs;
    newProducts[activeProductId].content.packages = pkgs;
    setProducts(newProducts);
  };

  // ==========================================
  // MULTI-PACKAGE & PRICING HELPERS
  // ==========================================
  const addPackage = () => {
    if (activeProductId === null || !products[activeProductId]) return;
    const newProducts = [...products];
    const pkgs = [...(newProducts[activeProductId].content?.packages || [])];
    pkgs.push({
      nights: "7 Nights",
      nights_es: "7 Noches",
      price: "",
      price_es: "",
      dates: [],
      dates_es: [],
      rooms: ["Room: Choose between private double room or shared twin suite"],
      rooms_es: ["Habitación: Elige entre habitación doble privada o suite compartida"],
      inclusions: [],
      inclusions_es: []
    });
    newProducts[activeProductId].content.packages = pkgs;
    setProducts(newProducts);
  };

  const updatePackage = (pkgIndex, key, value) => {
    if (activeProductId === null || !products[activeProductId]) return;
    const newProducts = [...products];
    const pkgs = [...(newProducts[activeProductId].content?.packages || [])];
    if (!pkgs[pkgIndex]) return;
    pkgs[pkgIndex] = { ...pkgs[pkgIndex], [key]: value };
    newProducts[activeProductId].content.packages = pkgs;
    setProducts(newProducts);
  };

  const removePackage = (pkgIdx) => {
    if (!confirm("Are you sure you want to remove this entire package tier?")) return;
    const newProducts = [...products];
    const pkgs = [...(newProducts[activeProductId].content?.packages || [])];
    pkgs.splice(pkgIdx, 1);
    newProducts[activeProductId].content.packages = pkgs;
    setProducts(newProducts);
  };

  const duplicatePackage = (pkgIdx) => {
    if (activeProductId === null || !products[activeProductId]) return;
    const newProducts = [...products];
    const pkgs = [...(newProducts[activeProductId].content?.packages || [])];
    if (!pkgs[pkgIdx]) return;
    const cloned = JSON.parse(JSON.stringify(pkgs[pkgIdx]));
    cloned.nights = `${cloned.nights || 'Stay'} (Copy)`;
    if (cloned.nights_es) cloned.nights_es = `${cloned.nights_es} (Copia)`;
    pkgs.splice(pkgIdx + 1, 0, cloned);
    newProducts[activeProductId].content.packages = pkgs;
    setProducts(newProducts);
  };

  const movePackage = (pkgIdx, direction) => {
    if (activeProductId === null || !products[activeProductId]) return;
    const targetIdx = pkgIdx + direction;
    const newProducts = [...products];
    const pkgs = [...(newProducts[activeProductId].content?.packages || [])];
    if (targetIdx < 0 || targetIdx >= pkgs.length) return;
    const temp = pkgs[pkgIdx];
    pkgs[pkgIdx] = pkgs[targetIdx];
    pkgs[targetIdx] = temp;
    newProducts[activeProductId].content.packages = pkgs;
    setProducts(newProducts);
  };

  // Package array helpers (rooms, inclusions) with Reordering
  const addPackageItem = (pkgIdx, field, defaultVal) => {
    if (activeProductId === null || !products[activeProductId]) return;
    const newProducts = [...products];
    const pkgs = [...(newProducts[activeProductId].content?.packages || [])];
    if (pkgs[pkgIdx]) {
      pkgs[pkgIdx][field] = [...(pkgs[pkgIdx][field] || []), defaultVal];
      newProducts[activeProductId].content.packages = pkgs;
      setProducts(newProducts);
    }
  };

  const updatePackageItem = (pkgIdx, field, itemIdx, val) => {
    if (activeProductId === null || !products[activeProductId]) return;
    const newProducts = [...products];
    const pkgs = [...(newProducts[activeProductId].content?.packages || [])];
    if (pkgs[pkgIdx]) {
      const arr = [...(pkgs[pkgIdx][field] || [])];
      while (arr.length <= itemIdx) {
        arr.push("");
      }
      arr[itemIdx] = val;
      pkgs[pkgIdx][field] = arr;
      newProducts[activeProductId].content.packages = pkgs;
      setProducts(newProducts);
    }
  };

  const removePackageItem = (pkgIdx, field, itemIdx) => {
    if (activeProductId === null || !products[activeProductId]) return;
    const newProducts = [...products];
    const pkgs = [...(newProducts[activeProductId].content?.packages || [])];
    if (pkgs[pkgIdx]?.[field]) {
      const arr = [...pkgs[pkgIdx][field]];
      if (itemIdx < arr.length) {
        arr.splice(itemIdx, 1);
        pkgs[pkgIdx][field] = arr;
        newProducts[activeProductId].content.packages = pkgs;
        setProducts(newProducts);
      }
    }
  };

  const movePackageItem = (pkgIdx, field, itemIdx, direction) => {
    if (activeProductId === null || !products[activeProductId]) return;
    const targetIdx = itemIdx + direction;
    const newProducts = [...products];
    const pkgs = [...(newProducts[activeProductId].content?.packages || [])];
    if (!pkgs[pkgIdx]) return;
    const fieldEs = `${field}_es`;
    const arr = [...(pkgs[pkgIdx][field] || [])];
    const arrEs = [...(pkgs[pkgIdx][fieldEs] || [])];
    const maxLen = Math.max(arr.length, arrEs.length);
    if (targetIdx < 0 || targetIdx >= maxLen) return;

    if (itemIdx < arr.length && targetIdx < arr.length) {
      const temp = arr[itemIdx];
      arr[itemIdx] = arr[targetIdx];
      arr[targetIdx] = temp;
    }
    if (itemIdx < arrEs.length && targetIdx < arrEs.length) {
      const tempEs = arrEs[itemIdx];
      arrEs[itemIdx] = arrEs[targetIdx];
      arrEs[targetIdx] = tempEs;
    }

    pkgs[pkgIdx][field] = arr;
    pkgs[pkgIdx][fieldEs] = arrEs;
    newProducts[activeProductId].content.packages = pkgs;
    setProducts(newProducts);
  };

  // ==========================================
  // SERVICE PROCESS STEPS HELPERS ("HOW IT WORKS")
  // ==========================================
  const addServiceStep = () => {
    if (activeProductId === null || !products[activeProductId]) return;
    const newProducts = [...products];
    const steps = [...(newProducts[activeProductId].content?.how_it_works || [])];
    steps.push({
      title: "New Process Step",
      title_es: "Nuevo Paso",
      description: "",
      description_es: ""
    });
    newProducts[activeProductId].content.how_it_works = steps;
    setProducts(newProducts);
  };

  const updateServiceStep = (stepIdx, field, val) => {
    if (activeProductId === null || !products[activeProductId]) return;
    const newProducts = [...products];
    const steps = [...(newProducts[activeProductId].content?.how_it_works || [])];
    if (!steps[stepIdx]) return;
    steps[stepIdx] = { ...steps[stepIdx], [field]: val };
    newProducts[activeProductId].content.how_it_works = steps;
    setProducts(newProducts);
  };

  const removeServiceStep = (stepIdx) => {
    if (activeProductId === null || !products[activeProductId]) return;
    const newProducts = [...products];
    const steps = [...(newProducts[activeProductId].content?.how_it_works || [])];
    steps.splice(stepIdx, 1);
    newProducts[activeProductId].content.how_it_works = steps;
    setProducts(newProducts);
  };

  const moveServiceStep = (stepIdx, direction) => {
    if (activeProductId === null || !products[activeProductId]) return;
    const targetIdx = stepIdx + direction;
    const newProducts = [...products];
    const steps = [...(newProducts[activeProductId].content?.how_it_works || [])];
    if (targetIdx < 0 || targetIdx >= steps.length) return;
    const temp = steps[stepIdx];
    steps[stepIdx] = steps[targetIdx];
    steps[targetIdx] = temp;
    newProducts[activeProductId].content.how_it_works = steps;
    setProducts(newProducts);
  };

  const duplicateServiceStep = (stepIdx) => {
    if (activeProductId === null || !products[activeProductId]) return;
    const newProducts = [...products];
    const steps = [...(newProducts[activeProductId].content?.how_it_works || [])];
    if (!steps[stepIdx]) return;
    const cloned = {
      ...steps[stepIdx],
      title: `${steps[stepIdx].title || 'Step'} (Copy)`,
      title_es: `${steps[stepIdx].title_es || 'Paso'} (Copia)`
    };
    steps.splice(stepIdx + 1, 0, cloned);
    newProducts[activeProductId].content.how_it_works = steps;
    setProducts(newProducts);
  };

  // ==========================================
  // DYNAMIC LOCATION GALLERY HELPERS
  // ==========================================
  const updateLocationImage = (index, url) => {
    if (activeProductId === null || !products[activeProductId]) return;
    const newProducts = [...products];
    const locImages = [...(newProducts[activeProductId].content?.location_images || ["", "", ""])];
    locImages[index] = url;
    newProducts[activeProductId].content.location_images = locImages;
    setProducts(newProducts);
  };

  const addLocationImage = () => {
    if (activeProductId === null || !products[activeProductId]) return;
    const newProducts = [...products];
    const locImages = [...(newProducts[activeProductId].content?.location_images || [])];
    locImages.push("");
    newProducts[activeProductId].content.location_images = locImages;
    setProducts(newProducts);
  };

  const removeLocationImage = (imgIdx) => {
    if (activeProductId === null || !products[activeProductId]) return;
    const newProducts = [...products];
    const locImages = [...(newProducts[activeProductId].content?.location_images || [])];
    locImages.splice(imgIdx, 1);
    newProducts[activeProductId].content.location_images = locImages;
    setProducts(newProducts);
  };

  const moveLocationImage = (imgIdx, direction) => {
    if (activeProductId === null || !products[activeProductId]) return;
    const targetIdx = imgIdx + direction;
    const newProducts = [...products];
    const locImages = [...(newProducts[activeProductId].content?.location_images || [])];
    if (targetIdx < 0 || targetIdx >= locImages.length) return;
    const temp = locImages[imgIdx];
    locImages[imgIdx] = locImages[targetIdx];
    locImages[targetIdx] = temp;
    newProducts[activeProductId].content.location_images = locImages;
    setProducts(newProducts);
  };

  // ==========================================
  // DYNAMIC FAQ HELPERS
  // ==========================================
  const addFaqItem = () => {
    if (activeProductId === null || !products[activeProductId]) return;
    const newProducts = [...products];
    const faqs = [...(newProducts[activeProductId].content?.faqs || [])];
    faqs.push({ question: "", question_es: "", answer: "", answer_es: "" });
    newProducts[activeProductId].content.faqs = faqs;
    setProducts(newProducts);
    setExpandedFaqIndex(faqs.length - 1);
  };

  const updateFaqItem = (faqIdx, field, val) => {
    if (activeProductId === null || !products[activeProductId]) return;
    const newProducts = [...products];
    const faqs = [...(newProducts[activeProductId].content?.faqs || [])];
    if (faqs[faqIdx]) {
      faqs[faqIdx][field] = val;
      newProducts[activeProductId].content.faqs = faqs;
      setProducts(newProducts);
    }
  };

  const removeFaqItem = (faqIdx) => {
    if (activeProductId === null || !products[activeProductId]) return;
    const newProducts = [...products];
    const faqs = [...(newProducts[activeProductId].content?.faqs || [])];
    faqs.splice(faqIdx, 1);
    newProducts[activeProductId].content.faqs = faqs;
    setProducts(newProducts);
  };

  const moveFaqItem = (faqIdx, direction) => {
    if (activeProductId === null || !products[activeProductId]) return;
    const targetIdx = faqIdx + direction;
    const newProducts = [...products];
    const faqs = [...(newProducts[activeProductId].content?.faqs || [])];
    if (targetIdx < 0 || targetIdx >= faqs.length) return;
    const temp = faqs[faqIdx];
    faqs[faqIdx] = faqs[targetIdx];
    faqs[targetIdx] = temp;
    newProducts[activeProductId].content.faqs = faqs;
    setProducts(newProducts);
    setExpandedFaqIndex(targetIdx);
  };

  const duplicateFaqItem = (faqIdx) => {
    if (activeProductId === null || !products[activeProductId]) return;
    const newProducts = [...products];
    const faqs = [...(newProducts[activeProductId].content?.faqs || [])];
    if (!faqs[faqIdx]) return;
    const cloned = {
      ...faqs[faqIdx],
      question: `${faqs[faqIdx].question || 'Question'} (Copy)`,
      question_es: `${faqs[faqIdx].question_es || 'Pregunta'} (Copia)`
    };
    faqs.splice(faqIdx + 1, 0, cloned);
    newProducts[activeProductId].content.faqs = faqs;
    setProducts(newProducts);
    setExpandedFaqIndex(faqIdx + 1);
  };

  // =========================================================================
  // VIEW 1: CATALOG DIRECTORY (When activeProductId === null)
  // =========================================================================
  if (activeProductId === null || !activeProduct) {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#faf6f0] overflow-y-auto min-w-0">
        {/* Directory Top Bar */}
        <div className="bg-[#fdfcfb] border-b border-[#ebd8c0]/80 px-4 sm:px-6 md:px-8 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#d18529]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#99611b]">
                  Experiences Directory
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1c1917] mt-1">
                Products &amp; Retreats Catalog
              </h1>
              <p className="text-xs text-[#73685c] mt-0.5">
                Manage your journeys, bespoke services, departure dates, pricing tiers, and Spanish translations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={addRetreatExperience}
                className="flex items-center gap-2 bg-[#d18529] text-white px-4 sm:px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-[#b8701d] transition-all shadow-xs cursor-pointer"
              >
                <IconPlus size={16} /> New Retreat
              </button>
              <button
                type="button"
                onClick={addServiceExperience}
                className="flex items-center gap-2 bg-[#fdfcfb] border border-[#ebd8c0] text-[#1c1917] px-4 sm:px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-[#faf4ec] transition-all shadow-xs cursor-pointer"
              >
                <IconPlus size={16} /> New Service
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-[#faf6f0]/95 backdrop-blur-xs border-b border-[#ebd8c0]/80 px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 sticky top-0 z-10 shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="relative flex-1 max-w-md w-full">
              <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#918374]" size={16} />
              <input
                type="text"
                placeholder="Search products by title, Spanish name, or slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#fdfcfb] border border-[#e2d8cb] rounded-xl text-xs text-[#1c1917] placeholder-[#aba095] focus:bg-white focus:outline-none focus:border-[#d18529] focus:ring-1 focus:ring-[#d18529] transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setCatalogFilter("all")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
                  catalogFilter === "all" ? "bg-[#d18529] text-white shadow-xs" : "bg-[#faf4ec] text-[#73685c] border border-[#ebd8c0]/60 hover:bg-[#f4ece1]"
                }`}
              >
                All ({(products || []).length})
              </button>
              <button
                type="button"
                onClick={() => setCatalogFilter("retreat")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
                  catalogFilter === "retreat" ? "bg-[#d18529] text-white shadow-xs" : "bg-[#faf4ec] text-[#73685c] border border-[#ebd8c0]/60 hover:bg-[#f4ece1]"
                }`}
              >
                Retreats ({retreatCount})
              </button>
              <button
                type="button"
                onClick={() => setCatalogFilter("service")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
                  catalogFilter === "service" ? "bg-[#d18529] text-white shadow-xs" : "bg-[#faf4ec] text-[#73685c] border border-[#ebd8c0]/60 hover:bg-[#f4ece1]"
                }`}
              >
                Tailored Services ({serviceCount})
              </button>
            </div>
          </div>
        </div>

        {/* Catalog Grid View */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 w-full min-w-0">
          {filteredProducts.length === 0 ? (
            <div className="bg-[#fdfcfb] border border-[#ebd8c0]/80 rounded-2xl p-16 text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-[#faf4ec] border border-[#ebd8c0] flex items-center justify-center mx-auto text-[#918374]">
                <IconSearch size={24} />
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1c1917]">No Experiences Found</h3>
                <p className="text-xs text-[#73685c] mt-1 max-w-sm mx-auto">
                  {searchQuery ? `No product matched "${searchQuery}". Try a different keyword.` : "Your catalog is empty. Click one of the buttons above to create your first journey."}
                </p>
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-xs font-semibold uppercase tracking-wider text-[#d18529] hover:underline cursor-pointer"
                >
                  Clear Search Filter
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => {
                const originalIndex = products.findIndex(p => p === prod);
                const isRetreat = prod.type === 'retreat';
                const liveUrl = isRetreat ? `/en/retreats/${prod.slug}` : `/en/services/${prod.slug}`;
                const datesCount = (prod.content?.packages?.[0]?.dates || []).length;
                const pkgsCount = (prod.content?.packages || []).length;
                const stepsCount = (prod.content?.how_it_works || []).length;

                return (
                  <div
                    key={prod.id || prod.slug || originalIndex}
                    className="bg-[#fdfcfb] border border-[#ebd8c0]/80 rounded-2xl overflow-hidden hover:shadow-md hover:border-[#d18529]/40 transition-all flex flex-col group"
                  >
                    {/* Card Cover Photo */}
                    <div className="relative aspect-[16/10] bg-[#faf6f0] overflow-hidden">
                      {prod.content?.cover_image || prod.content?.hero_image ? (
                        <img
                          src={prod.content.cover_image || prod.content.hero_image}
                          alt={prod.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[#aba095]">
                          <IconPhoto size={36} stroke={1.5} />
                          <span className="text-[10px] uppercase font-semibold tracking-wider mt-1">No Photo</span>
                        </div>
                      )}

                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs ${
                          isRetreat ? "bg-[#faf4ec] text-[#99611b] border border-[#ebd8c0]" : "bg-[#f4f7f2] text-[#4d7042] border border-[#cde0c5]"
                        }`}>
                          {isRetreat ? "RETREAT" : "SERVICE"}
                        </span>
                        {prod.content?.status === 'coming_soon' && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#fdf8f0] text-[#b8701d] border border-[#f3d9b5] shadow-xs">
                            COMING SOON
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 bg-white/95 backdrop-blur-xs text-[#1c1917] px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider shadow-sm hover:bg-white"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <IconExternalLink size={12} /> Live Preview
                        </a>
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <h3 className="font-semibold text-base text-[#1c1917] group-hover:text-[#99611b] line-clamp-1 transition-colors">
                          {prod.title}
                        </h3>
                        {prod.content?.title_es && (
                          <p className="text-xs text-[#73685c] italic line-clamp-1">
                            ES: {prod.content.title_es}
                          </p>
                        )}
                        <p className="text-xs text-[#73685c] line-clamp-2 mt-1">
                          {prod.description || prod.content?.overview || "No description configured yet."}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#ebd8c0]/60 flex items-center justify-between text-xs text-[#73685c]">
                        <span className="font-medium text-[#574e44]">
                          {isRetreat ? `${datesCount} Departure Batches` : `${stepsCount} Process Steps`}
                        </span>
                        <span className="font-medium text-[#574e44]">
                          {isRetreat ? `${pkgsCount} Package Tier${pkgsCount === 1 ? '' : 's'}` : "Year-Round"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleSelectProduct(originalIndex)}
                          className="flex-1 bg-[#d18529] text-white text-center py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-[#b8701d] transition-colors shadow-xs cursor-pointer"
                        >
                          Edit Experience
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteModalIndex(originalIndex)}
                          className="p-2.5 text-[#918374] hover:text-[#a84236] hover:bg-[#fbedea] rounded-xl transition-colors border border-[#ebd8c0]/80 cursor-pointer"
                          title="Delete Product"
                        >
                          <IconTrash size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModalIndex !== null && (
          <div className="fixed inset-0 z-50 bg-[#1c1a17]/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#fdfcfb] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 border border-[#ebd8c0]">
              <div className="flex items-center gap-3 text-[#a84236]">
                <IconAlertCircle size={24} />
                <h3 className="text-base font-semibold text-[#1c1917]">Confirm Product Deletion</h3>
              </div>
              <p className="text-xs text-[#73685c] leading-relaxed">
                Are you sure you want to delete <strong className="text-[#1c1917]">{products[deleteModalIndex]?.title || 'this product'}</strong>? This will permanently remove it from the database and live website.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeleteModalIndex(null)}
                  className="px-4 py-2 rounded-xl border border-[#ebd8c0] text-xs font-semibold text-[#574e44] hover:bg-[#faf4ec] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={confirmDeleteProduct}
                  className="px-4 py-2 rounded-xl bg-[#a84236] text-white text-xs font-semibold hover:bg-[#842e24] transition-colors disabled:opacity-50 cursor-pointer"
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

  // =========================================================================
  // VIEW 2: FOCUSED FULL-CANVAS EDITOR (When activeProductId !== null)
  // =========================================================================
  const liveSlug = activeProduct.slug || "";
  const publicPageUrl = activeProduct.type === 'retreat' 
    ? `/en/retreats/${liveSlug}` 
    : `/en/services/${liveSlug}`;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#faf6f0] overflow-y-auto pb-24 min-w-0 max-w-full">
      {/* Sticky Top Toolbar */}
      <div className="bg-[#fdfcfb] border-b border-[#ebd8c0]/80 sticky top-0 z-20 shadow-xs min-w-0">
        {/* Row 1: Breadcrumbs & Quick Switcher */}
        <div className="px-3 sm:px-6 md:px-8 py-3 flex flex-col xl:flex-row xl:items-center justify-between gap-3 border-b border-[#ebd8c0]/60 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap min-w-0">
            <button
              type="button"
              onClick={() => setActiveProductId(null)}
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#73685c] hover:text-[#1c1917] transition-colors px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-[#faf4ec] cursor-pointer shrink-0"
            >
              <IconArrowLeft size={16} /> All Products
            </button>
            <span className="text-[#ebd8c0] shrink-0">/</span>
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#99611b] bg-[#faf4ec] px-2.5 py-0.5 rounded-full border border-[#ebd8c0] shrink-0">
              {activeProduct.type === 'retreat' ? 'RETREAT' : 'SERVICE'}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#1c1917] truncate max-w-[160px] xs:max-w-[220px] sm:max-w-xs md:max-w-sm">
              {activeProduct.title}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 min-w-0 w-full xl:w-auto">
            <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#73685c] shrink-0">Switch:</span>
              <select
                value={activeProductId}
                onChange={(e) => handleSelectProduct(Number(e.target.value))}
                className="text-xs border border-[#e2d8cb] rounded-lg p-2 bg-white font-medium text-[#1c1917] focus:outline-none focus:border-[#d18529] w-full sm:w-auto sm:max-w-xs min-w-0 truncate"
              >
                {products.map((p, idx) => (
                  <option key={p.id || idx} value={idx}>
                    {p.type === 'retreat' ? '🧘' : '✨'} {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Mode Toggle */}
            <div className="flex items-center bg-[#faf4ec] p-0.5 rounded-lg border border-[#ebd8c0] w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setLangMode("split")}
                className={`flex-1 sm:flex-initial text-center px-2.5 sm:px-3 py-1.5 rounded-md text-[11px] sm:text-xs font-semibold tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                  langMode === "split" ? "bg-[#d18529] text-white shadow-xs" : "text-[#73685c] hover:text-[#1c1917]"
                }`}
              >
                <span className="sm:hidden">Split (EN/ES)</span>
                <span className="hidden sm:inline">Side-by-Side (EN &amp; ES)</span>
              </button>
              <button
                type="button"
                onClick={() => setLangMode("en")}
                className={`flex-1 sm:flex-initial text-center px-2.5 sm:px-3 py-1.5 rounded-md text-[11px] sm:text-xs font-semibold tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                  langMode === "en" ? "bg-[#d18529] text-white shadow-xs" : "text-[#73685c] hover:text-[#1c1917]"
                }`}
              >
                <span className="sm:hidden">English</span>
                <span className="hidden sm:inline">English Only</span>
              </button>
              <button
                type="button"
                onClick={() => setLangMode("es")}
                className={`flex-1 sm:flex-initial text-center px-2.5 sm:px-3 py-1.5 rounded-md text-[11px] sm:text-xs font-semibold tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                  langMode === "es" ? "bg-[#d18529] text-white shadow-xs" : "text-[#73685c] hover:text-[#1c1917]"
                }`}
              >
                <span className="sm:hidden">Español</span>
                <span className="hidden sm:inline">Español Only</span>
              </button>
            </div>

            {handleSave && (
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 bg-[#d18529] text-white px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-[#b8701d] disabled:opacity-50 transition-colors shadow-xs cursor-pointer w-full sm:w-auto shrink-0"
              >
                <IconDeviceFloppy size={16} />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Sub-Tab Navigation Bar (Type-Aware) */}
        <div className="flex items-center justify-between px-3 sm:px-6 md:px-8 bg-[#fdfcfb] overflow-x-auto hide-scrollbar gap-4 border-b border-[#ebd8c0]/60">
          <div className="flex items-center gap-1">
            {activeProduct.type === 'retreat' ? (
              <>
                <button
                  type="button"
                  onClick={() => setProductTab("overview")}
                  className={`flex items-center gap-2 py-3.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    productTab === "overview" ? "border-[#d18529] text-[#99611b]" : "border-transparent text-[#73685c] hover:text-[#1c1917]"
                  }`}
                >
                  <IconFileText size={16} /> Details &amp; Copy
                </button>
                <button
                  type="button"
                  onClick={() => setProductTab("media")}
                  className={`flex items-center gap-2 py-3.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    productTab === "media" ? "border-[#d18529] text-[#99611b]" : "border-transparent text-[#73685c] hover:text-[#1c1917]"
                  }`}
                >
                  <IconPhoto size={16} /> Photos &amp; Gallery
                </button>
                <button
                  type="button"
                  onClick={() => setProductTab("dates")}
                  className={`flex items-center gap-2 py-3.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    productTab === "dates" ? "border-[#d18529] text-[#99611b]" : "border-transparent text-[#73685c] hover:text-[#1c1917]"
                  }`}
                >
                  <IconCalendar size={16} /> Dates &amp; Availability ({(activeProduct.content?.packages?.[0]?.dates || []).length})
                </button>
                <button
                  type="button"
                  onClick={() => setProductTab("packages")}
                  className={`flex items-center gap-2 py-3.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    productTab === "packages" ? "border-[#d18529] text-[#99611b]" : "border-transparent text-[#73685c] hover:text-[#1c1917]"
                  }`}
                >
                  <IconBed size={16} /> Packages &amp; Inclusions ({(activeProduct.content?.packages || []).length})
                </button>
                <button
                  type="button"
                  onClick={() => setProductTab("faqs")}
                  className={`flex items-center gap-2 py-3.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    productTab === "faqs" ? "border-[#d18529] text-[#99611b]" : "border-transparent text-[#73685c] hover:text-[#1c1917]"
                  }`}
                >
                  <IconHelp size={16} /> FAQs &amp; Location ({(activeProduct.content?.faqs || []).length})
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setProductTab("overview")}
                  className={`flex items-center gap-2 py-3.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    productTab === "overview" ? "border-[#d18529] text-[#99611b]" : "border-transparent text-[#73685c] hover:text-[#1c1917]"
                  }`}
                >
                  <IconFileText size={16} /> Details &amp; Copy
                </button>
                <button
                  type="button"
                  onClick={() => setProductTab("media")}
                  className={`flex items-center gap-2 py-3.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    productTab === "media" ? "border-[#d18529] text-[#99611b]" : "border-transparent text-[#73685c] hover:text-[#1c1917]"
                  }`}
                >
                  <IconPhoto size={16} /> Photos &amp; Media
                </button>
                <button
                  type="button"
                  onClick={() => setProductTab("process")}
                  className={`flex items-center gap-2 py-3.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    productTab === "process" ? "border-[#d18529] text-[#99611b]" : "border-transparent text-[#73685c] hover:text-[#1c1917]"
                  }`}
                >
                  <IconRoute size={16} /> Process &amp; How It Works ({(activeProduct.content?.how_it_works || []).length})
                </button>
                <button
                  type="button"
                  onClick={() => setProductTab("audience")}
                  className={`flex items-center gap-2 py-3.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    productTab === "audience" ? "border-[#d18529] text-[#99611b]" : "border-transparent text-[#73685c] hover:text-[#1c1917]"
                  }`}
                >
                  <IconUsers size={16} /> Target Audience (&quot;Right For You&quot;)
                </button>
                <button
                  type="button"
                  onClick={() => setProductTab("faqs")}
                  className={`flex items-center gap-2 py-3.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    productTab === "faqs" ? "border-[#d18529] text-[#99611b]" : "border-transparent text-[#73685c] hover:text-[#1c1917]"
                  }`}
                >
                  <IconHelp size={16} /> Service FAQs ({(activeProduct.content?.faqs || []).length})
                </button>
              </>
            )}
          </div>

          <a
            href={publicPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold uppercase tracking-wider text-[#99611b] hover:text-[#784c15] flex items-center gap-1.5 transition-colors py-2 shrink-0 whitespace-nowrap"
          >
            <IconExternalLink size={14} /> <span className="hidden sm:inline">Open Live Page</span><span className="sm:hidden">Live</span>
          </a>
        </div>
      </div>

      {/* Main Full-Width Form Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-6 sm:py-8 w-full min-w-0">
        {/* ===================================== */}
        {/* SUB-TAB 1: DETAILS & COPY */}
        {/* ===================================== */}
        {productTab === "overview" && (
          <div className="space-y-6">
            {/* Core Identification Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3">
                Core Identity &amp; Routing
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField label="URL Slug" helper="Unique web identifier">
                  <input
                    type="text"
                    value={activeProduct.slug || ""}
                    onChange={(e) => updateProduct("slug", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black font-mono font-medium"
                    placeholder="e.g. bali-connection-retreat"
                  />
                </FormField>

                <FormField label="Experience Type">
                  <select
                    value={activeProduct.type || "retreat"}
                    onChange={(e) => updateProduct("type", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black bg-white font-medium"
                  >
                    <option value="retreat">🧘 Luxury Retreat Journey</option>
                    <option value="service">✨ Tailored Travel Service</option>
                  </select>
                </FormField>

                <FormField label="Publication Status">
                  <select
                    value={activeProduct.content?.status || "active"}
                    onChange={(e) => updateContent("status", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black bg-white font-medium"
                  >
                    <option value="active">Active (Published on Live Website)</option>
                    <option value="coming_soon">Coming Soon (Preview Badge)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </FormField>
              </div>

              {/* Titles Side-by-Side */}
              <div className={`grid gap-6 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {(langMode === 'split' || langMode === 'en') && (
                  <FormField label="Experience Title (English)" helper="Main headline on hero & cards">
                    <input
                      type="text"
                      value={activeProduct.title || ""}
                      onChange={(e) => updateProduct("title", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black font-medium"
                      placeholder="e.g. Bali Connection & Transformation Retreat"
                    />
                  </FormField>
                )}

                {(langMode === 'split' || langMode === 'es') && (
                  <FormField label="Experience Title (Español)" helper="Título principal en español">
                    <input
                      type="text"
                      value={activeProduct.content?.title_es || ""}
                      onChange={(e) => updateContent("title_es", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black font-medium italic"
                      placeholder="e.g. Retiro de Conexión y Transformación en Bali"
                    />
                  </FormField>
                )}
              </div>

              {/* Short Descriptions */}
              <div className={`grid gap-6 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {(langMode === 'split' || langMode === 'en') && (
                  <FormField label="Catalog Summary (English)" helper="Short summary shown on directory cards">
                    <textarea
                      rows={3}
                      value={activeProduct.description || ""}
                      onChange={(e) => updateProduct("description", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black leading-relaxed"
                      placeholder="Brief excerpt describing the journey..."
                    />
                  </FormField>
                )}

                {(langMode === 'split' || langMode === 'es') && (
                  <FormField label="Catalog Summary (Español)" helper="Resumen para la tarjeta de catálogo">
                    <textarea
                      rows={3}
                      value={activeProduct.content?.description_es || ""}
                      onChange={(e) => updateContent("description_es", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black leading-relaxed italic"
                      placeholder="Breve resumen que describe el viaje de transformación..."
                    />
                  </FormField>
                )}
              </div>
            </div>

            {/* Story & Overview Section */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3">
                Overview Story &amp; Experience Narrative
              </h3>

              {/* Story Section Heading (overview_title) */}
              <div className={`grid gap-6 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {(langMode === 'split' || langMode === 'en') && (
                  <FormField 
                    label="Story Section Heading (English)" 
                    helper="Large serif heading displayed beside the story photo (defaults to Main Title if blank)"
                  >
                    <input
                      type="text"
                      value={activeProduct.content?.overview_title !== undefined ? activeProduct.content.overview_title : (activeProduct.title || "")}
                      onChange={(e) => updateContent("overview_title", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black font-medium"
                      placeholder="e.g. The Blue Goddess Journey - Indonesia & Bali"
                    />
                  </FormField>
                )}

                {(langMode === 'split' || langMode === 'es') && (
                  <FormField 
                    label="Story Section Heading (Español)" 
                    helper="Título de la sección de historia en español"
                  >
                    <input
                      type="text"
                      value={activeProduct.content?.overview_title_es !== undefined ? activeProduct.content.overview_title_es : (activeProduct.content?.title_es || "")}
                      onChange={(e) => updateContent("overview_title_es", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black font-medium italic"
                      placeholder="e.g. El viaje de la Diosa Azul - Indonesia y Bali"
                    />
                  </FormField>
                )}
              </div>

              <div className={`grid gap-6 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {(langMode === 'split' || langMode === 'en') && (
                  <FormField label="Main Story / Overview (English)" helper="Full description of the experience">
                    <textarea
                      rows={7}
                      value={activeProduct.content?.overview || ""}
                      onChange={(e) => updateContent("overview", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black leading-relaxed"
                      placeholder="Detail the transformative experience, daily vibe, and emotional journey..."
                    />
                  </FormField>
                )}

                {(langMode === 'split' || langMode === 'es') && (
                  <FormField label="Main Story / Overview (Español)" helper="Descripción completa en español">
                    <textarea
                      rows={7}
                      value={activeProduct.content?.overview_es || ""}
                      onChange={(e) => updateContent("overview_es", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black leading-relaxed italic"
                      placeholder="Detalla la experiencia de transformación, el ambiente y el viaje emocional..."
                    />
                  </FormField>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================================== */}
        {/* SUB-TAB 2: PHOTOS & GALLERY */}
        {/* ===================================== */}
        {productTab === "media" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-1">
                Visual Media &amp; Photography
              </h3>
              <p className="text-xs text-gray-500">
                Upload high-resolution photography. All uploaded images are automatically compressed into optimized WebP format for fast page loads.
              </p>
            </div>

            {/* Primary Images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MediaUploadCard 
                label="Cover Photo (Catalog Card)"
                placementHint="Portrait 4:5 ratio. Shown on catalog cards."
                value={activeProduct.content?.cover_image}
                onChange={(url) => updateContent("cover_image", url)}
                aspectRatio="portrait"
              />

              <MediaUploadCard 
                label="Hero Panoramic Banner"
                placementHint="Landscape 16:9 ratio. Shown at top of detail page."
                value={activeProduct.content?.hero_image}
                onChange={(url) => updateContent("hero_image", url)}
                aspectRatio="landscape"
              />

              <MediaUploadCard 
                label="Overview Story Photo"
                placementHint="Portrait 3:4 ratio. Sits beside overview text."
                value={activeProduct.content?.overview_image}
                onChange={(url) => updateContent("overview_image", url)}
                aspectRatio="portrait"
              />
            </div>

            {/* Location Dynamic Gallery (Retreats Only) */}
            {activeProduct.type === 'retreat' && (
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800">
                      Location &amp; Sanctuary Gallery ({(activeProduct.content?.location_images || []).length} Photos)
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      These photos appear in the &quot;Location&quot; section of the retreat page. You can add extra photos or reorder them.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addLocationImage}
                    className="text-xs text-black font-semibold hover:underline flex items-center gap-1"
                  >
                    <IconPlus size={14} /> Add Photo Slot
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {(activeProduct.content?.location_images || []).map((imgUrl, imgIdx) => (
                    <div key={imgIdx} className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                        <span>Photo #{imgIdx + 1}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={imgIdx === 0}
                            onClick={() => moveLocationImage(imgIdx, -1)}
                            className="p-1 text-gray-400 hover:text-black disabled:opacity-20 transition-colors"
                            title="Move Left"
                          >
                            <IconArrowUp className="-rotate-90" size={14} />
                          </button>
                          <button
                            type="button"
                            disabled={imgIdx === (activeProduct.content?.location_images || []).length - 1}
                            onClick={() => moveLocationImage(imgIdx, 1)}
                            className="p-1 text-gray-400 hover:text-black disabled:opacity-20 transition-colors"
                            title="Move Right"
                          >
                            <IconArrowDown className="-rotate-90" size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeLocationImage(imgIdx)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove Photo"
                          >
                            <IconTrash size={14} />
                          </button>
                        </div>
                      </div>

                      <MediaUploadCard 
                        label={`Location Photo ${imgIdx + 1}`}
                        placementHint={`Grid photo #${imgIdx + 1}`}
                        value={imgUrl}
                        onChange={(url) => updateLocationImage(imgIdx, url)}
                        aspectRatio="portrait"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* SUB-TAB 3: DATES & AVAILABILITY (RETREATS ONLY - DYNAMIC) */}
        {/* ========================================================= */}
        {productTab === "dates" && activeProduct.type === "retreat" && (
          <div className="space-y-6">
            {/* Card 1: Headline Display Date */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">1</span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                  Headline Display Date (Banner &amp; Catalog Summary)
                </h3>
              </div>
              <p className="text-xs text-gray-500">
                This is the main headline date string displayed on the retreat card and the hero section of the website.
              </p>

              <div className={`grid gap-6 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {(langMode === 'split' || langMode === 'en') && (
                  <FormField label="Display Date (English)" helper="e.g. June 27th - July 7th, 2026 or Multiple Dates Available">
                    <input
                      type="text"
                      value={activeProduct.date || ""}
                      onChange={(e) => updateProduct("date", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black font-medium"
                      placeholder="e.g. Multiple Dates Available"
                    />
                  </FormField>
                )}

                {(langMode === 'split' || langMode === 'es') && (
                  <FormField label="Display Date (Español)" helper="e.g. Múltiples Fechas Disponibles">
                    <input
                      type="text"
                      value={activeProduct.content?.date_es || ""}
                      onChange={(e) => updateContent("date_es", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black font-medium italic"
                      placeholder="e.g. Múltiples Fechas Disponibles"
                    />
                  </FormField>
                )}
              </div>
            </div>

            {/* Card 2: Interactive Departure Batches (Dynamic List) */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">2</span>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                      Departure Dates &amp; Availability Batches ({(activeProduct.content?.packages?.[0]?.dates || []).length})
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Configure booking departure batches with custom names, date ranges, and live availability badges.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addDepartureBatch}
                  className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
                >
                  <IconPlus size={16} /> Add Departure Batch
                </button>
              </div>

              {/* Batches List */}
              {(activeProduct.content?.packages?.[0]?.dates || []).length === 0 ? (
                <div className="p-12 border border-dashed border-gray-200 rounded-2xl text-center space-y-3">
                  <IconCalendar size={32} className="mx-auto text-gray-300 stroke-1" />
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    No departure batches configured yet. Click &quot;Add Departure Batch&quot; above to add available retreat dates.
                  </p>
                  <button
                    type="button"
                    onClick={addDepartureBatch}
                    className="text-xs font-bold uppercase tracking-wider text-black hover:underline"
                  >
                    + Create First Batch
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {(activeProduct.content?.packages?.[0]?.dates || []).map((batch, dateIdx) => {
                    const batchEs = (activeProduct.content?.packages?.[0]?.dates_es || [])[dateIdx] || {};
                    const statusEn = batch.status || "AVAILABLE";
                    const statusEs = batchEs.status || statusEn;
                    const startDate = batch.startDate || "";
                    const endDate = batch.endDate || "";
                    const livePreviewEn = formatPreviewDate(startDate, endDate, 'en');
                    const livePreviewEs = formatPreviewDate(startDate, endDate, 'es');

                    return (
                      <div
                        key={dateIdx}
                        className="bg-gray-50/70 border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4 hover:border-gray-300 transition-colors"
                      >
                        {/* Batch Header Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200/60 pb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="w-6 h-6 rounded-md bg-black text-white flex items-center justify-center text-xs font-bold">
                              #{dateIdx + 1}
                            </span>
                            <span className="font-bold text-sm text-gray-900">
                              {batch.title || "Untitled Batch"}
                            </span>
                            {batchEs.title && (
                              <span className="text-xs text-gray-400 italic">
                                ({batchEs.title})
                              </span>
                            )}
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(statusEn)}`}>
                              {statusEn}
                            </span>
                            {livePreviewEn && (
                              <span className="text-xs text-gray-500 font-medium hidden md:inline">
                                • {livePreviewEn}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 self-end sm:self-auto">
                            <button
                              type="button"
                              disabled={dateIdx === 0}
                              onClick={() => moveDepartureBatch(dateIdx, -1)}
                              className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-colors"
                              title="Move Up"
                            >
                              <IconArrowUp size={16} />
                            </button>
                            <button
                              type="button"
                              disabled={dateIdx === (activeProduct.content?.packages?.[0]?.dates || []).length - 1}
                              onClick={() => moveDepartureBatch(dateIdx, 1)}
                              className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-colors"
                              title="Move Down"
                            >
                              <IconArrowDown size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => duplicateDepartureBatch(dateIdx)}
                              className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-200 rounded-lg transition-colors"
                              title="Duplicate Batch"
                            >
                              <IconCopy size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeDepartureBatch(dateIdx)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Batch"
                            >
                              <IconTrash size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Row 1: Batch Names */}
                        <div className={`grid gap-4 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                          {(langMode === 'split' || langMode === 'en') && (
                            <FormField label="Batch Name / Month (English)" helper="e.g. July or Easter Retreat 2027">
                              <input
                                type="text"
                                value={batch.title || ""}
                                onChange={(e) => updateDepartureBatch(dateIdx, "title", e.target.value, "en")}
                                placeholder="e.g. July"
                                className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-white font-medium"
                              />
                            </FormField>
                          )}

                          {(langMode === 'split' || langMode === 'es') && (
                            <FormField label="Batch Name / Month (Español)" helper="e.g. Julio o Semana Santa 2027">
                              <input
                                type="text"
                                value={batchEs.title || ""}
                                onChange={(e) => updateDepartureBatch(dateIdx, "title", e.target.value, "es")}
                                placeholder="e.g. Julio"
                                className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-white font-medium italic"
                              />
                            </FormField>
                          )}
                        </div>

                        {/* Row 2: Date Range Picker */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-3.5 rounded-xl border border-gray-200">
                          <FormField label="Start Date">
                            <input
                              type="date"
                              value={startDate}
                              onChange={(e) => updateDepartureBatch(dateIdx, "startDate", e.target.value)}
                              className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-white"
                            />
                          </FormField>

                          <FormField label="End Date">
                            <input
                              type="date"
                              value={endDate}
                              onChange={(e) => updateDepartureBatch(dateIdx, "endDate", e.target.value)}
                              className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-white"
                            />
                          </FormField>
                        </div>

                        {/* Row 3: Availability Badge / Status with Quick Presets + Custom Text */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Quick Preset:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                { label: "AVAILABLE", en: "AVAILABLE", es: "DISPONIBLE" },
                                { label: "SPOTS AVAILABLE", en: "SPOTS AVAILABLE", es: "PLAZAS DISPONIBLES" },
                                { label: "LIMITED SPOTS", en: "LIMITED SPOTS", es: "PLAZAS LIMITADAS" },
                                { label: "FULLY BOOKED", en: "FULLY BOOKED", es: "COMPLETO" },
                                { label: "PRIVATE GROUP", en: "PRIVATE GROUP", es: "GRUPO PRIVADO" }
                              ].map((preset) => (
                                <button
                                  key={preset.label}
                                  type="button"
                                  onClick={() => {
                                    updateDepartureBatch(dateIdx, "status", preset.en, "en");
                                    updateDepartureBatch(dateIdx, "status", preset.es, "es");
                                  }}
                                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                                    statusEn === preset.en ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                                  }`}
                                >
                                  {preset.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className={`grid gap-4 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                            {(langMode === 'split' || langMode === 'en') && (
                              <FormField label="Status Badge Text (English)" helper="Custom text: e.g. ONLY 7 SPOTS AVAILABLE">
                                <input
                                  type="text"
                                  value={statusEn}
                                  onChange={(e) => updateDepartureBatch(dateIdx, "status", e.target.value, "en")}
                                  className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-white font-medium"
                                />
                              </FormField>
                            )}

                            {(langMode === 'split' || langMode === 'es') && (
                              <FormField label="Status Badge Text (Español)" helper="Texto en español: e.g. SÓLO 7 PLAZAS DISPONIBLES">
                                <input
                                  type="text"
                                  value={statusEs}
                                  onChange={(e) => updateDepartureBatch(dateIdx, "status", e.target.value, "es")}
                                  className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-white font-medium italic"
                                />
                              </FormField>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* SUB-TAB 4: PACKAGES & INCLUSIONS (RETREATS ONLY - MULTI-TIER) */}
        {/* ============================================================= */}
        {productTab === "packages" && activeProduct.type === "retreat" && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                    Pricing Packages &amp; What&apos;s Included ({(activeProduct.content?.packages || []).length} Packages)
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Configure room tiers, stay duration, pricing structure, and the list of package inclusions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addPackage}
                  className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
                >
                  <IconPlus size={16} /> Add Package Tier
                </button>
              </div>

              {/* Pricing Section Headline & Subtitle */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                  Section Header Copy
                </h4>
                <div className={`grid gap-6 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {(langMode === 'split' || langMode === 'en') && (
                    <div className="space-y-4">
                      <FormField label="Section Title (English)" helper="Heading above packages">
                        <input
                          type="text"
                          value={activeProduct.content?.pricing_title || ""}
                          onChange={(e) => updateContent("pricing_title", e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-white font-medium"
                          placeholder="e.g. Packages & Dates"
                        />
                      </FormField>
                      <FormField label="Section Subtitle (English)" helper="Subtitle above packages">
                        <input
                          type="text"
                          value={activeProduct.content?.pricing_subtitle || ""}
                          onChange={(e) => updateContent("pricing_subtitle", e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-white font-medium"
                          placeholder="e.g. Select your stay"
                        />
                      </FormField>
                    </div>
                  )}

                  {(langMode === 'split' || langMode === 'es') && (
                    <div className="space-y-4">
                      <FormField label="Section Title (Español)" helper="Título sobre los paquetes">
                        <input
                          type="text"
                          value={activeProduct.content?.pricing_title_es || ""}
                          onChange={(e) => updateContent("pricing_title_es", e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-white font-medium italic"
                          placeholder="e.g. Paquetes y Fechas"
                        />
                      </FormField>
                      <FormField label="Section Subtitle (Español)" helper="Subtítulo sobre los paquetes">
                        <input
                          type="text"
                          value={activeProduct.content?.pricing_subtitle_es || ""}
                          onChange={(e) => updateContent("pricing_subtitle_es", e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-white font-medium italic"
                          placeholder="e.g. Elige tu estancia"
                        />
                      </FormField>
                    </div>
                  )}
                </div>
              </div>

              {/* Package Tiers Repeater */}
              {(activeProduct.content?.packages || []).length === 0 ? (
                <div className="p-12 border border-dashed border-gray-200 rounded-2xl text-center space-y-3">
                  <IconBed size={32} className="mx-auto text-gray-300 stroke-1" />
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    No packages configured for this retreat. Click &quot;Add Package Tier&quot; above to create your first package.
                  </p>
                  <button
                    type="button"
                    onClick={addPackage}
                    className="text-xs font-bold uppercase tracking-wider text-black hover:underline"
                  >
                    + Create First Package Tier
                  </button>
                </div>
              ) : (
                (activeProduct.content?.packages || []).map((pkg, pkgIdx) => {
                  const maxRooms = Math.max((pkg.rooms || []).length, (pkg.rooms_es || []).length);
                  const maxInclusions = Math.max((pkg.inclusions || []).length, (pkg.inclusions_es || []).length);

                  return (
                    <div key={pkgIdx} className="bg-gray-50/60 border border-gray-200 rounded-2xl p-6 space-y-6 shadow-xs">
                      {/* Package Header Bar */}
                      <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-md bg-black text-white flex items-center justify-center text-xs font-bold">
                            {pkgIdx + 1}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                              Package Tier #{pkgIdx + 1}: {pkg.nights || "Untitled Stay"}
                            </h4>
                            <span className="text-[11px] text-gray-500">
                              {maxRooms} Room Options • {maxInclusions} Included Items
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={pkgIdx === 0}
                            onClick={() => movePackage(pkgIdx, -1)}
                            className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            title="Move Package Tier Up"
                          >
                            <IconArrowUp size={16} />
                          </button>
                          <button
                            type="button"
                            disabled={pkgIdx === (activeProduct.content?.packages || []).length - 1}
                            onClick={() => movePackage(pkgIdx, 1)}
                            className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            title="Move Package Tier Down"
                          >
                            <IconArrowDown size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => duplicatePackage(pkgIdx)}
                            className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-200 rounded-lg transition-colors"
                            title="Duplicate Package Tier"
                          >
                            <IconCopy size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removePackage(pkgIdx)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Package Tier"
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Nights & Duration */}
                      <div className={`grid gap-6 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                        {(langMode === 'split' || langMode === 'en') && (
                          <FormField label="Package Duration / Nights (English)" helper="e.g. 7 Nights All-Inclusive">
                            <input
                              type="text"
                              value={pkg.nights || ""}
                              onChange={(e) => updatePackage(pkgIdx, "nights", e.target.value)}
                              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black font-medium bg-white"
                              placeholder="e.g. 7 Nights"
                            />
                          </FormField>
                        )}

                        {(langMode === 'split' || langMode === 'es') && (
                          <FormField label="Package Duration / Nights (Español)" helper="e.g. 7 Noches Todo Incluido">
                            <input
                              type="text"
                              value={pkg.nights_es || ""}
                              onChange={(e) => updatePackage(pkgIdx, "nights_es", e.target.value)}
                              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black font-medium italic bg-white"
                              placeholder="e.g. 7 Noches"
                            />
                          </FormField>
                        )}
                      </div>

                      {/* Optional Pricing String */}
                      <div className={`grid gap-6 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                        {(langMode === 'split' || langMode === 'en') && (
                          <FormField label="Headline Starting Price (English, Optional)" helper="e.g. From $2,800 USD">
                            <input
                              type="text"
                              value={pkg.price || ""}
                              onChange={(e) => updatePackage(pkgIdx, "price", e.target.value)}
                              className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-white font-medium"
                              placeholder="e.g. From $2,800 USD"
                            />
                          </FormField>
                        )}

                        {(langMode === 'split' || langMode === 'es') && (
                          <FormField label="Headline Starting Price (Español, Optional)" helper="e.g. Desde $2.800 USD">
                            <input
                              type="text"
                              value={pkg.price_es || ""}
                              onChange={(e) => updatePackage(pkgIdx, "price_es", e.target.value)}
                              className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-white font-medium italic"
                              placeholder="e.g. Desde $2.800 USD"
                            />
                          </FormField>
                        )}
                      </div>

                      {/* Room Options */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                            Room Options ({maxRooms} items)
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

                        {Array.from({ length: maxRooms }).map((_, roomIdx) => {
                          const roomEnRaw = (pkg.rooms || [])[roomIdx];
                          const roomEsRaw = (pkg.rooms_es || [])[roomIdx];
                          const roomEn = typeof roomEnRaw === 'string' ? roomEnRaw : (roomEnRaw?.title || "");
                          const roomEs = typeof roomEsRaw === 'string' ? roomEsRaw : (roomEsRaw?.title || "");

                          return (
                            <div key={roomIdx} className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 bg-white rounded-xl items-center border border-gray-200 shadow-xs">
                              <div className="sm:col-span-5">
                                <input
                                  type="text"
                                  value={roomEn}
                                  onChange={(e) => updatePackageItem(pkgIdx, 'rooms', roomIdx, e.target.value)}
                                  placeholder="Room description in English"
                                  className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-white"
                                />
                              </div>
                              <div className="sm:col-span-5">
                                <input
                                  type="text"
                                  value={roomEs}
                                  onChange={(e) => updatePackageItem(pkgIdx, 'rooms_es', roomIdx, e.target.value)}
                                  placeholder="Opción de habitación en español"
                                  className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-white italic"
                                />
                              </div>
                              <div className="sm:col-span-2 flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  disabled={roomIdx === 0}
                                  onClick={() => movePackageItem(pkgIdx, 'rooms', roomIdx, -1)}
                                  className="p-1 text-gray-400 hover:text-black disabled:opacity-20"
                                  title="Move Up"
                                >
                                  <IconArrowUp size={14} />
                                </button>
                                <button
                                  type="button"
                                  disabled={roomIdx === maxRooms - 1}
                                  onClick={() => movePackageItem(pkgIdx, 'rooms', roomIdx, 1)}
                                  className="p-1 text-gray-400 hover:text-black disabled:opacity-20"
                                  title="Move Down"
                                >
                                  <IconArrowDown size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    removePackageItem(pkgIdx, 'rooms', roomIdx);
                                    removePackageItem(pkgIdx, 'rooms_es', roomIdx);
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-500"
                                  title="Delete Room"
                                >
                                  <IconTrash size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Inclusions List */}
                      <div className="space-y-3 pt-4 border-t border-gray-200/60">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                            What&apos;s Included ({maxInclusions} items)
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

                        {Array.from({ length: maxInclusions }).map((_, incIdx) => {
                          const incEn = (pkg.inclusions || [])[incIdx] || "";
                          const incEs = (pkg.inclusions_es || [])[incIdx] || "";

                          return (
                            <div key={incIdx} className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 bg-white rounded-xl items-center border border-gray-200 shadow-xs">
                              <div className="sm:col-span-5">
                                <input
                                  type="text"
                                  value={incEn}
                                  onChange={(e) => updatePackageItem(pkgIdx, 'inclusions', incIdx, e.target.value)}
                                  placeholder="Inclusion item in English (e.g. Daily breathwork sessions)"
                                  className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-white"
                                />
                              </div>
                              <div className="sm:col-span-5">
                                <input
                                  type="text"
                                  value={incEs}
                                  onChange={(e) => updatePackageItem(pkgIdx, 'inclusions_es', incIdx, e.target.value)}
                                  placeholder="Inclusión en español (e.g. Sesiones diarias de respiración)"
                                  className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-white italic"
                                />
                              </div>
                              <div className="sm:col-span-2 flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  disabled={incIdx === 0}
                                  onClick={() => movePackageItem(pkgIdx, 'inclusions', incIdx, -1)}
                                  className="p-1 text-gray-400 hover:text-black disabled:opacity-20"
                                  title="Move Up"
                                >
                                  <IconArrowUp size={14} />
                                </button>
                                <button
                                  type="button"
                                  disabled={incIdx === maxInclusions - 1}
                                  onClick={() => movePackageItem(pkgIdx, 'inclusions', incIdx, 1)}
                                  className="p-1 text-gray-400 hover:text-black disabled:opacity-20"
                                  title="Move Down"
                                >
                                  <IconArrowDown size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    removePackageItem(pkgIdx, 'inclusions', incIdx);
                                    removePackageItem(pkgIdx, 'inclusions_es', incIdx);
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-500"
                                  title="Delete Item"
                                >
                                  <IconTrash size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SUB-TAB 3: PROCESS & "HOW IT WORKS" (SERVICES ONLY - DYNAMIC)  */}
        {/* ============================================================== */}
        {productTab === "process" && activeProduct.type === "service" && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                    Service Process &amp; &quot;How It Works&quot; ({(activeProduct.content?.how_it_works || []).length} Steps)
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Define the step-by-step workflow (consultation, custom itinerary design, delivery, 24/7 on-trip assistance).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addServiceStep}
                  className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
                >
                  <IconPlus size={16} /> Add Process Step
                </button>
              </div>

              {/* Process Section Title */}
              <div className={`grid gap-6 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {(langMode === 'split' || langMode === 'en') && (
                  <FormField label="Process Section Heading (English)">
                    <input
                      type="text"
                      value={activeProduct.content?.how_it_works_title || ""}
                      onChange={(e) => updateContent("how_it_works_title", e.target.value)}
                      placeholder="e.g. How Does It Work?"
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black font-medium"
                    />
                  </FormField>
                )}
                {(langMode === 'split' || langMode === 'es') && (
                  <FormField label="Process Section Heading (Español)">
                    <input
                      type="text"
                      value={activeProduct.content?.how_it_works_title_es || ""}
                      onChange={(e) => updateContent("how_it_works_title_es", e.target.value)}
                      placeholder="e.g. Cómo trabajamos contigo"
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black font-medium italic"
                    />
                  </FormField>
                )}
              </div>

              {/* Steps List */}
              {(activeProduct.content?.how_it_works || []).length === 0 ? (
                <div className="p-12 border border-dashed border-gray-200 rounded-2xl text-center space-y-3">
                  <IconRoute size={32} className="mx-auto text-gray-300 stroke-1" />
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    No process steps configured yet. Click &quot;Add Process Step&quot; above to describe how you work with the client.
                  </p>
                  <button
                    type="button"
                    onClick={addServiceStep}
                    className="text-xs font-bold uppercase tracking-wider text-black hover:underline"
                  >
                    + Create First Step
                  </button>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  {(activeProduct.content?.how_it_works || []).map((step, stepIdx) => (
                    <div key={stepIdx} className="bg-gray-50/70 border border-gray-200 rounded-2xl p-5 space-y-4 shadow-xs">
                      <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                            {stepIdx + 1}
                          </span>
                          <span className="font-bold text-xs uppercase tracking-wider text-gray-800">
                            Step #{stepIdx + 1}: {step.title || "Untitled Step"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={stepIdx === 0}
                            onClick={() => moveServiceStep(stepIdx, -1)}
                            className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            title="Move Up"
                          >
                            <IconArrowUp size={16} />
                          </button>
                          <button
                            type="button"
                            disabled={stepIdx === (activeProduct.content?.how_it_works || []).length - 1}
                            onClick={() => moveServiceStep(stepIdx, 1)}
                            className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            title="Move Down"
                          >
                            <IconArrowDown size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => duplicateServiceStep(stepIdx)}
                            className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-200 rounded-lg transition-colors"
                            title="Duplicate Step"
                          >
                            <IconCopy size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeServiceStep(stepIdx)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Step"
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>
                      </div>

                      <div className={`grid gap-4 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                        {(langMode === 'split' || langMode === 'en') && (
                          <div className="space-y-3">
                            <FormField label="Step Title (English)">
                              <input
                                type="text"
                                value={step.title || ""}
                                onChange={(e) => updateServiceStep(stepIdx, "title", e.target.value)}
                                placeholder="e.g. Book your consultation."
                                className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-white font-medium"
                              />
                            </FormField>
                            <FormField label="Step Description (English)">
                              <textarea
                                rows={3}
                                value={step.description || ""}
                                onChange={(e) => updateServiceStep(stepIdx, "description", e.target.value)}
                                placeholder="Describe what happens in this step..."
                                className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-white leading-relaxed"
                              />
                            </FormField>
                          </div>
                        )}

                        {(langMode === 'split' || langMode === 'es') && (
                          <div className="space-y-3">
                            <FormField label="Step Title (Español)">
                              <input
                                type="text"
                                value={step.title_es || ""}
                                onChange={(e) => updateServiceStep(stepIdx, "title_es", e.target.value)}
                                placeholder="e.g. Reserva tu sesión."
                                className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-white font-medium italic"
                              />
                            </FormField>
                            <FormField label="Step Description (Español)">
                              <textarea
                                rows={3}
                                value={step.description_es || ""}
                                onChange={(e) => updateServiceStep(stepIdx, "description_es", e.target.value)}
                                placeholder="Describe qué ocurre en este paso..."
                                className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-white leading-relaxed italic"
                              />
                            </FormField>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SUB-TAB 4: TARGET AUDIENCE & RIGHT FOR YOU (SERVICES ONLY)     */}
        {/* ============================================================== */}
        {productTab === "audience" && activeProduct.type === "service" && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                  Target Audience &amp; &quot;Right For You&quot;
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Explain who this tailor-made travel service is intended for (couples, luxury travelers, busy professionals).
                </p>
              </div>

              <div className={`grid gap-6 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {(langMode === 'split' || langMode === 'en') && (
                  <div className="space-y-4">
                    <FormField label="Section Heading (English)">
                      <input
                        type="text"
                        value={activeProduct.content?.right_for_you_title || ""}
                        onChange={(e) => updateContent("right_for_you_title", e.target.value)}
                        placeholder="e.g. Is This Service Right for You?"
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black font-medium"
                      />
                    </FormField>

                    <FormField label="Narrative / Description (English)">
                      <textarea
                        rows={7}
                        value={activeProduct.content?.right_for_you || ""}
                        onChange={(e) => updateContent("right_for_you", e.target.value)}
                        placeholder="Describe why this service is ideal for the guest..."
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black leading-relaxed"
                      />
                    </FormField>
                  </div>
                )}

                {(langMode === 'split' || langMode === 'es') && (
                  <div className="space-y-4">
                    <FormField label="Section Heading (Español)">
                      <input
                        type="text"
                        value={activeProduct.content?.right_for_you_title_es || ""}
                        onChange={(e) => updateContent("right_for_you_title_es", e.target.value)}
                        placeholder="e.g. ¿Este servicio es para ti?"
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black font-medium italic"
                      />
                    </FormField>

                    <FormField label="Narrative / Description (Español)">
                      <textarea
                        rows={7}
                        value={activeProduct.content?.right_for_you_es || ""}
                        onChange={(e) => updateContent("right_for_you_es", e.target.value)}
                        placeholder="Describe por qué este servicio es ideal para el cliente..."
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black leading-relaxed italic"
                      />
                    </FormField>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================================== */}
        {/* SUB-TAB 5: FAQS & LOCATION */}
        {/* ===================================== */}
        {productTab === "faqs" && (
          <div className="space-y-6">
            {/* Location Section (Retreats Only) */}
            {activeProduct.type === "retreat" && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3">
                  Location &amp; Sanctuary Details
                </h3>

                <div className={`grid gap-6 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {(langMode === 'split' || langMode === 'en') && (
                    <>
                      <FormField label="Location Section Title (English)">
                        <input
                          type="text"
                          value={activeProduct.content?.location_title || ""}
                          onChange={(e) => updateContent("location_title", e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black font-medium"
                          placeholder="e.g. The Sanctuary, Bali"
                        />
                      </FormField>

                      <FormField label="Location Description (English)">
                        <textarea
                          rows={4}
                          value={activeProduct.content?.location_text || ""}
                          onChange={(e) => updateContent("location_text", e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black leading-relaxed"
                          placeholder="Describe the environment, energy, nature, and peaceful surroundings..."
                        />
                      </FormField>
                    </>
                  )}

                  {(langMode === 'split' || langMode === 'es') && (
                    <>
                      <FormField label="Location Section Title (Español)">
                        <input
                          type="text"
                          value={activeProduct.content?.location_title_es || ""}
                          onChange={(e) => updateContent("location_title_es", e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black font-medium italic"
                          placeholder="e.g. El Santuario, Bali"
                        />
                      </FormField>

                      <FormField label="Location Description (Español)">
                        <textarea
                          rows={4}
                          value={activeProduct.content?.location_text_es || ""}
                          onChange={(e) => updateContent("location_text_es", e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black leading-relaxed italic"
                          placeholder="Describe el entorno, la energía, la naturaleza y el ambiente de serenidad..."
                        />
                      </FormField>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* FAQs Accordion Manager (Dynamic List with Reorder & Collapse) */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                    Frequently Asked Questions ({(activeProduct.content?.faqs || []).length} Questions)
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Answer guest questions regarding logistics, visa policies, flights, and what to pack.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addFaqItem}
                  className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
                >
                  <IconPlus size={16} /> Add FAQ
                </button>
              </div>

              {(activeProduct.content?.faqs || []).length === 0 ? (
                <div className="p-12 border border-dashed border-gray-200 rounded-2xl text-center space-y-3">
                  <IconHelp size={32} className="mx-auto text-gray-300 stroke-1" />
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    No FAQs added for this experience yet. Click &quot;Add FAQ&quot; above to create one.
                  </p>
                  <button
                    type="button"
                    onClick={addFaqItem}
                    className="text-xs font-bold uppercase tracking-wider text-black hover:underline"
                  >
                    + Create First FAQ
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {(activeProduct.content?.faqs || []).map((faq, faqIdx) => {
                    const isExpanded = expandedFaqIndex === faqIdx;

                    return (
                      <div key={faqIdx} className="border border-gray-200 rounded-xl bg-white shadow-xs overflow-hidden">
                        <div 
                          className="flex items-center justify-between p-4 bg-gray-50/70 border-b border-gray-100 cursor-pointer select-none"
                          onClick={() => setExpandedFaqIndex(isExpanded ? null : faqIdx)}
                        >
                          <div className="flex items-center gap-2.5 truncate max-w-lg">
                            <span className="w-5 h-5 rounded-md bg-black text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                              {faqIdx + 1}
                            </span>
                            <span className="text-xs font-bold text-gray-800 truncate">
                              {faq.question || "Untitled Question"}
                            </span>
                            {faq.question_es && (
                              <span className="text-xs text-gray-400 italic hidden sm:inline truncate">
                                ({faq.question_es})
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              disabled={faqIdx === 0}
                              onClick={() => moveFaqItem(faqIdx, -1)}
                              className="p-1.5 text-gray-400 hover:text-black rounded-lg disabled:opacity-20 transition-colors"
                              title="Move Up"
                            >
                              <IconArrowUp size={15} />
                            </button>
                            <button
                              type="button"
                              disabled={faqIdx === (activeProduct.content?.faqs || []).length - 1}
                              onClick={() => moveFaqItem(faqIdx, 1)}
                              className="p-1.5 text-gray-400 hover:text-black rounded-lg disabled:opacity-20 transition-colors"
                              title="Move Down"
                            >
                              <IconArrowDown size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => duplicateFaqItem(faqIdx)}
                              className="p-1.5 text-gray-400 hover:text-black rounded-lg transition-colors"
                              title="Duplicate FAQ"
                            >
                              <IconCopy size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFaqItem(faqIdx)}
                              className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                              title="Remove FAQ"
                            >
                              <IconTrash size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setExpandedFaqIndex(isExpanded ? null : faqIdx)}
                              className="p-1.5 text-gray-500 hover:text-black rounded-lg ml-1"
                              title={isExpanded ? "Collapse" : "Expand"}
                            >
                              {isExpanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="p-5 space-y-4 bg-white border-t border-gray-100">
                            <div className={`grid gap-4 ${langMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                              {(langMode === 'split' || langMode === 'en') && (
                                <div className="space-y-2">
                                  <label className="text-xs font-bold uppercase text-gray-700">Question (English)</label>
                                  <input
                                    type="text"
                                    value={faq.question || ""}
                                    onChange={(e) => updateFaqItem(faqIdx, "question", e.target.value)}
                                    placeholder="e.g. What is the cancellation policy?"
                                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-white font-medium"
                                  />
                                  <label className="text-xs font-bold uppercase text-gray-700 block pt-1">Answer (English)</label>
                                  <textarea
                                    rows={3}
                                    value={faq.answer || ""}
                                    onChange={(e) => updateFaqItem(faqIdx, "answer", e.target.value)}
                                    placeholder="Explain clearly..."
                                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-white leading-relaxed"
                                  />
                                </div>
                              )}

                              {(langMode === 'split' || langMode === 'es') && (
                                <div className="space-y-2">
                                  <label className="text-xs font-bold uppercase text-gray-700">Pregunta (Español)</label>
                                  <input
                                    type="text"
                                    value={faq.question_es || ""}
                                    onChange={(e) => updateFaqItem(faqIdx, "question_es", e.target.value)}
                                    placeholder="e.g. ¿Cuál es la política de cancelación?"
                                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-white font-medium italic"
                                  />
                                  <label className="text-xs font-bold uppercase text-gray-700 block pt-1">Respuesta (Español)</label>
                                  <textarea
                                    rows={3}
                                    value={faq.answer_es || ""}
                                    onChange={(e) => updateFaqItem(faqIdx, "answer_es", e.target.value)}
                                    placeholder="Explica claramente en español..."
                                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-white leading-relaxed italic"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating / Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#faf6f0]/95 backdrop-blur-md border-t border-[#ebd8c0]/80 px-4 sm:px-6 md:px-8 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveProductId(null)}
              className="text-xs font-bold uppercase tracking-wider text-[#73685c] hover:text-[#1c1917] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <IconArrowLeft size={16} /> Back to Catalog
            </button>
            <span className="text-[#ebd8c0]">|</span>
            <span className="text-xs text-[#73685c] font-medium truncate hidden sm:inline">
              Editing: <strong className="text-[#1c1917]">{activeProduct.title}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {handleSave && (
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm"
              >
                <IconDeviceFloppy size={16} />
                {isSaving ? "Saving..." : "Save All Changes"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
