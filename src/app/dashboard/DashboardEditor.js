"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import {
  IconLogout,
  IconDeviceFloppy,
  IconPlus,
  IconTrash,
  IconArrowLeft,
  IconLanguage,
  IconCheck,
  IconX,
  IconEye,
  IconEdit,
  IconInfoCircle,
  IconFile,
  IconWorld,
  IconKey,
  IconUsers,
  IconDownload,
  IconRefresh,
  IconDeviceMobile,
  IconDeviceTablet,
  IconDeviceLaptop,
  IconDeviceDesktop,
  IconMenu2,
  IconLayoutBottombar,
  IconMessageCircle,
  IconPhoto,
} from "@tabler/icons-react";
import {
  saveSiteContent,
  saveProducts,
  saveReviews,
  fetchLeads,
} from "./actions";
import TravelEditorForm from "./TravelEditorForm";
import RetreatsEditorForm from "./RetreatsEditorForm";
import ContactEditorForm from "./ContactEditorForm";
import ProductsEditorForm from "./ProductsEditorForm";
import PoliciesEditorForm from "./PoliciesEditorForm";
import LocalizationEditor from "./LocalizationEditor";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { uploadImageToSupabase } from "@/lib/imageUpload";

const emptySubscribe = () => () => {};
const getIframeBaseUrl = () => {
  if (typeof window === "undefined") return "";
  const hostname = window.location.hostname;
  const port = window.location.port ? `:${window.location.port}` : "";
  const protocol = window.location.protocol;
  const baseHost = hostname.startsWith("admin.")
    ? hostname.replace("admin.", "")
    : hostname;
  return `${protocol}//${baseHost}${port}`;
};

const DashboardImageUpload = ({ label, value, onChange, hint }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  return (
    <div className="mb-4">
      <div className="flex items-baseline gap-2 mb-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#63594f]">
          {label}
        </label>
        {hint && (
          <span className="text-[10px] text-[#9c9184] italic">
            Recommended: {hint}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        {value && (
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#faf6f0] shrink-0 border border-[#ebd8c0] relative group">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
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
                  setErrorMsg("");
                  const publicUrl = await uploadImageToSupabase(file);
                  onChange(publicUrl);
                } catch (err) {
                  setErrorMsg("Upload failed. Please try again.");
                  console.error(err);
                } finally {
                  setIsUploading(false);
                }
              }
            }}
            className={`block w-full text-xs text-[#786e65] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:uppercase file:tracking-wider ${isUploading ? "file:bg-stone-200 file:text-stone-400 cursor-not-allowed" : "file:bg-[#d18529] file:text-white hover:file:bg-[#b8701d] cursor-pointer"} transition-colors`}
          />
          {isUploading && (
            <div className="text-xs text-[#b8701d] mt-2 font-medium animate-pulse">
              Uploading and optimizing image...
            </div>
          )}
          {errorMsg && (
            <div className="text-xs text-red-600 mt-2 font-medium">
              {errorMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function DashboardEditor({ initialData }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home_page");
  const [currentMenu, setCurrentMenu] = useState("main");
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("/");
  const iframeBaseUrl = useSyncExternalStore(
    emptySubscribe,
    getIframeBaseUrl,
    () => "",
  );
  const [deviceMode, setDeviceMode] = useState("laptop"); // phone, tablet, laptop, monitor
  const [refreshKey, setRefreshKey] = useState(0);
  const [containerWidth, setContainerWidth] = useState(1000);
  const [containerHeight, setContainerHeight] = useState(800);
  const previewContainerRef = useRef(null);
  const [showDesktopNotice, setShowDesktopNotice] = useState(true);
  const [mobileView, setMobileView] = useState("editor"); // 'editor' | 'preview'

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDesktopNotice(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!previewContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
        setContainerHeight(entries[0].contentRect.height);
      }
    });
    observer.observe(previewContainerRef.current);
    return () => observer.disconnect();
  }, [currentMenu, mobileView]);

  // State for forms
  const [homeContent, setHomeContent] = useState(
    initialData.content.find((c) => c.id === "home_page")?.content || {},
  );
  const [travelContent, setTravelContent] = useState(
    initialData.content.find((c) => c.id === "travel_page")?.content || {},
  );
  const [retreatsContent, setRetreatsContent] = useState(
    initialData.content.find((c) => c.id === "retreats_page")?.content || {},
  );

  // Localization State
  const [localizationTab, setLocalizationTab] = useState("home_page");
  const [esHomeContent, setEsHomeContent] = useState(
    initialData.content.find((c) => c.id === "home_page_es")?.content || {},
  );
  const [esTravelContent, setEsTravelContent] = useState(
    initialData.content.find((c) => c.id === "travel_page_es")?.content || {},
  );
  const [esRetreatsContent, setEsRetreatsContent] = useState(
    initialData.content.find((c) => c.id === "retreats_page_es")?.content || {},
  );

  // New Pages State
  const [contactContent, setContactContent] = useState(
    initialData.content.find((c) => c.id === "contact_page")?.content || {},
  );
  const [esContactContent, setEsContactContent] = useState(
    initialData.content.find((c) => c.id === "contact_page_es")?.content || {},
  );
  const [legalContent, setLegalContent] = useState(
    initialData.content.find((c) => c.id === "legal_page")?.content || {},
  );
  const [esLegalContent, setEsLegalContent] = useState(
    initialData.content.find((c) => c.id === "legal_page_es")?.content || {},
  );
  const [privacyContent, setPrivacyContent] = useState(
    initialData.content.find((c) => c.id === "privacy_page")?.content || {},
  );
  const [esPrivacyContent, setEsPrivacyContent] = useState(
    initialData.content.find((c) => c.id === "privacy_page_es")?.content || {},
  );

  const [products, setProducts] = useState(initialData.products || []);
  const [reviews, setReviews] = useState(
    (initialData.reviews || []).map((r) => ({
      ...r,
      bgImage: r.bg_image || r.bgImage,
    })),
  );

  // Global Information State
  const [editingLang, setEditingLang] = useState("en");
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(false);
  const initialGlobalContent =
    initialData.content.find((c) => c.id === "global_settings")?.content || {};
  if (!initialGlobalContent.inquiry_modal) {
    initialGlobalContent.inquiry_modal = {
      en: {
        title: "Inquire Availability",
        description:
          "Leave your details and we will get back to you as soon as possible.",
        label_name: "Name",
        label_email: "Email",
        label_phone: "Phone",
        btn_submit: "Submit Inquiry",
        btn_whatsapp: "Inquire via WhatsApp",
      },
      es: {
        title: "Consultar Disponibilidad",
        description:
          "Déjanos tus datos y nos pondremos en contacto contigo lo antes posible.",
        label_name: "Nombre",
        label_email: "Correo Electrónico",
        label_phone: "Teléfono",
        btn_submit: "Enviar Consulta",
        btn_whatsapp: "Consultar por WhatsApp",
      },
    };
  }
  const [globalContent, setGlobalContent] = useState(initialGlobalContent);

  // Access Management State
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "editor",
  });

  // Subscribers State
  const [leads, setLeads] = useState(initialData.leads || []);
  const [subscriberFilter, setSubscriberFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("All");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [isRefreshingLeads, setIsRefreshingLeads] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const handleRefreshLeads = async () => {
    setIsRefreshingLeads(true);
    try {
      const data = await fetchLeads();
      setLeads(data);
    } catch (err) {
      alert("Failed to refresh leads: " + err.message);
    } finally {
      setIsRefreshingLeads(false);
    }
  };

  const [editingUser, setEditingUser] = useState(null);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);

  const fetchGlobalContent = async () => {
    setIsLoadingGlobal(true);
    try {
      const res = await fetch("/api/admin/content?category=global_settings");
      const data = await res.json();
      if (res.ok && data.content) {
        setGlobalContent({
          title: data.content.title || { en: "", es: "" },
          description: data.content.description || { en: "", es: "" },
          additional_data: data.content.additional_data || {
            email: "",
            instagram: "",
            phone: "",
            facebook: "",
          },
          navbar: data.content.navbar || { en: {}, es: {} },
          footer: data.content.footer || { en: {}, es: {} },
          promo: data.content.promo || { en: {}, es: {} },
          cta: data.content.cta || { en: {}, es: {} },
          inquiry_modal: data.content.inquiry_modal || {
            en: {
              title: "Inquire Availability",
              description:
                "Leave your details and we will get back to you as soon as possible.",
              label_name: "Name",
              label_email: "Email",
              label_phone: "Phone",
              btn_submit: "Submit Inquiry",
              btn_whatsapp: "Inquire via WhatsApp",
            },
            es: {
              title: "Consultar Disponibilidad",
              description:
                "Déjanos tus datos y nos pondremos en contacto contigo lo antes posible.",
              label_name: "Nombre",
              label_email: "Correo Electrónico",
              label_phone: "Teléfono",
              btn_submit: "Enviar Consulta",
              btn_whatsapp: "Consultar por WhatsApp",
            },
          },
          social_links: data.content.social_links || {
            facebook: "",
            instagram: "",
            tiktok: "",
            whatsapp: "",
          },
          logo_url: data.content.logo_url || "",
          footer_logo_url: data.content.footer_logo_url || "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingGlobal(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      } else {
        console.error("Failed to fetch users:", data.error);
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoadingUsers(false);
  };

  // Check logged-in admin user on mount
  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    checkUser();
  }, []);

  const navigateToMenu = (menu) => {
    setCurrentMenu(menu);
    if (menu === "pages") {
      handlePageTabChange("home_page");
    } else if (menu === "access") {
      fetchUsers();
    } else if (menu === "information") {
      fetchGlobalContent();
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsCreatingUser(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (res.ok) {
        setNewUser({ email: "", password: "", full_name: "", role: "editor" });
        alert("User created successfully!");
        fetchUsers();
      } else {
        alert("Error creating user: " + data.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
    setIsCreatingUser(false);
  };

  const handleDeleteUser = async (id, email) => {
    if (!window.confirm(`Are you sure you want to delete ${email}?`)) return;

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        alert("User deleted successfully!");
        fetchUsers();
      } else {
        alert("Error deleting user: " + data.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setIsUpdatingUser(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingUser),
      });
      const data = await res.json();
      if (res.ok) {
        setEditingUser(null);
        alert("User updated successfully!");
        fetchUsers();
      } else {
        alert("Error updating user: " + data.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsUpdatingUser(false);
    }
  };

  const handlePageTabChange = (tab) => {
    setActiveTab(tab);
    const tabUrls = {
      home_page: "/",
      travel_page: "/travel",
      retreats_page: "/retreats",
      contact_page: "/contact",
      reviews: "/travel#reviews",
      legal: "/legal",
      privacy: "/privacy",
    };
    if (tabUrls[tab]) setPreviewUrl(tabUrls[tab]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (currentMenu === "information") {
        await saveSiteContent("global_settings", globalContent);
      } else if (currentMenu === "products") {
        await saveProducts(products);
      } else if (currentMenu === "policies") {
        if (activeTab === "legal") {
          await saveSiteContent("legal_page", legalContent);
        } else if (activeTab === "privacy") {
          await saveSiteContent("privacy_page", privacyContent);
        }
      } else if (currentMenu === "pages") {
        if (activeTab === "home_page") {
          await saveSiteContent("home_page", homeContent);
        } else if (activeTab === "travel_page") {
          await saveSiteContent("travel_page", travelContent);
        } else if (activeTab === "retreats_page") {
          await saveSiteContent("retreats_page", retreatsContent);
        } else if (activeTab === "contact_page") {
          await saveSiteContent("contact_page", contactContent);
        } else if (activeTab === "reviews") {
          await saveReviews(reviews);
        }
      }
      alert("Saved successfully!");
      // Force iframe to reload by updating key (avoids cross-origin issues)
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      alert("Error saving: " + error.message);
    }
    setIsSaving(false);
  };

  const handleSaveTranslations = async () => {
    setIsSaving(true);
    try {
      if (localizationTab === "home_page") {
        await saveSiteContent("home_page_es", esHomeContent);
      } else if (localizationTab === "travel_page") {
        await saveSiteContent("travel_page_es", esTravelContent);
      } else if (localizationTab === "retreats_page") {
        await saveSiteContent("retreats_page_es", esRetreatsContent);
      } else if (localizationTab === "contact_page") {
        await saveSiteContent("contact_page_es", esContactContent);
      } else if (localizationTab === "legal_page") {
        await saveSiteContent("legal_page_es", esLegalContent);
      } else if (localizationTab === "privacy_page") {
        await saveSiteContent("privacy_page_es", esPrivacyContent);
      } else if (localizationTab === "reviews") {
        await saveReviews(reviews);
      } else if (localizationTab === "information") {
        await saveSiteContent("global_settings", globalContent);
      }
      alert("Translations saved successfully!");
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      alert("Error saving translations: " + error.message);
    }
    setIsSaving(false);
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.reload(); // Refresh the page to redirect to login
    } catch (err) {
      alert(err.message);
    }
  };

  const handleExportCSV = () => {
    const filteredLeads =
      subscriberFilter === "All"
        ? leads
        : leads.filter((lead) => lead.source === subscriberFilter);
    if (filteredLeads.length === 0) return;

    const headers = ["Email", "Source", "Details", "Subscribed At"];
    const csvContent = [
      headers.join(","),
      ...filteredLeads.map(
        (l) =>
          `"${l.email}","${l.source || ""}","${l.details || ""}","${new Date(l.created_at).toLocaleString()}"`,
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `subscribers_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isSidebarVisibleOnMobile =
    currentMenu === "main" ||
    (currentMenu === "pages" && mobileView === "editor");

  return (
    <>
      {/* Desktop Experience Tip Banner (Auto-dismisses in 5s or tap X) */}
      {showDesktopNotice && (
        <div 
          role="status"
          className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-sm z-[9999] bg-[#fdfcfb] border border-[#ebd8c0] shadow-xl rounded-2xl p-4 flex items-start gap-3.5 transition-all animate-in fade-in slide-in-from-bottom-3 duration-300 pointer-events-auto"
        >
          <div className="w-9 h-9 rounded-xl bg-[#faf4ec] text-[#b8701d] border border-[#ebd8c0] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
            <IconDeviceDesktop size={19} />
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#99611b]">
                Desktop Recommended
              </span>
              <button
                type="button"
                onClick={() => setShowDesktopNotice(false)}
                className="text-[#918374] hover:text-[#1c1917] p-1 -mr-2 -mt-1 rounded-md transition-colors cursor-pointer"
                title="Dismiss notification"
                aria-label="Dismiss notification"
              >
                <IconX size={15} />
              </button>
            </div>
            <p className="text-xs text-[#5c534a] mt-1 leading-snug">
              For the best editing experience, a desktop browser is recommended. Mobile editing is fully supported.
            </p>
          </div>
        </div>
      )}

      {/* Sidebar Editor */}
      <div className={`${isSidebarVisibleOnMobile ? "flex" : "hidden"} lg:flex flex-col w-full lg:w-[400px] h-full bg-[#fdfcfb] border-r border-[#ebd8c0]/80 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 flex-shrink-0`}>
        {/* Header */}
        <div className="p-5 px-6 border-b border-[#ebd8c0]/70 flex justify-between items-center bg-[#faf6f0]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d18529]" />
            <div>
              <h1 className="text-sm font-semibold tracking-[0.2em] uppercase text-[#1c1917]">
                Aruna Studio
              </h1>
              <span className="text-[10px] tracking-widest uppercase text-[#99611b] font-medium block">
                Content Management System
              </span>
            </div>
          </div>
          <div className="text-[10px] tracking-widest font-semibold uppercase px-2 py-0.5 rounded bg-[#feeedf] text-[#99611b] border border-[#ebd8c0]">
            v2.0
          </div>
        </div>

        {currentMenu === "main" && (
          <div className="flex flex-col h-full justify-between bg-[#fdfcfb]">
            <div className="flex flex-col py-2">
              <button
                onClick={() => {
                  setCurrentMenu("pages");
                  handlePageTabChange("home_page");
                }}
                className="group flex items-center gap-4 px-6 py-4 hover:bg-[#faf5ee] transition-all duration-200 border-b border-[#f1ebd0]/60 text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#faf4ec] text-[#b8701d] flex items-center justify-center border border-[#ecdccb] group-hover:bg-[#d18529] group-hover:text-white group-hover:border-[#d18529] transition-all duration-200 shrink-0 shadow-2xs">
                  <IconFile size={19} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold uppercase tracking-wider text-xs text-[#2c241e] group-hover:text-[#99611b] transition-colors">
                    Pages
                  </div>
                  <div className="text-[11px] text-[#80766b] mt-0.5 leading-snug">
                    Manage content for Home, Travel, and Retreats pages
                  </div>
                </div>
              </button>
              <button
                onClick={() => setCurrentMenu("products")}
                className="group flex items-center gap-4 px-6 py-4 hover:bg-[#faf5ee] transition-all duration-200 border-b border-[#f1ebd0]/60 text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#faf4ec] text-[#b8701d] flex items-center justify-center border border-[#ecdccb] group-hover:bg-[#d18529] group-hover:text-white group-hover:border-[#d18529] transition-all duration-200 shrink-0 shadow-2xs">
                  <IconWorld size={19} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold uppercase tracking-wider text-xs text-[#2c241e] group-hover:text-[#99611b] transition-colors">
                    Products
                  </div>
                  <div className="text-[11px] text-[#80766b] mt-0.5 leading-snug">
                    Manage retreat dates, packages, photos, and services
                  </div>
                </div>
              </button>
              <button
                onClick={() => setCurrentMenu("subscribers")}
                className="group flex items-center gap-4 px-6 py-4 hover:bg-[#faf5ee] transition-all duration-200 border-b border-[#f1ebd0]/60 text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#faf4ec] text-[#b8701d] flex items-center justify-center border border-[#ecdccb] group-hover:bg-[#d18529] group-hover:text-white group-hover:border-[#d18529] transition-all duration-200 shrink-0 shadow-2xs">
                  <IconUsers size={19} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold uppercase tracking-wider text-xs text-[#2c241e] group-hover:text-[#99611b] transition-colors">
                    Subscribers
                  </div>
                  <div className="text-[11px] text-[#80766b] mt-0.5 leading-snug">
                    Manage newsletter subscribers and leads
                  </div>
                </div>
              </button>
              <button
                onClick={() => setCurrentMenu("policies")}
                className="group flex items-center gap-4 px-6 py-4 hover:bg-[#faf5ee] transition-all duration-200 border-b border-[#f1ebd0]/60 text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#faf4ec] text-[#b8701d] flex items-center justify-center border border-[#ecdccb] group-hover:bg-[#d18529] group-hover:text-white group-hover:border-[#d18529] transition-all duration-200 shrink-0 shadow-2xs">
                  <IconFile size={19} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold uppercase tracking-wider text-xs text-[#2c241e] group-hover:text-[#99611b] transition-colors">
                    Policies
                  </div>
                  <div className="text-[11px] text-[#80766b] mt-0.5 leading-snug">
                    Manage Legal and Privacy Policy content
                  </div>
                </div>
              </button>
              <button
                onClick={() => navigateToMenu("information")}
                className="group flex items-center gap-4 px-6 py-4 hover:bg-[#faf5ee] transition-all duration-200 border-b border-[#f1ebd0]/60 text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#faf4ec] text-[#b8701d] flex items-center justify-center border border-[#ecdccb] group-hover:bg-[#d18529] group-hover:text-white group-hover:border-[#d18529] transition-all duration-200 shrink-0 shadow-2xs">
                  <IconInfoCircle size={19} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold uppercase tracking-wider text-xs text-[#2c241e] group-hover:text-[#99611b] transition-colors">
                    Information
                  </div>
                  <div className="text-[11px] text-[#80766b] mt-0.5 leading-snug">
                    Global settings, logo, contact, and social links
                  </div>
                </div>
              </button>
              <button
                onClick={() => setCurrentMenu("localization")}
                className="group flex items-center gap-4 px-6 py-4 hover:bg-[#faf5ee] transition-all duration-200 border-b border-[#f1ebd0]/60 text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#faf4ec] text-[#b8701d] flex items-center justify-center border border-[#ecdccb] group-hover:bg-[#d18529] group-hover:text-white group-hover:border-[#d18529] transition-all duration-200 shrink-0 shadow-2xs">
                  <IconLanguage size={19} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold uppercase tracking-wider text-xs text-[#2c241e] group-hover:text-[#99611b] transition-colors">
                    Localization
                  </div>
                  <div className="text-[11px] text-[#80766b] mt-0.5 leading-snug">
                    Translate website content to Spanish (ES)
                  </div>
                </div>
              </button>
              <button
                onClick={() => navigateToMenu("access")}
                className="group flex items-center gap-4 px-6 py-4 hover:bg-[#faf5ee] transition-all duration-200 border-b border-[#f1ebd0]/60 text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#faf4ec] text-[#b8701d] flex items-center justify-center border border-[#ecdccb] group-hover:bg-[#d18529] group-hover:text-white group-hover:border-[#d18529] transition-all duration-200 shrink-0 shadow-2xs">
                  <IconKey size={19} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold uppercase tracking-wider text-xs text-[#2c241e] group-hover:text-[#99611b] transition-colors">
                    Access
                  </div>
                  <div className="text-[11px] text-[#80766b] mt-0.5 leading-snug">
                    Manage admin users and login permissions
                  </div>
                </div>
              </button>
            </div>

            <div className="p-5 px-6 border-t border-[#ebd8c0]/70 bg-[#faf6f0]">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#993b3b] hover:text-red-700 hover:bg-red-50/70 p-2.5 rounded-lg border border-transparent hover:border-red-200/80 transition-all cursor-pointer w-full"
              >
                <IconLogout size={16} />
                Sign Out
              </button>
            </div>
          </div>
        )}

        {currentMenu === "access" && (
          <div className="flex flex-col h-full bg-[#fdfcfb]">
            <div className="p-4 px-6 border-b border-[#ebd8c0]/70 bg-[#faf6f0]/70">
              <button
                onClick={() => setCurrentMenu("main")}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#786e65] hover:text-[#b8701d] transition-colors cursor-pointer"
                title="Back to Main Menu"
              >
                <IconArrowLeft size={16} /> Back
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="inline-block text-[10px] tracking-widest uppercase font-semibold text-[#99611b] bg-[#feeedf] px-2 py-0.5 rounded border border-[#ebd8c0] mb-3">
                Settings
              </div>
              <h2 className="text-base font-semibold uppercase tracking-wider text-[#1c1917] mb-2">
                Access
              </h2>
              <p className="text-xs text-[#786e65] leading-relaxed">
                Manage your administrator accounts here. Add new users or change
                passwords for existing accounts.
              </p>
            </div>
          </div>
        )}

        {currentMenu === "subscribers" && (
          <div className="flex flex-col h-full bg-[#fdfcfb]">
            <div className="p-4 px-6 border-b border-[#ebd8c0]/70 bg-[#faf6f0]/70">
              <button
                onClick={() => setCurrentMenu("main")}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#786e65] hover:text-[#b8701d] transition-colors cursor-pointer"
                title="Back to Main Menu"
              >
                <IconArrowLeft size={16} /> Back
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="inline-block text-[10px] tracking-widest uppercase font-semibold text-[#99611b] bg-[#feeedf] px-2 py-0.5 rounded border border-[#ebd8c0] mb-3">
                Marketing
              </div>
              <h2 className="text-base font-semibold uppercase tracking-wider text-[#1c1917] mb-2">
                Subscribers
              </h2>
              <p className="text-xs text-[#786e65] leading-relaxed">
                View all leads and email addresses collected from your
                website&apos;s subscription forms. Export the data to CSV for
                marketing campaigns.
              </p>
            </div>
          </div>
        )}

        {currentMenu === "products" && (
          <div className="flex flex-col h-full bg-[#fdfcfb]">
            <div className="p-4 px-6 border-b border-[#ebd8c0]/70 bg-[#faf6f0]/70">
              <button
                onClick={() => setCurrentMenu("main")}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#786e65] hover:text-[#b8701d] transition-colors cursor-pointer"
                title="Back to Main Menu"
              >
                <IconArrowLeft size={16} /> Back
              </button>
            </div>
            <div className="p-6 pb-24 overflow-y-auto flex-1">
              <div className="inline-block text-[10px] tracking-widest uppercase font-semibold text-[#99611b] bg-[#feeedf] px-2 py-0.5 rounded border border-[#ebd8c0] mb-3">
                Catalog
              </div>
              <h2 className="text-base font-semibold uppercase tracking-wider text-[#1c1917] mb-2">
                Products
              </h2>
              <p className="text-xs text-[#786e65] leading-relaxed">
                Manage your retreats and services. Create new products, edit
                existing ones, and provide Spanish translations directly here.
              </p>
            </div>
          </div>
        )}

        {currentMenu === "policies" && (
          <div className="flex flex-col h-full bg-[#fdfcfb]">
            <div className="p-4 px-6 border-b border-[#ebd8c0]/70 bg-[#faf6f0]/70">
              <button
                onClick={() => setCurrentMenu("main")}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#786e65] hover:text-[#b8701d] transition-colors cursor-pointer"
                title="Back to Main Menu"
              >
                <IconArrowLeft size={16} /> Back
              </button>
            </div>
            <div className="flex flex-col py-2">
              <button
                onClick={() => {
                  setActiveTab("legal");
                  setPreviewUrl("/legal");
                }}
                className={`flex justify-between items-center px-6 py-3.5 border-l-2 transition-all cursor-pointer ${activeTab === "legal" ? "border-[#d18529] bg-[#faf5ee] text-[#99611b] font-semibold" : "border-transparent hover:bg-[#faf7f2] text-[#786e65]"}`}
              >
                <div className="uppercase tracking-wider text-xs">
                  Legal
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab("privacy");
                  setPreviewUrl("/privacy");
                }}
                className={`flex justify-between items-center px-6 py-3.5 border-l-2 transition-all cursor-pointer ${activeTab === "privacy" ? "border-[#d18529] bg-[#faf5ee] text-[#99611b] font-semibold" : "border-transparent hover:bg-[#faf7f2] text-[#786e65]"}`}
              >
                <div className="uppercase tracking-wider text-xs">
                  Privacy
                </div>
              </button>
            </div>
          </div>
        )}

        {currentMenu === "pages" && (
          <div className="flex flex-col h-full bg-[#fdfcfb]">
            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-[#ebd8c0]/70 text-xs uppercase tracking-wider font-medium hide-scrollbar items-center bg-[#faf6f0]/60">
              <button
                onClick={() => setCurrentMenu("main")}
                className="px-4 py-3.5 text-[#786e65] hover:text-[#b8701d] transition-colors cursor-pointer"
                title="Back to Main Menu"
              >
                <IconArrowLeft size={17} />
              </button>
              <div className="h-5 w-px bg-[#e5dbcf] mx-1"></div>
              <button
                onClick={() => handlePageTabChange("home_page")}
                className={`px-4 py-3.5 whitespace-nowrap border-b-2 text-[11px] font-semibold tracking-wider transition-colors cursor-pointer ${activeTab === "home_page" ? "border-[#d18529] text-[#99611b]" : "border-transparent text-[#786e65] hover:text-[#1c1917]"}`}
              >
                Home
              </button>
              <button
                onClick={() => handlePageTabChange("travel_page")}
                className={`px-4 py-3.5 whitespace-nowrap border-b-2 text-[11px] font-semibold tracking-wider transition-colors cursor-pointer ${activeTab === "travel_page" ? "border-[#d18529] text-[#99611b]" : "border-transparent text-[#786e65] hover:text-[#1c1917]"}`}
              >
                Travel
              </button>
              <button
                onClick={() => handlePageTabChange("retreats_page")}
                className={`px-4 py-3.5 whitespace-nowrap border-b-2 text-[11px] font-semibold tracking-wider transition-colors cursor-pointer ${activeTab === "retreats_page" ? "border-[#d18529] text-[#99611b]" : "border-transparent text-[#786e65] hover:text-[#1c1917]"}`}
              >
                Retreats
              </button>
              <button
                onClick={() => handlePageTabChange("contact_page")}
                className={`px-4 py-3.5 whitespace-nowrap border-b-2 text-[11px] font-semibold tracking-wider transition-colors cursor-pointer ${activeTab === "contact_page" ? "border-[#d18529] text-[#99611b]" : "border-transparent text-[#786e65] hover:text-[#1c1917]"}`}
              >
                Contact
              </button>
              <button
                onClick={() => handlePageTabChange("reviews")}
                className={`px-4 py-3.5 whitespace-nowrap border-b-2 text-[11px] font-semibold tracking-wider transition-colors cursor-pointer ${activeTab === "reviews" ? "border-[#d18529] text-[#99611b]" : "border-transparent text-[#786e65] hover:text-[#1c1917]"}`}
              >
                Reviews
              </button>
            </div>

            {/* Form Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-32 bg-[#fdfcfb]">
              {/* Home Page Form */}
              {activeTab === "home_page" && (
                <div className="space-y-6">
                  {/* Global Branding moved to Information tab */}
                  <div className="mb-8 border border-[#ebd8c0]/80 p-6 rounded-2xl bg-white shadow-2xs">
                    <h3 className="text-base font-semibold text-[#1c1917] mb-4">Travel Panel</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#63594f] mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={homeContent.travelTitle || ""}
                          onChange={(e) =>
                            setHomeContent({
                              ...homeContent,
                              travelTitle: e.target.value,
                            })
                          }
                          className="w-full border border-[#ebd8c0] rounded-lg p-3 text-sm focus:outline-none focus:border-[#d18529] focus:ring-1 focus:ring-[#d18529] transition-colors bg-[#faf7f3]/50 text-[#1c1917]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#63594f] mb-2">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={homeContent.travelButton || ""}
                          onChange={(e) =>
                            setHomeContent({
                              ...homeContent,
                              travelButton: e.target.value,
                            })
                          }
                          className="w-full border border-[#ebd8c0] rounded-lg p-3 text-sm focus:outline-none focus:border-[#d18529] focus:ring-1 focus:ring-[#d18529] transition-colors bg-[#faf7f3]/50 text-[#1c1917]"
                        />
                      </div>
                      <DashboardImageUpload
                        label="Image Upload"
                        hint="1008x1080 (Square)"
                        value={homeContent.travelImage}
                        onChange={(val) =>
                          setHomeContent({ ...homeContent, travelImage: val })
                        }
                      />
                    </div>
                  </div>
                  <div className="mb-8 border border-[#ebd8c0]/80 p-6 rounded-2xl bg-white shadow-2xs">
                    <h3 className="text-base font-semibold text-[#1c1917] mb-4">Retreats Panel</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#63594f] mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={homeContent.retreatsTitle || ""}
                          onChange={(e) =>
                            setHomeContent({
                              ...homeContent,
                              retreatsTitle: e.target.value,
                            })
                          }
                          className="w-full border border-[#ebd8c0] rounded-lg p-3 text-sm focus:outline-none focus:border-[#d18529] focus:ring-1 focus:ring-[#d18529] transition-colors bg-[#faf7f3]/50 text-[#1c1917]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#63594f] mb-2">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={homeContent.retreatsButton || ""}
                          onChange={(e) =>
                            setHomeContent({
                              ...homeContent,
                              retreatsButton: e.target.value,
                            })
                          }
                          className="w-full border border-[#ebd8c0] rounded-lg p-3 text-sm focus:outline-none focus:border-[#d18529] focus:ring-1 focus:ring-[#d18529] transition-colors bg-[#faf7f3]/50 text-[#1c1917]"
                        />
                      </div>
                      <DashboardImageUpload
                        label="Image Upload"
                        hint="1008x1080 (Square)"
                        value={homeContent.retreatsImage}
                        onChange={(val) =>
                          setHomeContent({ ...homeContent, retreatsImage: val })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Travel Page Form */}
              {activeTab === "travel_page" && (
                <TravelEditorForm
                  content={travelContent}
                  setContent={setTravelContent}
                />
              )}

              {/* Retreats Page Form */}
              {activeTab === "retreats_page" && (
                <RetreatsEditorForm
                  content={retreatsContent}
                  setContent={setRetreatsContent}
                />
              )}

              {/* Contact Page Form */}
              {activeTab === "contact_page" && (
                <ContactEditorForm
                  content={contactContent}
                  setContent={setContactContent}
                />
              )}

              {/* Reviews Form */}
              {activeTab === "reviews" && (
                <div className="space-y-8">
                  {reviews.map((review, index) => (
                    <div
                      key={review.id || index}
                      className="p-4 border border-gray-200 rounded-xl bg-gray-50 space-y-4 relative group"
                    >
                      <button
                        onClick={() => {
                          const newRev = [...reviews];
                          newRev.splice(index, 1);
                          setReviews(newRev);
                        }}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove Review"
                      >
                        <IconTrash size={18} />
                      </button>
                      <h3 className="text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-2">
                        Review ({review.category})
                      </h3>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Author Name
                        </label>
                        <input
                          type="text"
                          value={review.name}
                          onChange={(e) => {
                            const newRev = [...reviews];
                            newRev[index].name = e.target.value;
                            setReviews(newRev);
                          }}
                          className="w-full border border-gray-300 rounded p-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Quote
                        </label>
                        <textarea
                          rows={3}
                          value={review.quote}
                          onChange={(e) => {
                            const newRev = [...reviews];
                            newRev[index].quote = e.target.value;
                            setReviews(newRev);
                          }}
                          className="w-full border border-gray-300 rounded p-2 text-sm"
                        />
                      </div>

                      <DashboardImageUpload
                        label="Background Image (Upload)"
                        hint="400x600 (Portrait)"
                        value={review.bgImage}
                        onChange={(val) => {
                          const newRev = [...reviews];
                          newRev[index].bgImage = val;
                          setReviews(newRev);
                        }}
                      />
                    </div>
                  ))}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setReviews([
                          ...reviews,
                          {
                            id: crypto.randomUUID(),
                            category: "travel",
                            name: "",
                            quote: "",
                            bgImage: "",
                          },
                        ]);
                      }}
                      className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-black hover:text-gray-600 transition-colors"
                    >
                      <IconPlus size={16} /> Add Travel Review
                    </button>
                    <button
                      onClick={() => {
                        setReviews([
                          ...reviews,
                          {
                            id: crypto.randomUUID(),
                            category: "retreat",
                            name: "",
                            quote: "",
                            bgImage: "",
                          },
                        ]);
                      }}
                      className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-black hover:text-gray-600 transition-colors"
                    >
                      <IconPlus size={16} /> Add Retreat Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {currentMenu === "information" && (
          <div className="flex flex-col h-full bg-[#fdfcfb]">
            <div className="p-4 px-6 border-b border-[#ebd8c0]/70 bg-[#faf6f0]/70">
              <button
                onClick={() => setCurrentMenu("main")}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#786e65] hover:text-[#b8701d] transition-colors cursor-pointer"
                title="Back to Main Menu"
              >
                <IconArrowLeft size={16} /> Back
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 pb-24 bg-[#fdfcfb] space-y-6">
              <div className="inline-block text-[10px] tracking-widest uppercase font-semibold text-[#99611b] bg-[#feeedf] px-2 py-0.5 rounded border border-[#ebd8c0]">
                Settings
              </div>
              <h2 className="text-base font-semibold uppercase tracking-wider text-[#1c1917]">
                Information
              </h2>
              <div className="text-xs text-[#786e65] leading-relaxed">
                Manage your site-wide content and settings. Use the main panel
                on the right to edit SEO, contact details, footer, navbar, and
                promotional sections.
              </div>
            </div>
          </div>
        )}

        {currentMenu === "localization" && (
          <div className="flex flex-col h-full bg-[#fdfcfb]">
            <div className="flex border-b border-[#ebd8c0]/70 text-xs uppercase tracking-wider font-medium items-center bg-[#faf6f0]/60">
              <button
                onClick={() => setCurrentMenu("main")}
                className="px-4 py-3.5 text-[#786e65] hover:text-[#b8701d] transition-colors cursor-pointer"
                title="Back to Main Menu"
              >
                <IconArrowLeft size={17} />
              </button>
              <div className="h-5 w-px bg-[#e5dbcf] mx-1"></div>
              <div className="px-3 py-3.5 font-semibold text-xs tracking-wider text-[#1c1917]">
                Localization
              </div>
            </div>
            <div className="p-6 pb-2">
              <div className="text-xs text-[#786e65] leading-relaxed">
                Translate your website content. Use the split-screen editor on
                the right to provide Spanish (ES) translations.
              </div>
            </div>
            <div className="flex-1 overflow-y-auto pb-24">
              {[
                { id: "home_page", label: "Home" },
                { id: "travel_page", label: "Travel" },
                { id: "retreats_page", label: "Retreats" },
                { id: "information", label: "Information" },
                { id: "reviews", label: "Reviews" },
                { id: "contact_page", label: "Contact" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setLocalizationTab(tab.id)}
                  className={`w-full text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${localizationTab === tab.id ? "bg-[#faf5ee] text-[#99611b] border-r-2 border-[#d18529]" : "text-[#786e65] hover:bg-[#faf7f2] hover:text-[#1c1917]"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Panel Area */}
      <div className={`${!isSidebarVisibleOnMobile ? "flex" : "hidden"} lg:flex flex-1 h-full bg-[#fbf9f5] flex-col relative overflow-hidden`}>
        {currentMenu === "localization" ? (
          <div className="flex-1 flex flex-col min-h-0 bg-[#fbf9f5]">
            {/* Mobile Header for Localization */}
            <div className="lg:hidden bg-[#faf6f0] border-b border-[#ebd8c0]/80 p-4 shrink-0">
              <button
                type="button"
                onClick={() => setCurrentMenu("main")}
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#786e65] hover:text-[#b8701d] mb-3 cursor-pointer"
              >
                <IconArrowLeft size={16} /> Main Menu
              </button>
              <div className="flex overflow-x-auto gap-1 pb-1 -mx-4 px-4 hide-scrollbar">
                {[
                  { id: "home_page", label: "Home" },
                  { id: "travel_page", label: "Travel" },
                  { id: "retreats_page", label: "Retreats" },
                  { id: "information", label: "Information" },
                  { id: "reviews", label: "Reviews" },
                  { id: "contact_page", label: "Contact" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setLocalizationTab(tab.id)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                      localizationTab === tab.id
                        ? "bg-[#d18529] text-white shadow-xs"
                        : "bg-[#faf4ec] text-[#786e65] border border-[#ebd8c0]/60"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 min-h-0 relative">
              <LocalizationEditor
                localizationTab={localizationTab}
                setLocalizationTab={setLocalizationTab}
                homeContent={homeContent}
                esHomeContent={esHomeContent}
                setEsHomeContent={setEsHomeContent}
                travelContent={travelContent}
                esTravelContent={esTravelContent}
                setEsTravelContent={setEsTravelContent}
                retreatsContent={retreatsContent}
                esRetreatsContent={esRetreatsContent}
                setEsRetreatsContent={setEsRetreatsContent}
                contactContent={contactContent}
                esContactContent={esContactContent}
                setEsContactContent={setEsContactContent}
                legalContent={legalContent}
                esLegalContent={esLegalContent}
                setEsLegalContent={setEsLegalContent}
                privacyContent={privacyContent}
                esPrivacyContent={esPrivacyContent}
                setEsPrivacyContent={setEsPrivacyContent}
                globalContent={globalContent}
                setGlobalContent={setGlobalContent}
                reviews={reviews}
                setReviews={setReviews}
                isSaving={isSaving}
                handleSaveTranslations={handleSaveTranslations}
              />
            </div>
          </div>
        ) : currentMenu === "products" ? (
          <div className="flex-1 flex flex-col min-h-0 bg-[#fbf9f5] overflow-x-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 bg-[#faf6f0]/95 backdrop-blur-xs border-b border-[#ebd8c0]/80 sticky top-0 z-10 gap-3">
              <div>
                <button
                  type="button"
                  onClick={() => setCurrentMenu("main")}
                  className="lg:hidden flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#786e65] hover:text-[#b8701d] mb-1.5 cursor-pointer"
                >
                  <IconArrowLeft size={16} /> Main Menu
                </button>
                <h2 className="text-xl font-light tracking-wide text-[#1c1917] mb-1">
                  Products Management
                </h2>
                <p className="text-xs text-[#786e65]">
                  Manage retreats, packages, dates, and services
                </p>
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 bg-[#d18529] hover:bg-[#b8701d] text-white px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider shadow-xs hover:shadow disabled:opacity-50 transition-all cursor-pointer self-start sm:self-auto"
              >
                <IconDeviceFloppy size={16} />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-6 min-w-0">
              <ProductsEditorForm
                products={products}
                setProducts={setProducts}
              />
            </div>
          </div>
        ) : currentMenu === "policies" ? (
          <div className="flex-1 flex flex-col min-h-0 bg-[#fbf9f5]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 bg-[#faf6f0]/95 backdrop-blur-xs border-b border-[#ebd8c0]/80 sticky top-0 z-10 gap-3">
              <div>
                <button
                  type="button"
                  onClick={() => setCurrentMenu("main")}
                  className="lg:hidden flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#786e65] hover:text-[#b8701d] mb-1.5 cursor-pointer"
                >
                  <IconArrowLeft size={16} /> Main Menu
                </button>
                <h2 className="text-xl font-light tracking-wide text-[#1c1917] mb-1">
                  {activeTab === "legal" ? "Legal Center" : "Privacy Policy"}
                </h2>
                <p className="text-xs text-[#786e65]">
                  Edit your official documentation and policies
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Mobile Policies Switcher */}
                <div className="lg:hidden flex items-center bg-[#faf4ec] p-0.5 rounded-lg border border-[#ebd8c0]">
                  <button
                    type="button"
                    onClick={() => { setActiveTab("legal"); setPreviewUrl("/legal"); }}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === "legal" ? "bg-[#d18529] text-white shadow-xs" : "text-[#786e65]"
                    }`}
                  >
                    Legal
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveTab("privacy"); setPreviewUrl("/privacy"); }}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === "privacy" ? "bg-[#d18529] text-white shadow-xs" : "text-[#786e65]"
                    }`}
                  >
                    Privacy
                  </button>
                </div>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-[#d18529] hover:bg-[#b8701d] text-white px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider shadow-xs hover:shadow disabled:opacity-50 transition-all cursor-pointer"
                >
                  <IconDeviceFloppy size={16} />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full">
              <PoliciesEditorForm
                key={activeTab}
                content={activeTab === "legal" ? legalContent : privacyContent}
                setContent={
                  activeTab === "legal" ? setLegalContent : setPrivacyContent
                }
              />
            </div>
          </div>
        ) : currentMenu === "information" ? (
          <div className="flex-1 flex flex-col min-h-0 bg-[#fbf9f5]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 bg-[#faf6f0]/95 backdrop-blur-xs border-b border-[#ebd8c0]/80 sticky top-0 z-10 gap-3">
              <div>
                <button
                  type="button"
                  onClick={() => setCurrentMenu("main")}
                  className="lg:hidden flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#786e65] hover:text-[#b8701d] mb-1.5 cursor-pointer"
                >
                  <IconArrowLeft size={16} /> Main Menu
                </button>
                <h2 className="text-xl font-light tracking-wide text-[#1c1917] mb-1">
                  Information Settings
                </h2>
                <p className="text-xs text-[#786e65]">
                  Manage site-wide content and global settings
                </p>
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 bg-[#d18529] hover:bg-[#b8701d] text-white px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider shadow-xs hover:shadow disabled:opacity-50 transition-all cursor-pointer self-start sm:self-auto"
              >
                <IconDeviceFloppy size={16} />
                {isSaving ? "Saving..." : "Save Settings"}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8">
              <div className="max-w-4xl mx-auto space-y-8">
                {isLoadingGlobal ? (
                  <div className="animate-pulse space-y-8">
                    <div className="h-40 bg-gray-200 rounded-xl"></div>
                    <div className="h-40 bg-gray-200 rounded-xl"></div>
                  </div>
                ) : (
                  <>
                    <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm">
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <IconPhoto size={20} className="text-gray-400" />{" "}
                        Branding & Logo
                      </h3>
                      <div className="space-y-6">
                        <DashboardImageUpload
                          label="Main Logo (Header)"
                          hint="PNG or SVG with transparent background."
                          value={globalContent?.logo_url}
                          onChange={(val) =>
                            setGlobalContent({
                              ...globalContent,
                              logo_url: val,
                            })
                          }
                        />
                        <DashboardImageUpload
                          label="Footer Logo"
                          hint="PNG or SVG with transparent background (Used in Footer)."
                          value={globalContent?.footer_logo_url}
                          onChange={(val) =>
                            setGlobalContent({
                              ...globalContent,
                              footer_logo_url: val,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm">
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <IconWorld size={20} className="text-gray-400" /> SEO &
                        Meta Data
                      </h3>
                      <p className="text-xs text-gray-400 mb-6 italic">
                        * Translations for these fields are managed in the
                        Localization menu.
                      </p>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                            Site Title (English)
                          </label>
                          <input
                            type="text"
                            value={globalContent?.title?.en || ""}
                            onChange={(e) =>
                              setGlobalContent({
                                ...globalContent,
                                title: {
                                  ...(globalContent?.title || {}),
                                  en: e.target.value,
                                },
                              })
                            }
                            placeholder="e.g. Aruna Retreats"
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                            Site Description (English)
                          </label>
                          <textarea
                            rows={3}
                            value={globalContent?.description?.en || ""}
                            onChange={(e) =>
                              setGlobalContent({
                                ...globalContent,
                                description: {
                                  ...(globalContent?.description || {}),
                                  en: e.target.value,
                                },
                              })
                            }
                            placeholder="e.g. The best holistic retreats..."
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm">
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <IconDeviceMobile size={20} className="text-gray-400" />{" "}
                        Contact & Social
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={globalContent?.footer?.en?.email || ""}
                            onChange={(e) =>
                              setGlobalContent({
                                ...globalContent,
                                footer: {
                                  ...globalContent.footer,
                                  en: {
                                    ...(globalContent?.footer?.en || {}),
                                    email: e.target.value,
                                  },
                                },
                              })
                            }
                            placeholder="hello@arunatravelstudio.com"
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            value={globalContent?.footer?.en?.phone || ""}
                            onChange={(e) =>
                              setGlobalContent({
                                ...globalContent,
                                footer: {
                                  ...globalContent.footer,
                                  en: {
                                    ...(globalContent?.footer?.en || {}),
                                    phone: e.target.value,
                                  },
                                },
                              })
                            }
                            placeholder="+62 812..."
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                            Instagram
                          </label>
                          <input
                            type="text"
                            value={globalContent?.social_links?.instagram || ""}
                            onChange={(e) =>
                              setGlobalContent({
                                ...globalContent,
                                social_links: {
                                  ...(globalContent?.social_links || {}),
                                  instagram: e.target.value,
                                },
                              })
                            }
                            placeholder="https://instagram.com/aruna"
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                            Facebook
                          </label>
                          <input
                            type="text"
                            value={globalContent?.social_links?.facebook || ""}
                            onChange={(e) =>
                              setGlobalContent({
                                ...globalContent,
                                social_links: {
                                  ...(globalContent?.social_links || {}),
                                  facebook: e.target.value,
                                },
                              })
                            }
                            placeholder="https://facebook.com/aruna"
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                            TikTok
                          </label>
                          <input
                            type="text"
                            value={globalContent?.social_links?.tiktok || ""}
                            onChange={(e) =>
                              setGlobalContent({
                                ...globalContent,
                                social_links: {
                                  ...(globalContent?.social_links || {}),
                                  tiktok: e.target.value,
                                },
                              })
                            }
                            placeholder="https://tiktok.com/@aruna"
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                            WhatsApp
                          </label>
                          <input
                            type="text"
                            value={globalContent?.social_links?.whatsapp || ""}
                            onChange={(e) =>
                              setGlobalContent({
                                ...globalContent,
                                social_links: {
                                  ...(globalContent?.social_links || {}),
                                  whatsapp: e.target.value,
                                },
                              })
                            }
                            placeholder="https://wa.me/628..."
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm">
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <IconMenu2 size={20} className="text-gray-400" /> Navbar
                        Links
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          "travel",
                          "retreats",
                          "reviews",
                          "testimonials",
                          "faq",
                          "services",
                          "about",
                          "destinations",
                          "gallery",
                        ].map((key) => (
                          <div key={key}>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                              {key}
                            </label>
                            <input
                              type="text"
                              value={globalContent?.navbar?.en?.[key] || ""}
                              onChange={(e) =>
                                setGlobalContent({
                                  ...globalContent,
                                  navbar: {
                                    ...globalContent.navbar,
                                    en: {
                                      ...(globalContent?.navbar?.en || {}),
                                      [key]: e.target.value,
                                    },
                                  },
                                })
                              }
                              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm">
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <IconLayoutBottombar
                          size={20}
                          className="text-gray-400"
                        />{" "}
                        Footer Content
                      </h3>
                      <div className="space-y-4">
                        {[
                          "description",
                          "newsletter_title",
                          "newsletter_desc",
                          "subscribe_btn",
                          "retreats_newsletter_title",
                          "retreats_newsletter_desc",
                          "retreats_subscribe_btn",
                          "copyright",
                          "company_title",
                          "link_legal",
                          "link_contact",
                          "link_privacy",
                        ].map((key) => (
                          <div key={key}>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                              {key.replace("_", " ")}
                            </label>
                            {key.includes("desc") ? (
                              <textarea
                                rows={3}
                                value={globalContent?.footer?.en?.[key] || ""}
                                onChange={(e) =>
                                  setGlobalContent({
                                    ...globalContent,
                                    footer: {
                                      ...globalContent.footer,
                                      en: {
                                        ...(globalContent?.footer?.en || {}),
                                        [key]: e.target.value,
                                      },
                                    },
                                  })
                                }
                                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors"
                              />
                            ) : (
                              <input
                                type="text"
                                value={globalContent?.footer?.en?.[key] || ""}
                                onChange={(e) =>
                                  setGlobalContent({
                                    ...globalContent,
                                    footer: {
                                      ...globalContent.footer,
                                      en: {
                                        ...(globalContent?.footer?.en || {}),
                                        [key]: e.target.value,
                                      },
                                    },
                                  })
                                }
                                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm">
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <IconMessageCircle
                          size={20}
                          className="text-gray-400"
                        />{" "}
                        Promo Popup & Products CTA
                      </h3>
                      <div className="space-y-8">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold">Promo Popup</h4>
                            <label className="flex items-center cursor-pointer">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  className="sr-only"
                                  checked={
                                    globalContent?.promo?.enabled !== false
                                  }
                                  onChange={(e) =>
                                    setGlobalContent({
                                      ...globalContent,
                                      promo: {
                                        ...(globalContent?.promo || {}),
                                        enabled: e.target.checked,
                                      },
                                    })
                                  }
                                />
                                <div
                                  className={`block w-10 h-6 rounded-full transition-colors ${globalContent?.promo?.enabled !== false ? "bg-black" : "bg-gray-300"}`}
                                ></div>
                                <div
                                  className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${globalContent?.promo?.enabled !== false ? "transform translate-x-4" : ""}`}
                                ></div>
                              </div>
                              <div className="ml-3 text-xs font-bold uppercase tracking-widest text-gray-500 w-16">
                                {globalContent?.promo?.enabled !== false
                                  ? "Enabled"
                                  : "Disabled"}
                              </div>
                            </label>
                          </div>
                          <div className="space-y-4">
                            {[
                              "title",
                              "description",
                              "button",
                              "placeholder",
                            ].map((key) => (
                              <div key={`promo-${key}`}>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                  {key}
                                </label>
                                {key === "description" ? (
                                  <textarea
                                    rows={2}
                                    value={
                                      globalContent?.promo?.en?.[key] || ""
                                    }
                                    onChange={(e) =>
                                      setGlobalContent({
                                        ...globalContent,
                                        promo: {
                                          ...globalContent.promo,
                                          en: {
                                            ...(globalContent?.promo?.en || {}),
                                            [key]: e.target.value,
                                          },
                                        },
                                      })
                                    }
                                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors"
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    value={
                                      globalContent?.promo?.en?.[key] || ""
                                    }
                                    onChange={(e) =>
                                      setGlobalContent({
                                        ...globalContent,
                                        promo: {
                                          ...globalContent.promo,
                                          en: {
                                            ...(globalContent?.promo?.en || {}),
                                            [key]: e.target.value,
                                          },
                                        },
                                      })
                                    }
                                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold mb-4">
                            Products CTA Section
                          </h4>
                          <div className="space-y-4">
                            {[
                              "title",
                              "boxTitle",
                              "text",
                              "buttonText",
                              "emailLabel",
                            ].map((key) => (
                              <div key={`cta-${key}`}>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </label>
                                {key === "text" ? (
                                  <textarea
                                    rows={2}
                                    value={globalContent?.cta?.en?.[key] || ""}
                                    onChange={(e) =>
                                      setGlobalContent({
                                        ...globalContent,
                                        cta: {
                                          ...globalContent.cta,
                                          en: {
                                            ...(globalContent?.cta?.en || {}),
                                            [key]: e.target.value,
                                          },
                                        },
                                      })
                                    }
                                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors"
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    value={globalContent?.cta?.en?.[key] || ""}
                                    onChange={(e) =>
                                      setGlobalContent({
                                        ...globalContent,
                                        cta: {
                                          ...globalContent.cta,
                                          en: {
                                            ...(globalContent?.cta?.en || {}),
                                            [key]: e.target.value,
                                          },
                                        },
                                      })
                                    }
                                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors"
                                  />
                                )}
                              </div>
                            ))}
                            <DashboardImageUpload
                              label="Background Image"
                              hint="1920x800 (Landscape)"
                              value={globalContent?.cta?.en?.image}
                              onChange={(val) =>
                                setGlobalContent({
                                  ...globalContent,
                                  cta: {
                                    ...globalContent.cta,
                                    en: {
                                      ...(globalContent?.cta?.en || {}),
                                      image: val,
                                    },
                                  },
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm">
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <IconMessageCircle
                          size={20}
                          className="text-gray-400"
                        />{" "}
                        Inquiry Modal
                      </h3>
                      <div className="space-y-4">
                        {[
                          "title",
                          "description",
                          "label_name",
                          "label_email",
                          "label_phone",
                          "btn_submit",
                          "btn_whatsapp",
                        ].map((key) => (
                          <div key={`inquiry-${key}`}>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                              {key.replace("_", " ")}
                            </label>
                            {key === "description" ? (
                              <textarea
                                rows={2}
                                value={
                                  globalContent?.inquiry_modal?.en?.[key] || ""
                                }
                                onChange={(e) =>
                                  setGlobalContent({
                                    ...globalContent,
                                    inquiry_modal: {
                                      ...globalContent.inquiry_modal,
                                      en: {
                                        ...(globalContent?.inquiry_modal?.en ||
                                          {}),
                                        [key]: e.target.value,
                                      },
                                    },
                                  })
                                }
                                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors"
                              />
                            ) : (
                              <input
                                type="text"
                                value={
                                  globalContent?.inquiry_modal?.en?.[key] || ""
                                }
                                onChange={(e) =>
                                  setGlobalContent({
                                    ...globalContent,
                                    inquiry_modal: {
                                      ...globalContent.inquiry_modal,
                                      en: {
                                        ...(globalContent?.inquiry_modal?.en ||
                                          {}),
                                        [key]: e.target.value,
                                      },
                                    },
                                  })
                                }
                                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : currentMenu === "access" ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 bg-[#fbf9f5]">
            <div className="max-w-4xl mx-auto space-y-8">
              <div>
                <button
                  type="button"
                  onClick={() => setCurrentMenu("main")}
                  className="lg:hidden flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#786e65] hover:text-[#b8701d] mb-3 cursor-pointer"
                >
                  <IconArrowLeft size={16} /> Main Menu
                </button>
                <h2 className="text-2xl sm:text-3xl font-light tracking-wide text-[#1c1917] mb-2">
                  Access Management
                </h2>
                <p className="text-[#786e65] text-sm">
                  Add, view, and remove administrator access for the Aruna CMS.
                </p>
              </div>

              <div className="bg-white border border-[#ebd8c0]/80 p-8 rounded-2xl shadow-2xs">
                <h3 className="text-base font-semibold text-[#1c1917] mb-6">Add New Admin</h3>
                <form
                  onSubmit={handleCreateUser}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#63594f] mb-2">
                      Full Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={newUser.full_name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, full_name: e.target.value })
                      }
                      placeholder="Jane Doe"
                      className="w-full border border-[#ebd8c0] rounded-lg p-3 text-sm focus:outline-none focus:border-[#d18529] focus:ring-1 focus:ring-[#d18529] transition-colors bg-[#faf7f3]/50 text-[#1c1917]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#63594f] mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      required
                      placeholder="jane@arunatravelstudio.com"
                      className="w-full border border-[#ebd8c0] rounded-lg p-3 text-sm focus:outline-none focus:border-[#d18529] focus:ring-1 focus:ring-[#d18529] transition-colors bg-[#faf7f3]/50 text-[#1c1917]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#63594f] mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                      required
                      placeholder="Min. 6 characters"
                      className="w-full border border-[#ebd8c0] rounded-lg p-3 text-sm focus:outline-none focus:border-[#d18529] focus:ring-1 focus:ring-[#d18529] transition-colors bg-[#faf7f3]/50 text-[#1c1917]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#63594f] mb-2">
                      Role
                    </label>
                    <select
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                      }
                      className="w-full border border-[#ebd8c0] rounded-lg p-3 text-sm focus:outline-none focus:border-[#d18529] focus:ring-1 focus:ring-[#d18529] transition-colors bg-[#faf7f3]/50 text-[#1c1917]"
                    >
                      <option value="editor">Editor (Limited)</option>
                      <option value="owner">Owner (Full Access)</option>
                    </select>
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    <button
                      type="submit"
                      disabled={isCreatingUser}
                      className="w-full bg-[#d18529] hover:bg-[#b8701d] text-white px-8 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {isCreatingUser ? "Adding..." : "Add Admin"}{" "}
                      <IconPlus size={16} />
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white border border-[#ebd8c0]/80 rounded-2xl shadow-2xs overflow-hidden">
                <div className="p-6 border-b border-[#ebd8c0]/70 flex justify-between items-center bg-[#faf6f0]">
                  <h3 className="font-semibold text-base text-[#1c1917]">Admin Users</h3>
                  <div className="text-xs font-semibold text-[#99611b] bg-[#feeedf] border border-[#ebd8c0] px-3 py-1 rounded-md">
                    {users.length} Users
                  </div>
                </div>

                {isLoadingUsers ? (
                  <div className="p-12 text-center text-[#9c9184] text-xs">
                    Loading users...
                  </div>
                ) : users.length === 0 ? (
                  <div className="p-12 text-center text-[#9c9184] text-xs">
                    No users found.
                  </div>
                ) : (
                  <div className="divide-y divide-[#f2ebe2]">
                    {users.map((user) => {
                      const userRole = user.user_metadata?.role || "editor";
                      const trueCurrentUser = users.find(
                        (u) => u.id === currentUser?.id,
                      );
                      const currentUserRole =
                        trueCurrentUser?.user_metadata?.role || "owner";

                      const isSelf = currentUser && currentUser.id === user.id;
                      const canEdit = !(
                        currentUserRole === "editor" && userRole === "owner"
                      );
                      const canDelete = !isSelf && canEdit;

                      return (
                        <div
                          key={user.id}
                          className="p-6 flex justify-between items-center hover:bg-[#faf6f0]/60 transition-colors group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-full bg-[#faf4ec] text-[#b8701d] border border-[#ebd8c0] flex items-center justify-center text-sm font-semibold">
                              {user.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-[#1c1917] flex items-center gap-2">
                                {user.user_metadata?.full_name || "Admin"}
                                {isSelf && (
                                  <span className="bg-[#feeedf] text-[#99611b] text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-semibold border border-[#ebd8c0]">
                                    You
                                  </span>
                                )}
                                <span
                                  className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-semibold border ${userRole === "owner" ? "bg-[#feeedf] text-[#99611b] border-[#ebd8c0]" : "bg-stone-100 text-stone-600 border-stone-200"}`}
                                >
                                  {userRole}
                                </span>
                              </div>
                              <div className="text-xs text-[#786e65] mt-0.5">
                                {user.email}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 items-center">
                            {canEdit && (
                              <button
                                onClick={() =>
                                  setEditingUser({
                                    id: user.id,
                                    email: user.email,
                                    full_name:
                                      user.user_metadata?.full_name || "",
                                    role: userRole,
                                    password: "",
                                  })
                                }
                                title="Edit User"
                                className="text-[#786e65] hover:text-[#99611b] p-2 rounded-lg hover:bg-[#faf6f0] transition-colors flex items-center gap-1.5 text-xs font-semibold border border-[#ebd8c0] bg-white cursor-pointer"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M12 20h9"></path>
                                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                </svg>
                                <span>Edit</span>
                              </button>
                            )}

                            {isSelf ? (
                              <div className="text-xs text-[#9c9184] font-medium px-3 py-2">
                                Cannot Delete
                              </div>
                            ) : canDelete ? (
                              <button
                                onClick={() =>
                                  handleDeleteUser(user.id, user.email)
                                }
                                title="Delete User"
                                className="text-red-600 hover:text-white p-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1.5 text-xs font-semibold border border-red-200 bg-white cursor-pointer"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M3 6h18"></path>
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                </svg>
                                <span className="hidden sm:inline">Delete</span>
                              </button>
                            ) : (
                              <div className="text-xs text-[#9c9184] font-medium px-3 py-2 italic">
                                Protected (Owner)
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Edit User Modal */}
            {editingUser && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-xs px-4">
                <div className="bg-[#fdfcfb] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-[#ebd8c0] animate-in fade-in zoom-in duration-200">
                  <div className="p-6 border-b border-[#ebd8c0]/70 flex justify-between items-center bg-[#faf6f0]">
                    <h3 className="font-semibold text-base text-[#1c1917]">Edit Access</h3>
                    <button
                      onClick={() => setEditingUser(null)}
                      className="text-[#786e65] hover:text-[#1c1917] transition-colors cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleUpdateUser} className="p-6 space-y-5 bg-[#fdfcfb]">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#63594f] mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={editingUser.email}
                        disabled
                        className="w-full border border-[#ebd8c0] rounded-lg p-2.5 text-sm bg-stone-100/70 text-stone-500 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#63594f] mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editingUser.full_name}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            full_name: e.target.value,
                          })
                        }
                        className="w-full border border-[#ebd8c0] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#d18529] focus:ring-1 focus:ring-[#d18529] transition-colors bg-[#faf7f3]/50 text-[#1c1917]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#63594f] mb-1.5">
                        Role
                      </label>
                      <select
                        value={editingUser.role}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            role: e.target.value,
                          })
                        }
                        className="w-full border border-[#ebd8c0] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#d18529] focus:ring-1 focus:ring-[#d18529] transition-colors bg-[#faf7f3]/50 text-[#1c1917]"
                      >
                        <option value="editor">Editor (Limited)</option>
                        <option value="owner">Owner (Full Access)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#63594f] mb-1.5">
                        New Password{" "}
                        <span className="text-[#9c9184] normal-case tracking-normal font-normal">
                          (Leave blank to keep current)
                        </span>
                      </label>
                      <input
                        type="password"
                        value={editingUser.password}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            password: e.target.value,
                          })
                        }
                        placeholder="Min. 6 characters"
                        className="w-full border border-[#ebd8c0] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#d18529] focus:ring-1 focus:ring-[#d18529] transition-colors bg-[#faf7f3]/50 text-[#1c1917]"
                      />
                    </div>
                    <div className="pt-3 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingUser(null)}
                        className="flex-1 bg-white border border-[#ebd8c0] text-[#5c534a] px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#faf6f0] transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUpdatingUser}
                        className="flex-1 bg-[#d18529] hover:bg-[#b8701d] text-white px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider shadow-xs hover:shadow transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isUpdatingUser ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : currentMenu === "subscribers" ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 bg-[#fbf9f5]">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                <div>
                  <button
                    type="button"
                    onClick={() => setCurrentMenu("main")}
                    className="lg:hidden flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#786e65] hover:text-[#b8701d] mb-3 cursor-pointer"
                  >
                    <IconArrowLeft size={16} /> Main Menu
                  </button>
                  <h2 className="text-2xl sm:text-3xl font-light tracking-wide text-[#1c1917] mb-2">
                    Subscribers & Leads
                  </h2>
                  <p className="text-[#786e65] text-sm">
                    View and export all email leads collected from the website.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRefreshLeads}
                    disabled={isRefreshingLeads}
                    className="bg-white border border-[#ebd8c0] text-[#5c534a] px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#faf6f0] transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <IconRefresh
                      size={17}
                      className={isRefreshingLeads ? "animate-spin" : ""}
                    />{" "}
                    {isRefreshingLeads ? "Refreshing..." : "Refresh"}
                  </button>
                  <button
                    onClick={handleExportCSV}
                    disabled={leads.length === 0}
                    className="bg-[#d18529] hover:bg-[#b8701d] text-white px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider shadow-xs hover:shadow transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <IconDownload size={17} /> Export CSV
                  </button>
                </div>
              </div>

              <div className="bg-white border border-[#ebd8c0]/80 p-8 rounded-2xl shadow-2xs">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h3 className="text-base font-semibold text-[#1c1917]">Email List</h3>
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Search email or details..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border border-[#ebd8c0] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#d18529] focus:ring-1 focus:ring-[#d18529] transition-colors bg-[#faf7f3]/50 text-[#1c1917] flex-1 min-w-[200px]"
                    />
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="border border-[#ebd8c0] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#d18529] focus:ring-1 focus:ring-[#d18529] transition-colors bg-[#faf7f3]/50 text-[#1c1917]"
                    >
                      <option value="All">All Time</option>
                      <option value="Today">Today</option>
                      <option value="7Days">Last 7 Days</option>
                      <option value="30Days">Last 30 Days</option>
                      <option value="Custom">Custom Range</option>
                    </select>
                    {dateFilter === "Custom" && (
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className="border border-[#ebd8c0] rounded-lg p-2 text-xs focus:outline-none focus:border-[#d18529] focus:ring-1 focus:ring-[#d18529] transition-colors bg-[#faf7f3]/50 text-[#1c1917]"
                        />
                        <span className="text-[#a89d91]">-</span>
                        <input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          className="border border-[#ebd8c0] rounded-lg p-2 text-xs focus:outline-none focus:border-[#d18529] focus:ring-1 focus:ring-[#d18529] transition-colors bg-[#faf7f3]/50 text-[#1c1917]"
                        />
                      </div>
                    )}
                    <select
                      value={subscriberFilter}
                      onChange={(e) => setSubscriberFilter(e.target.value)}
                      className="border border-[#ebd8c0] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#d18529] focus:ring-1 focus:ring-[#d18529] transition-colors bg-[#faf7f3]/50 text-[#1c1917] min-w-[150px]"
                    >
                      <option value="All">All Sources</option>
                      {Array.from(
                        new Set(leads.map((l) => l.source).filter(Boolean)),
                      ).map((src) => (
                        <option key={src} value={src}>
                          {src}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#ebd8c0]/80 text-[#786e65] font-semibold uppercase tracking-wider text-[11px] bg-[#faf6f0]/50">
                        <th className="py-3.5 px-3 font-normal">Email Address</th>
                        <th className="py-3.5 px-3 font-normal">Source</th>
                        <th className="py-3.5 px-3 font-normal">Details</th>
                        <th className="py-3.5 px-3 font-normal">Date Received</th>
                        <th className="py-3.5 px-3 font-normal text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f2ebe2]">
                      {leads
                        .filter(
                          (l) =>
                            subscriberFilter === "All" ||
                            l.source === subscriberFilter,
                        )
                        .filter((l) => {
                          if (dateFilter === "All") return true;
                          const leadDate = new Date(l.created_at);
                          const now = new Date();
                          const diffTime = Math.abs(now - leadDate);
                          const diffDays = Math.ceil(
                            diffTime / (1000 * 60 * 60 * 24),
                          );
                          if (dateFilter === "Today") return diffDays <= 1;
                          if (dateFilter === "7Days") return diffDays <= 7;
                          if (dateFilter === "30Days") return diffDays <= 30;
                          if (dateFilter === "Custom") {
                            if (!customStartDate && !customEndDate) return true;

                            // Reset time component of leadDate for accurate comparison
                            const lDate = new Date(leadDate);
                            lDate.setHours(0, 0, 0, 0);

                            if (customStartDate) {
                              const sDate = new Date(customStartDate);
                              sDate.setHours(0, 0, 0, 0);
                              if (lDate < sDate) return false;
                            }
                            if (customEndDate) {
                              const eDate = new Date(customEndDate);
                              eDate.setHours(23, 59, 59, 999);
                              if (lDate > eDate) return false;
                            }
                            return true;
                          }
                          return true;
                        })
                        .filter((l) => {
                          if (!searchQuery) return true;
                          const q = searchQuery.toLowerCase();
                          return (
                            (l.email && l.email.toLowerCase().includes(q)) ||
                            (l.details && l.details.toLowerCase().includes(q))
                          );
                        })
                        .map((lead, i) => (
                          <tr
                            key={i}
                            className="hover:bg-[#faf6f0]/60 transition-colors"
                          >
                            <td className="py-4 px-3 text-[#1c1917] font-medium">
                              {lead.email}
                            </td>
                            <td className="py-4 px-3 text-[#786e65]">
                              <span className="px-2 py-0.5 bg-[#feeedf] text-[#99611b] border border-[#ebd8c0] rounded text-xs font-medium">
                                {lead.source || "-"}
                              </span>
                            </td>
                            <td
                              className="py-4 px-3 text-[#786e65] max-w-[300px] truncate text-xs"
                              title={lead.details}
                            >
                              {lead.details || "-"}
                            </td>
                            <td className="py-4 px-3 text-[#786e65] text-xs">
                              {new Date(lead.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-3 text-right">
                              <button
                                onClick={() => setSelectedLead(lead)}
                                className="text-[#786e65] hover:text-[#99611b] p-1.5 rounded-md hover:bg-[#faf6f0] transition-colors inline-flex cursor-pointer"
                                title="View Details"
                              >
                                <IconEye size={17} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      {leads.length === 0 && (
                        <tr>
                          <td
                            colSpan="5"
                            className="py-12 text-center text-[#9c9184]"
                          >
                            No subscribers found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Lead Details Modal */}
            {selectedLead && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-xs px-4">
                <div className="bg-[#fdfcfb] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-[#ebd8c0] animate-in fade-in zoom-in duration-200">
                  <div className="p-6 border-b border-[#ebd8c0]/70 flex justify-between items-center bg-[#faf6f0]">
                    <h3 className="font-semibold text-base text-[#1c1917]">Lead Details</h3>
                    <button
                      onClick={() => setSelectedLead(null)}
                      className="text-[#786e65] hover:text-[#1c1917] transition-colors cursor-pointer"
                    >
                      <IconX size={19} />
                    </button>
                  </div>
                  <div className="p-6 space-y-5 bg-[#fdfcfb]">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-xs font-semibold uppercase tracking-wider text-[#63594f] mb-1">
                          Email
                        </span>
                        <div className="font-medium text-sm text-[#1c1917] break-all">
                          {selectedLead.email}
                        </div>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold uppercase tracking-wider text-[#63594f] mb-1">
                          Date
                        </span>
                        <div className="font-medium text-sm text-[#1c1917]">
                          {new Date(selectedLead.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wider text-[#63594f] mb-1">
                        Source
                      </span>
                      <div className="font-medium text-sm">
                        <span className="px-2 py-0.5 bg-[#feeedf] text-[#99611b] border border-[#ebd8c0] rounded text-xs font-medium">
                          {selectedLead.source || "-"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wider text-[#63594f] mb-2">
                        Submitted Data
                      </span>
                      <div className="bg-[#faf6f0] p-4 rounded-xl text-xs text-[#5c534a] whitespace-pre-wrap break-words border border-[#ebd8c0] font-mono leading-relaxed max-h-[300px] overflow-y-auto">
                        {selectedLead.details ||
                          "No additional details provided."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Preview Toolbar */}
            <div className="h-14 border-b border-[#ebd8c0]/80 bg-[#faf6f0] flex items-center px-5 z-10 justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5 text-[#786e65] text-xs">
                <IconWorld size={17} className="text-[#99611b]" />
                <span className="font-mono bg-[#f4ebe1] px-2.5 py-1 rounded-md border border-[#ebd8c0] text-[#5c534a] text-xs truncate max-w-[200px] xl:max-w-none">
                  {iframeBaseUrl.replace("http://", "").replace("https://", "")}
                  {previewUrl}
                </span>
              </div>

              {/* Device Toggles */}
              <div className="flex items-center bg-[#efe6db] rounded-lg p-0.5 border border-[#e2d6c7]">
                <button
                  onClick={() => setDeviceMode("phone")}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${deviceMode === "phone" ? "bg-white shadow-2xs text-[#99611b]" : "text-[#8a8075] hover:text-[#1c1917]"}`}
                  title="Phone (375px)"
                >
                  <IconDeviceMobile size={17} />
                </button>
                <button
                  onClick={() => setDeviceMode("tablet")}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${deviceMode === "tablet" ? "bg-white shadow-2xs text-[#99611b]" : "text-[#8a8075] hover:text-[#1c1917]"}`}
                  title="Tablet (768px)"
                >
                  <IconDeviceTablet size={17} />
                </button>
                <button
                  onClick={() => setDeviceMode("laptop")}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${deviceMode === "laptop" ? "bg-white shadow-2xs text-[#99611b]" : "text-[#8a8075] hover:text-[#1c1917]"}`}
                  title="Laptop (1024px)"
                >
                  <IconDeviceLaptop size={17} />
                </button>
                <button
                  onClick={() => setDeviceMode("monitor")}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${deviceMode === "monitor" ? "bg-white shadow-2xs text-[#99611b]" : "text-[#8a8075] hover:text-[#1c1917]"}`}
                  title="Monitor (Full Width)"
                >
                  <IconDeviceDesktop size={17} />
                </button>
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-[#d18529] hover:bg-[#b8701d] text-white px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider shadow-xs hover:shadow disabled:opacity-50 transition-all cursor-pointer hidden sm:flex"
              >
                <IconDeviceFloppy size={16} />
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>

            {/* Iframe Container */}
            <div
              ref={previewContainerRef}
              className="flex flex-1 w-full h-full overflow-hidden relative bg-[#1c1a17]"
            >
              {(() => {
                let targetWidth = 1440;
                let targetHeight = 900;

                if (deviceMode === "phone") {
                  targetWidth = 375;
                  targetHeight = 812;
                } else if (deviceMode === "tablet") {
                  targetWidth = 768;
                  targetHeight = 1024;
                } else if (deviceMode === "laptop") {
                  targetWidth = 1366;
                  targetHeight = 768;
                } else if (deviceMode === "monitor") {
                  targetWidth = 1920;
                  targetHeight = 1080;
                }

                const padding = containerWidth < 640 ? 16 : 32;
                const availableWidth = containerWidth - padding;
                const availableHeight = containerHeight - padding;

                let scale = 1;
                if (availableWidth > 0 && availableHeight > 0) {
                  const scaleX = availableWidth / targetWidth;
                  const scaleY = availableHeight / targetHeight;
                  scale = Math.min(scaleX, scaleY, 1);
                }

                return (
                  <div className="absolute inset-0 overflow-hidden">
                    <div
                      className="bg-white shadow-2xl overflow-hidden border border-[#38332c] transition-all duration-300 rounded-xl"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: `${targetWidth}px`,
                        height: `${targetHeight}px`,
                        transform: `translate(-50%, -50%) scale(${scale})`,
                        transformOrigin: "center center",
                      }}
                    >
                      <iframe
                        key={refreshKey}
                        id="preview-frame"
                        src={`${iframeBaseUrl}${previewUrl}`}
                        className="w-full h-full border-none bg-white"
                        title="Live Preview"
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          </>
        )}
      </div>

      {/* Mobile View Toggle Pill: Only on mobile (< lg) when editing pages */}
      {currentMenu === "pages" && (
        <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#1c1a17]/95 backdrop-blur-xs text-white p-1 rounded-full shadow-2xl flex items-center border border-[#38332c] gap-1">
          <button
            type="button"
            onClick={() => setMobileView("editor")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              mobileView === "editor" 
                ? "bg-[#d18529] text-white shadow-xs" 
                : "text-[#d6c7b2] hover:text-white"
            }`}
          >
            <IconEdit size={14} /> Form Editor
          </button>
          <button
            type="button"
            onClick={() => setMobileView("preview")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              mobileView === "preview" 
                ? "bg-[#d18529] text-white shadow-xs" 
                : "text-[#d6c7b2] hover:text-white"
            }`}
          >
            <IconEye size={14} /> Live Preview
          </button>
        </div>
      )}
    </>
  );
}
