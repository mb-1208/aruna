"use client";

import { useState, useEffect, useRef } from "react";
import { IconLogout, IconDeviceFloppy, IconPlus, IconTrash, IconArrowLeft, IconLanguage, IconCheck, IconX, IconEye, IconInfoCircle, IconFile, IconWorld, IconKey, IconUsers, IconDownload, IconRefresh, IconDeviceMobile, IconDeviceTablet, IconDeviceLaptop, IconDeviceDesktop, IconMenu2, IconLayoutBottombar, IconMessageCircle, IconPhoto } from "@tabler/icons-react";
import { saveSiteContent, saveProducts, saveReviews, fetchLeads } from "./actions";
import TravelEditorForm from "./TravelEditorForm";
import RetreatsEditorForm from "./RetreatsEditorForm";
import ContactEditorForm from "./ContactEditorForm";
import ProductsEditorForm from "./ProductsEditorForm";
import PoliciesEditorForm from "./PoliciesEditorForm";
import LocalizationEditor from "./LocalizationEditor";

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { uploadImageToSupabase } from '@/lib/imageUpload';

const DashboardImageUpload = ({ label, value, onChange, hint }) => {
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

export default function DashboardEditor({ initialData }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home_page");
  const [currentMenu, setCurrentMenu] = useState("main");
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("/");
  const [iframeBaseUrl, setIframeBaseUrl] = useState("");
  const [deviceMode, setDeviceMode] = useState("laptop"); // phone, tablet, laptop, monitor
  const [refreshKey, setRefreshKey] = useState(0);
  const [containerWidth, setContainerWidth] = useState(1000);
  const [containerHeight, setContainerHeight] = useState(800);
  const previewContainerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const port = window.location.port ? `:${window.location.port}` : '';
      const protocol = window.location.protocol;
      
      let baseHost = hostname;
      if (hostname.startsWith('admin.')) {
        baseHost = hostname.replace('admin.', '');
      }
      setIframeBaseUrl(`${protocol}//${baseHost}${port}`);
    }
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
  }, [currentMenu]);

  // State for forms
  const [homeContent, setHomeContent] = useState(
    initialData.content.find(c => c.id === 'home_page')?.content || {}
  );
  const [travelContent, setTravelContent] = useState(
    initialData.content.find(c => c.id === 'travel_page')?.content || {}
  );
  const [retreatsContent, setRetreatsContent] = useState(
    initialData.content.find(c => c.id === 'retreats_page')?.content || {}
  );
  
  // Localization State
  const [localizationTab, setLocalizationTab] = useState("home_page");
  const [esHomeContent, setEsHomeContent] = useState(initialData.content.find(c => c.id === 'home_page_es')?.content || {});
  const [esTravelContent, setEsTravelContent] = useState(initialData.content.find(c => c.id === 'travel_page_es')?.content || {});
  const [esRetreatsContent, setEsRetreatsContent] = useState(initialData.content.find(c => c.id === 'retreats_page_es')?.content || {});
  
  // New Pages State
  const [contactContent, setContactContent] = useState(initialData.content.find(c => c.id === 'contact_page')?.content || {});
  const [esContactContent, setEsContactContent] = useState(initialData.content.find(c => c.id === 'contact_page_es')?.content || {});
  const [legalContent, setLegalContent] = useState(initialData.content.find(c => c.id === 'legal_page')?.content || {});
  const [esLegalContent, setEsLegalContent] = useState(initialData.content.find(c => c.id === 'legal_page_es')?.content || {});
  const [privacyContent, setPrivacyContent] = useState(initialData.content.find(c => c.id === 'privacy_page')?.content || {});
  const [esPrivacyContent, setEsPrivacyContent] = useState(initialData.content.find(c => c.id === 'privacy_page_es')?.content || {});

  const [products, setProducts] = useState(initialData.products || []);
  const [reviews, setReviews] = useState((initialData.reviews || []).map(r => ({
    ...r,
    bgImage: r.bg_image || r.bgImage
  })));

  // Global Information State
  const [editingLang, setEditingLang] = useState('en');
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(false);
  const [globalContent, setGlobalContent] = useState(initialData.content.find(c => c.id === 'global_settings')?.content || { title: {en:'', es:''}, description: {en:'', es:''}, additional_data: {email:'', phone:'', instagram:''}, cta: { en: {}, es: {} } });

  // Access Management State
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', full_name: '', role: 'editor' });
  
  // Subscribers State
  const [leads, setLeads] = useState(initialData.leads || []);
  const [subscriberFilter, setSubscriberFilter] = useState("All");
  const [isRefreshingLeads, setIsRefreshingLeads] = useState(false);

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

  // Fetch users when entering 'access' menu
  useEffect(() => {
    if (currentMenu === 'access') {
      fetchUsers();
    }
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    checkUser();
    
    if (currentMenu === 'information') {
      fetchGlobalContent();
    }
  }, [currentMenu]);

  const fetchGlobalContent = async () => {
    setIsLoadingGlobal(true);
    try {
      const res = await fetch('/api/admin/content?category=global_settings');
      const data = await res.json();
      if (res.ok && data.content) {
        setGlobalContent({
          title: data.content.title || { en: '', es: '' },
          description: data.content.description || { en: '', es: '' },
          additional_data: data.content.additional_data || { email: '', instagram: '', phone: '', facebook: '' },
          navbar: data.content.navbar || { en: {}, es: {} },
          footer: data.content.footer || { en: {}, es: {} },
          promo: data.content.promo || { en: {}, es: {} },
          cta: data.content.cta || { en: {}, es: {} },
          logo_url: data.content.logo_url || '',
          footer_logo_url: data.content.footer_logo_url || ''
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
      const res = await fetch('/api/admin/users');
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

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsCreatingUser(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      if (res.ok) {
        setNewUser({ email: '', password: '', full_name: '', role: 'editor' });
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
        method: 'DELETE',
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
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
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

  useEffect(() => {
    // Update preview URL based on active tab
    if (activeTab === "home_page") setPreviewUrl("/");
    if (activeTab === "travel_page") setPreviewUrl("/travel");
    if (activeTab === "retreats_page" || activeTab === "destinations") setPreviewUrl("/retreats");
    if (activeTab === "reviews") setPreviewUrl("/travel#reviews");
    if (activeTab === "contact_page") setPreviewUrl("/contact");
  }, [activeTab]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (currentMenu === "information") {
        await saveSiteContent('global_settings', globalContent);
      } else if (currentMenu === "products") {
        await saveProducts(products);
      } else if (currentMenu === "policies") {
        if (activeTab === "legal") {
          await saveSiteContent('legal_page', legalContent);
        } else if (activeTab === "privacy") {
          await saveSiteContent('privacy_page', privacyContent);
        }
      } else if (currentMenu === "pages") {
        if (activeTab === "home_page") {
          await saveSiteContent('home_page', homeContent);
        } else if (activeTab === "travel_page") {
          await saveSiteContent('travel_page', travelContent);
        } else if (activeTab === "retreats_page") {
          await saveSiteContent('retreats_page', retreatsContent);
        } else if (activeTab === "contact_page") {
          await saveSiteContent('contact_page', contactContent);
        } else if (activeTab === "reviews") {
          await saveReviews(reviews);
        }
      }
      alert("Saved successfully!");
      // Force iframe to reload by updating key (avoids cross-origin issues)
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      alert("Error saving: " + error.message);
    }
    setIsSaving(false);
  };

  const handleSaveTranslations = async () => {
    setIsSaving(true);
    try {
      if (localizationTab === "home_page") {
        await saveSiteContent('home_page_es', esHomeContent);
      } else if (localizationTab === "travel_page") {
        await saveSiteContent('travel_page_es', esTravelContent);
      } else if (localizationTab === "retreats_page") {
        await saveSiteContent('retreats_page_es', esRetreatsContent);
      } else if (localizationTab === "contact_page") {
        await saveSiteContent('contact_page_es', esContactContent);
      } else if (localizationTab === "legal_page") {
        await saveSiteContent('legal_page_es', esLegalContent);
      } else if (localizationTab === "privacy_page") {
        await saveSiteContent('privacy_page_es', esPrivacyContent);
      } else if (localizationTab === "reviews") {
        await saveReviews(reviews);
      } else if (localizationTab === "information") {
        await saveSiteContent('global_settings', globalContent);
      }
      alert("Translations saved successfully!");
      setRefreshKey(prev => prev + 1);
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
    const filteredLeads = subscriberFilter === "All" ? leads : leads.filter(lead => lead.source === subscriberFilter);
    if (filteredLeads.length === 0) return;
    
    const headers = ["Email", "Source", "Details", "Subscribed At"];
    const csvContent = [
      headers.join(","),
      ...filteredLeads.map(l => `"${l.email}","${l.source || ''}","${l.details || ''}","${new Date(l.created_at).toLocaleString()}"`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="flex lg:hidden fixed inset-0 z-[9999] bg-white flex-col items-center justify-center p-8 text-center">
        <IconDeviceDesktop size={64} className="text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold tracking-widest uppercase mb-4 text-black">Desktop Only</h2>
        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
          The Aruna CMS dashboard is highly detailed and requires a larger screen for the best experience. 
          Please access it from a desktop or laptop device.
        </p>
      </div>

      {/* Sidebar Editor */}
      <div className="hidden lg:flex flex-col w-[400px] h-full bg-white border-r border-gray-200 shadow-xl z-10 flex-shrink-0">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h1 className="text-xl font-bold tracking-widest uppercase">Aruna CMS</h1>
        </div>
        
        {currentMenu === "main" && (
          <div className="flex flex-col h-full justify-between bg-white">
            <div className="flex flex-col py-4">
              <button 
                onClick={() => setCurrentMenu("pages")}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left"
              >
                <div className="bg-gray-100 p-2 rounded-lg text-black"><IconFile size={20} /></div>
                <div>
                  <div className="font-bold uppercase tracking-widest text-sm">Pages</div>
                  <div className="text-xs text-gray-500 mt-1">Manage content for Home, Travel, and Retreats pages</div>
                </div>
              </button>
              <button 
                onClick={() => setCurrentMenu("products")}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left"
              >
                <div className="bg-gray-100 p-2 rounded-lg text-black"><IconWorld size={20} /></div>
                <div>
                  <div className="font-bold uppercase tracking-widest text-sm">Products</div>
                  <div className="text-xs text-gray-500 mt-1">Manage Retreats and Services destinations</div>
                </div>
              </button>
              <button 
                onClick={() => setCurrentMenu("subscribers")}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left"
              >
                <div className="bg-gray-100 p-2 rounded-lg text-black"><IconUsers size={20} /></div>
                <div>
                  <div className="font-bold uppercase tracking-widest text-sm">Subscribers</div>
                  <div className="text-xs text-gray-500 mt-1">Manage newsletter subscribers and leads</div>
                </div>
              </button>
              <button 
                onClick={() => setCurrentMenu("policies")}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left"
              >
                <div className="bg-gray-100 p-2 rounded-lg text-black"><IconFile size={20} /></div>
                <div>
                  <div className="font-bold uppercase tracking-widest text-sm">Policies</div>
                  <div className="text-xs text-gray-500 mt-1">Manage Legal and Privacy Policy content</div>
                </div>
              </button>
              <button 
                onClick={() => setCurrentMenu("information")}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left"
              >
                <div className="bg-gray-100 p-2 rounded-lg text-black"><IconInfoCircle size={20} /></div>
                <div>
                  <div className="font-bold uppercase tracking-widest text-sm">Information</div>
                  <div className="text-xs text-gray-500 mt-1">Global settings, logo, contact, and social links</div>
                </div>
              </button>
              <button 
                onClick={() => setCurrentMenu("localization")}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left"
              >
                <div className="bg-gray-100 p-2 rounded-lg text-black"><IconLanguage size={20} /></div>
                <div>
                  <div className="font-bold uppercase tracking-widest text-sm">Localization</div>
                  <div className="text-xs text-gray-500 mt-1">Translate website content to Spanish (ES)</div>
                </div>
              </button>
              <button 
                onClick={() => setCurrentMenu("access")}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left"
              >
                <div className="bg-gray-100 p-2 rounded-lg text-black"><IconKey size={20} /></div>
                <div>
                  <div className="font-bold uppercase tracking-widest text-sm">Access</div>
                  <div className="text-xs text-gray-500 mt-1">Manage admin users and login permissions</div>
                </div>
              </button>
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-red-600 hover:text-red-800 transition-colors cursor-pointer w-full"
              >
                <IconLogout size={18} />
                Sign Out
              </button>
            </div>
          </div>
        )}

        {currentMenu === "access" && (
          <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b border-gray-200">
              <button 
                onClick={() => setCurrentMenu("main")}
                className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
                title="Back to Main Menu"
              >
                <IconArrowLeft size={16} /> Back
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <h2 className="text-lg font-bold uppercase tracking-widest mb-4">Access</h2>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Manage your administrator accounts here. Add new users or change passwords for existing accounts.
              </p>
            </div>
          </div>
        )}

        {currentMenu === "subscribers" && (
          <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b border-gray-200">
              <button 
                onClick={() => setCurrentMenu("main")}
                className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
                title="Back to Main Menu"
              >
                <IconArrowLeft size={16} /> Back
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <h2 className="text-lg font-bold uppercase tracking-widest mb-4">Subscribers</h2>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                View all leads and email addresses collected from your website's subscription forms. Export the data to CSV for marketing campaigns.
              </p>
            </div>
          </div>
        )}



        {currentMenu === "products" && (
          <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b border-gray-200">
              <button 
                onClick={() => setCurrentMenu("main")}
                className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
                title="Back to Main Menu"
              >
                <IconArrowLeft size={16} /> Back
              </button>
            </div>
            <div className="p-6 pb-24 overflow-y-auto flex-1">
              <h2 className="text-lg font-bold uppercase tracking-widest mb-4">Products</h2>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Manage your retreats and services. Create new products, edit existing ones, and provide Spanish translations directly here.
              </p>
            </div>
          </div>
        )}

        {currentMenu === "policies" && (
          <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b border-gray-200">
              <button 
                onClick={() => setCurrentMenu("main")}
                className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
                title="Back to Main Menu"
              >
                <IconArrowLeft size={16} /> Back
              </button>
            </div>
            <div className="flex flex-col py-2">
              <button onClick={() => {setActiveTab("legal"); setPreviewUrl("/legal");}} className={`flex justify-between items-center px-6 py-4 border-l-4 transition-all ${activeTab === "legal" ? 'border-black bg-gray-50' : 'border-transparent hover:bg-gray-50 text-gray-500'}`}>
                <div className="font-bold uppercase tracking-widest text-sm">Legal</div>
              </button>
              <button onClick={() => {setActiveTab("privacy"); setPreviewUrl("/privacy");}} className={`flex justify-between items-center px-6 py-4 border-l-4 transition-all ${activeTab === "privacy" ? 'border-black bg-gray-50' : 'border-transparent hover:bg-gray-50 text-gray-500'}`}>
                <div className="font-bold uppercase tracking-widest text-sm">Privacy</div>
              </button>
            </div>
          </div>
        )}

        {currentMenu === "pages" && (
          <div className="flex flex-col h-full bg-white">
            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-gray-100 text-xs uppercase tracking-widest font-medium hide-scrollbar items-center">
              <button 
                onClick={() => setCurrentMenu("main")}
                className="px-4 py-4 text-gray-400 hover:text-black transition-colors"
                title="Back to Main Menu"
              >
                <IconArrowLeft size={18} />
              </button>
              <div className="h-6 w-px bg-gray-200 mx-1"></div>
              <button 
                onClick={() => setActiveTab("home_page")} 
                className={`px-4 py-4 whitespace-nowrap border-b-2 transition-colors ${activeTab === 'home_page' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
              >
                Home
              </button>
              <button 
                onClick={() => setActiveTab("travel_page")} 
                className={`px-4 py-4 whitespace-nowrap border-b-2 transition-colors ${activeTab === 'travel_page' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
              >
                Travel
              </button>
              <button 
                onClick={() => setActiveTab("retreats_page")} 
                className={`px-4 py-4 whitespace-nowrap border-b-2 transition-colors ${activeTab === 'retreats_page' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
              >
                Retreats
              </button>
              <button 
                onClick={() => setActiveTab("contact_page")} 
                className={`px-4 py-4 whitespace-nowrap border-b-2 transition-colors ${activeTab === 'contact_page' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
              >
                Contact
              </button>
              <button 
                onClick={() => setActiveTab("reviews")} 
                className={`px-4 py-4 whitespace-nowrap border-b-2 transition-colors ${activeTab === 'reviews' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
              >
                Reviews
              </button>
            </div>

            {/* Form Area */}
            <div className="flex-1 overflow-y-auto p-6 pb-24 bg-white">
          
          {/* Home Page Form */}
          {activeTab === "home_page" && (
            <div className="space-y-6">
              {/* Global Branding moved to Information tab */}
              <div className="mb-8 border border-gray-200 p-6 rounded-xl">
                <h3 className="text-lg font-bold mb-4">Travel Panel</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Title</label>
                    <input 
                      type="text"
                      value={homeContent.travelTitle || ""} 
                      onChange={(e) => setHomeContent({...homeContent, travelTitle: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Button Text</label>
                    <input 
                      type="text"
                      value={homeContent.travelButton || ""} 
                      onChange={(e) => setHomeContent({...homeContent, travelButton: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <DashboardImageUpload 
                    label="Image Upload" 
                    hint="1008x1080 (Square)" 
                    value={homeContent.travelImage} 
                    onChange={(val) => setHomeContent({...homeContent, travelImage: val})} 
                  />
                </div>
              </div>
              <div className="mb-8 border border-gray-200 p-6 rounded-xl">
                <h3 className="text-lg font-bold mb-4">Retreats Panel</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Title</label>
                    <input 
                      type="text"
                      value={homeContent.retreatsTitle || ""} 
                      onChange={(e) => setHomeContent({...homeContent, retreatsTitle: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Button Text</label>
                    <input 
                      type="text"
                      value={homeContent.retreatsButton || ""} 
                      onChange={(e) => setHomeContent({...homeContent, retreatsButton: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <DashboardImageUpload 
                    label="Image Upload" 
                    hint="1008x1080 (Square)" 
                    value={homeContent.retreatsImage} 
                    onChange={(val) => setHomeContent({...homeContent, retreatsImage: val})} 
                  />
                </div>
              </div>
            </div>
          )}


          {/* Travel Page Form */}
          {activeTab === "travel_page" && (
            <TravelEditorForm content={travelContent} setContent={setTravelContent} />
          )}

          {/* Retreats Page Form */}
          {activeTab === "retreats_page" && (
            <RetreatsEditorForm content={retreatsContent} setContent={setRetreatsContent} />
          )}

          {/* Contact Page Form */}
          {activeTab === "contact_page" && (
            <ContactEditorForm content={contactContent} setContent={setContactContent} />
          )}

          {/* Destinations Form */}
          {activeTab === "destinations" && (
            <div className="space-y-8">
              {destinations.map((dest, index) => (
                <div key={dest.id || index} className="p-4 border border-gray-200 rounded-xl bg-gray-50 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-2">Destination {index + 1}</h3>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                    <input type="text" value={dest.title} onChange={(e) => updateDestination(index, 'title', e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                    <input type="text" value={dest.date} onChange={(e) => updateDestination(index, 'date', e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                    <textarea rows={2} value={dest.description} onChange={(e) => updateDestination(index, 'description', e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Image URL</label>
                    <input type="text" value={dest.image_url} onChange={(e) => updateDestination(index, 'image_url', e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reviews Form */}
          {activeTab === "reviews" && (
            <div className="space-y-8">
              {reviews.map((review, index) => (
                <div key={review.id || index} className="p-4 border border-gray-200 rounded-xl bg-gray-50 space-y-4 relative group">
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
                  <h3 className="text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-2">Review ({review.category})</h3>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Author Name</label>
                    <input type="text" value={review.name} onChange={(e) => {
                      const newRev = [...reviews]; newRev[index].name = e.target.value; setReviews(newRev);
                    }} className="w-full border border-gray-300 rounded p-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Quote</label>
                    <textarea rows={3} value={review.quote} onChange={(e) => {
                      const newRev = [...reviews]; newRev[index].quote = e.target.value; setReviews(newRev);
                    }} className="w-full border border-gray-300 rounded p-2 text-sm" />
                  </div>
                  
                  <DashboardImageUpload 
                    label="Background Image (Upload)" 
                    hint="400x600 (Portrait)" 
                    value={review.bgImage} 
                    onChange={(val) => {
                      const newRev = [...reviews]; newRev[index].bgImage = val; setReviews(newRev);
                    }} 
                  />
                </div>
              ))}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => {
                    setReviews([...reviews, { id: crypto.randomUUID(), category: 'travel', name: '', quote: '', bgImage: '' }]);
                  }}
                  className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-black hover:text-gray-600 transition-colors"
                >
                  <IconPlus size={16} /> Add Travel Review
                </button>
                <button 
                  onClick={() => {
                    setReviews([...reviews, { id: crypto.randomUUID(), category: 'retreat', name: '', quote: '', bgImage: '' }]);
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
          <div className="flex flex-col h-full bg-white">
            <div className="flex border-b border-gray-100 text-xs uppercase tracking-widest font-medium items-center">
              <button 
                onClick={() => setCurrentMenu("main")}
                className="px-4 py-4 text-gray-400 hover:text-black transition-colors"
                title="Back to Main Menu"
              >
                <IconArrowLeft size={18} />
              </button>
              <div className="h-6 w-px bg-gray-200 mx-1"></div>
              <div className="px-4 py-4 font-bold">Global Information</div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 pb-24 bg-white space-y-6">
              <div className="text-sm text-gray-500 leading-relaxed">
                Manage your site-wide content and settings. Use the main panel on the right to edit SEO, contact details, footer, navbar, and promotional sections.
              </div>
            </div>
          </div>
        )}


        {currentMenu === "localization" && (
          <div className="flex flex-col h-full bg-white">
            <div className="flex border-b border-gray-100 text-xs uppercase tracking-widest font-medium items-center">
              <button 
                onClick={() => setCurrentMenu("main")}
                className="px-4 py-4 text-gray-400 hover:text-black transition-colors"
                title="Back to Main Menu"
              >
                <IconArrowLeft size={18} />
              </button>
              <div className="h-6 w-px bg-gray-200 mx-1"></div>
              <div className="px-4 py-4 font-bold">Localization</div>
            </div>
            <div className="p-6 pb-2">
              <div className="text-sm text-gray-500 leading-relaxed">
                Translate your website content. Use the split-screen editor on the right to provide Spanish (ES) translations.
              </div>
            </div>
            <div className="flex-1 overflow-y-auto pb-24">
              {[
                { id: 'home_page', label: 'Home' },
                { id: 'travel_page', label: 'Travel' },
                { id: 'retreats_page', label: 'Retreats' },
                { id: 'information', label: 'Information' },
                { id: 'reviews', label: 'Reviews' },
                { id: 'contact_page', label: 'Contact' }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setLocalizationTab(tab.id)}
                  className={`w-full text-left px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${localizationTab === tab.id ? 'bg-gray-100 text-black border-r-4 border-black' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Panel Area */}
      <div className="flex-1 h-full bg-gray-100 flex flex-col relative overflow-hidden">
        {currentMenu === "localization" ? (
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
        ) : currentMenu === "products" ? (
          <div className="flex-1 flex flex-col min-h-0 bg-gray-50">
            <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-light tracking-tight mb-1">Products Management</h2>
                <p className="text-sm text-gray-500">Manage retreats and services</p>
              </div>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full text-xs font-medium uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                <IconDeviceFloppy size={16} />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <ProductsEditorForm products={products} setProducts={setProducts} />
            </div>
          </div>
        ) : currentMenu === "policies" ? (
          <div className="flex-1 flex flex-col min-h-0 bg-gray-50">
            <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-light tracking-tight mb-1">
                  {activeTab === "legal" ? "Legal Center" : "Privacy Policy"}
                </h2>
                <p className="text-sm text-gray-500">Edit your official documentation</p>
              </div>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full text-xs font-medium uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                <IconDeviceFloppy size={16} />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full">
              <PoliciesEditorForm 
                key={activeTab}
                content={activeTab === "legal" ? legalContent : privacyContent} 
                setContent={activeTab === "legal" ? setLegalContent : setPrivacyContent} 
              />
            </div>
          </div>
        ) : currentMenu === "information" ? (
          <div className="flex-1 flex flex-col min-h-0 bg-gray-50">
            <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-light tracking-tight mb-1">Information Settings</h2>
                <p className="text-sm text-gray-500">Manage site-wide content and global settings</p>
              </div>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full text-xs font-medium uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                <IconDeviceFloppy size={16} />
                {isSaving ? "Saving..." : "Save Settings"}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 space-y-8">
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
                        <IconPhoto size={20} className="text-gray-400" /> Branding & Logo
                      </h3>
                      <div className="space-y-6">
                        <DashboardImageUpload 
                          label="Main Logo (Header)" 
                          hint="PNG or SVG with transparent background." 
                          value={globalContent?.logo_url} 
                          onChange={(val) => setGlobalContent({...globalContent, logo_url: val})} 
                        />
                        <DashboardImageUpload 
                          label="Footer Logo" 
                          hint="PNG or SVG with transparent background (Used in Footer)." 
                          value={globalContent?.footer_logo_url} 
                          onChange={(val) => setGlobalContent({...globalContent, footer_logo_url: val})} 
                        />
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm">
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <IconWorld size={20} className="text-gray-400" /> SEO & Meta Data
                      </h3>
                      <p className="text-xs text-gray-400 mb-6 italic">* Translations for these fields are managed in the Localization menu.</p>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Site Title (English)</label>
                          <input 
                            type="text" 
                            value={globalContent?.title?.en || ''}
                            onChange={(e) => setGlobalContent({...globalContent, title: {...(globalContent?.title || {}), en: e.target.value}})}
                            placeholder="e.g. Aruna Retreats"
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Site Description (English)</label>
                          <textarea 
                            rows={3}
                            value={globalContent?.description?.en || ''}
                            onChange={(e) => setGlobalContent({...globalContent, description: {...(globalContent?.description || {}), en: e.target.value}})}
                            placeholder="e.g. The best holistic retreats..."
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm">
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <IconDeviceMobile size={20} className="text-gray-400" /> Contact & Social
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                          <input 
                            type="email" 
                            value={globalContent?.footer?.en?.email || ''}
                            onChange={(e) => setGlobalContent({...globalContent, footer: {...globalContent.footer, en: {...(globalContent?.footer?.en || {}), email: e.target.value}}})}
                            placeholder="hello@aruna.com" 
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Phone Number</label>
                          <input 
                            type="text" 
                            value={globalContent?.footer?.en?.phone || ''}
                            onChange={(e) => setGlobalContent({...globalContent, footer: {...globalContent.footer, en: {...(globalContent?.footer?.en || {}), phone: e.target.value}}})}
                            placeholder="+62 812..." 
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Instagram</label>
                          <input 
                            type="text" 
                            value={globalContent?.social_links?.instagram || ''}
                            onChange={(e) => setGlobalContent({...globalContent, social_links: {...(globalContent?.social_links || {}), instagram: e.target.value}})}
                            placeholder="https://instagram.com/aruna" 
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Facebook</label>
                          <input 
                            type="text" 
                            value={globalContent?.social_links?.facebook || ''}
                            onChange={(e) => setGlobalContent({...globalContent, social_links: {...(globalContent?.social_links || {}), facebook: e.target.value}})}
                            placeholder="https://facebook.com/aruna" 
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">TikTok</label>
                          <input 
                            type="text" 
                            value={globalContent?.social_links?.tiktok || ''}
                            onChange={(e) => setGlobalContent({...globalContent, social_links: {...(globalContent?.social_links || {}), tiktok: e.target.value}})}
                            placeholder="https://tiktok.com/@aruna" 
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">WhatsApp</label>
                          <input 
                            type="text" 
                            value={globalContent?.social_links?.whatsapp || ''}
                            onChange={(e) => setGlobalContent({...globalContent, social_links: {...(globalContent?.social_links || {}), whatsapp: e.target.value}})}
                            placeholder="https://wa.me/628..." 
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm">
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <IconMenu2 size={20} className="text-gray-400" /> Navbar Links
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {['travel', 'retreats', 'reviews', 'testimonials', 'faq', 'services', 'about', 'destinations', 'gallery'].map(key => (
                          <div key={key}>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{key}</label>
                            <input type="text" value={globalContent?.navbar?.en?.[key] || ''} onChange={(e) => setGlobalContent({...globalContent, navbar: {...globalContent.navbar, en: {...(globalContent?.navbar?.en || {}), [key]: e.target.value}}})} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm">
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <IconLayoutBottombar size={20} className="text-gray-400" /> Footer Content
                      </h3>
                      <div className="space-y-4">
                        {['description', 'newsletter_title', 'newsletter_desc', 'subscribe_btn', 'retreats_newsletter_title', 'retreats_newsletter_desc', 'retreats_subscribe_btn', 'copyright', 'company_title', 'link_legal', 'link_contact', 'link_privacy'].map(key => (
                          <div key={key}>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{key.replace('_', ' ')}</label>
                            {key.includes('desc') ? (
                              <textarea rows={3} value={globalContent?.footer?.en?.[key] || ''} onChange={(e) => setGlobalContent({...globalContent, footer: {...globalContent.footer, en: {...(globalContent?.footer?.en || {}), [key]: e.target.value}}})} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors" />
                            ) : (
                              <input type="text" value={globalContent?.footer?.en?.[key] || ''} onChange={(e) => setGlobalContent({...globalContent, footer: {...globalContent.footer, en: {...(globalContent?.footer?.en || {}), [key]: e.target.value}}})} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm">
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <IconMessageCircle size={20} className="text-gray-400" /> Promo Popup & Products CTA
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
                                  checked={globalContent?.promo?.enabled !== false} 
                                  onChange={(e) => setGlobalContent({...globalContent, promo: {...(globalContent?.promo || {}), enabled: e.target.checked}})} 
                                />
                                <div className={`block w-10 h-6 rounded-full transition-colors ${globalContent?.promo?.enabled !== false ? 'bg-black' : 'bg-gray-300'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${globalContent?.promo?.enabled !== false ? 'transform translate-x-4' : ''}`}></div>
                              </div>
                              <div className="ml-3 text-xs font-bold uppercase tracking-widest text-gray-500 w-16">
                                {globalContent?.promo?.enabled !== false ? 'Enabled' : 'Disabled'}
                              </div>
                            </label>
                          </div>
                          <div className="space-y-4">
                            {['title', 'description', 'button', 'placeholder'].map(key => (
                              <div key={`promo-${key}`}>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{key}</label>
                                {key === 'description' ? (
                                  <textarea rows={2} value={globalContent?.promo?.en?.[key] || ''} onChange={(e) => setGlobalContent({...globalContent, promo: {...globalContent.promo, en: {...(globalContent?.promo?.en || {}), [key]: e.target.value}}})} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors" />
                                ) : (
                                  <input type="text" value={globalContent?.promo?.en?.[key] || ''} onChange={(e) => setGlobalContent({...globalContent, promo: {...globalContent.promo, en: {...(globalContent?.promo?.en || {}), [key]: e.target.value}}})} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold mb-4">Products CTA Section</h4>
                          <div className="space-y-4">
                            {['title', 'boxTitle', 'text', 'buttonText', 'emailLabel'].map(key => (
                              <div key={`cta-${key}`}>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                                {key === 'text' ? (
                                  <textarea rows={2} value={globalContent?.cta?.en?.[key] || ''} onChange={(e) => setGlobalContent({...globalContent, cta: {...globalContent.cta, en: {...(globalContent?.cta?.en || {}), [key]: e.target.value}}})} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors" />
                                ) : (
                                  <input type="text" value={globalContent?.cta?.en?.[key] || ''} onChange={(e) => setGlobalContent({...globalContent, cta: {...globalContent.cta, en: {...(globalContent?.cta?.en || {}), [key]: e.target.value}}})} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors" />
                                )}
                              </div>
                            ))}
                            <DashboardImageUpload 
                              label="Background Image" 
                              hint="1920x800 (Landscape)" 
                              value={globalContent?.cta?.en?.image} 
                              onChange={(val) => setGlobalContent({...globalContent, cta: {...globalContent.cta, en: {...(globalContent?.cta?.en || {}), image: val}}})} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : currentMenu === "access" ? (
          <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-gray-50">
            <div className="max-w-4xl mx-auto space-y-8">
              <div>
                <h2 className="text-3xl font-light tracking-tight mb-2">Access Management</h2>
                <p className="text-gray-500">Add, view, and remove administrator access for the Aruna CMS.</p>
              </div>

              <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
                <h3 className="text-lg font-bold mb-6">Add New Admin</h3>
                <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Full Name (Optional)</label>
                    <input 
                      type="text" 
                      value={newUser.full_name}
                      onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                      placeholder="Jane Doe" 
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      required
                      placeholder="jane@aruna.com" 
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Password</label>
                    <input 
                      type="password" 
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      required
                      placeholder="Min. 6 characters" 
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Role</label>
                    <select 
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors bg-white"
                    >
                      <option value="editor">Editor (Limited)</option>
                      <option value="owner">Owner (Full Access)</option>
                    </select>
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    <button 
                      type="submit"
                      disabled={isCreatingUser}
                      className="w-full bg-black text-white px-8 py-3 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isCreatingUser ? "Adding..." : "Add Admin"} <IconPlus size={18} />
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-lg">Admin Users</h3>
                  <div className="text-xs font-bold text-gray-500 bg-gray-200 px-3 py-1.5 rounded-md">{users.length} Users</div>
                </div>
                
                {isLoadingUsers ? (
                  <div className="p-12 text-center text-gray-400 text-sm">Loading users...</div>
                ) : users.length === 0 ? (
                  <div className="p-12 text-center text-gray-400 text-sm">No users found.</div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {users.map(user => {
                      const userRole = user.user_metadata?.role || 'editor';
                      // Find the current user in the newly fetched users list to get their true role from DB
                      const trueCurrentUser = users.find(u => u.id === currentUser?.id);
                      const currentUserRole = trueCurrentUser?.user_metadata?.role || 'owner'; 
                      
                      const isSelf = currentUser && currentUser.id === user.id;
                      const canEdit = !(currentUserRole === 'editor' && userRole === 'owner');
                      const canDelete = !isSelf && canEdit;

                      return (
                      <div key={user.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold">
                            {user.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-base flex items-center gap-2">
                              {user.user_metadata?.full_name || "Admin"}
                              {isSelf && (
                                <span className="bg-green-100 text-green-700 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold">
                                  You
                                </span>
                              )}
                              <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold border ${userRole === 'owner' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                {userRole}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 items-center">
                          {canEdit && (
                            <button 
                              onClick={() => setEditingUser({
                                id: user.id,
                                email: user.email,
                                full_name: user.user_metadata?.full_name || '',
                                role: userRole,
                                password: ''
                              })}
                              title="Edit User"
                              className="text-gray-600 hover:text-black p-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm font-medium border border-gray-200 shadow-sm bg-white"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                            </button>
                          )}
                          
                          {isSelf ? (
                            <div className="text-xs text-gray-400 font-medium px-3 py-2">
                              Cannot Delete
                            </div>
                          ) : canDelete ? (
                            <button 
                              onClick={() => handleDeleteUser(user.id, user.email)}
                              title="Delete User"
                              className="text-red-600 hover:text-white p-3 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm font-medium border border-red-200 shadow-sm bg-white"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          ) : (
                            <div className="text-xs text-gray-400 font-medium px-3 py-2 italic">
                              Protected (Owner)
                            </div>
                          )}
                        </div>
                      </div>
                    )})}
                  </div>
                )}
              </div>
            </div>

            {/* Edit User Modal */}
            {editingUser && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-md">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg">Edit Access</h3>
                    <button 
                      onClick={() => setEditingUser(null)}
                      className="text-gray-400 hover:text-black transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                  
                  <form onSubmit={handleUpdateUser} className="p-6 space-y-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        value={editingUser.email}
                        disabled
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm bg-gray-100 text-gray-500 cursor-not-allowed" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        value={editingUser.full_name}
                        onChange={(e) => setEditingUser({...editingUser, full_name: e.target.value})}
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Role</label>
                      <select 
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors bg-white"
                      >
                        <option value="editor">Editor (Limited)</option>
                        <option value="owner">Owner (Full Access)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">New Password <span className="text-gray-400 normal-case tracking-normal font-normal">(Leave blank to keep current)</span></label>
                      <input 
                        type="password" 
                        value={editingUser.password}
                        onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                        placeholder="Min. 6 characters" 
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition-colors" 
                      />
                    </div>
                    <div className="pt-4 flex gap-3">
                      <button 
                        type="button"
                        onClick={() => setEditingUser(null)}
                        className="flex-1 bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={isUpdatingUser}
                        className="flex-1 bg-black text-white px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50"
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
          <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-gray-50">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-light tracking-tight mb-2">Subscribers & Leads</h2>
                  <p className="text-gray-500">View and export all email leads collected from the website.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRefreshLeads}
                    disabled={isRefreshingLeads}
                    className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <IconRefresh size={18} className={isRefreshingLeads ? "animate-spin" : ""} /> {isRefreshingLeads ? "Refreshing..." : "Refresh"}
                  </button>
                  <button
                    onClick={handleExportCSV}
                    disabled={leads.length === 0}
                    className="bg-black text-white px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <IconDownload size={18} /> Export CSV
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">Email List</h3>
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-bold uppercase tracking-widest text-gray-500">Filter Source:</label>
                    <select
                      value={subscriberFilter}
                      onChange={(e) => setSubscriberFilter(e.target.value)}
                      className="border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-black transition-colors bg-white min-w-[150px]"
                    >
                      <option value="All">All Sources</option>
                      {Array.from(new Set(leads.map(l => l.source).filter(Boolean))).map(src => (
                        <option key={src} value={src}>{src}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 font-bold uppercase tracking-widest text-xs">
                        <th className="py-4 font-normal">Email Address</th>
                        <th className="py-4 font-normal">Source</th>
                        <th className="py-4 font-normal">Details</th>
                        <th className="py-4 font-normal">Date Subscribed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {leads
                        .filter(l => subscriberFilter === "All" || l.source === subscriberFilter)
                        .map((lead, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 text-black font-medium">{lead.email}</td>
                          <td className="py-4 text-gray-500">
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs">{lead.source || '-'}</span>
                          </td>
                          <td className="py-4 text-gray-500 max-w-[300px] truncate" title={lead.details}>{lead.details || '-'}</td>
                          <td className="py-4 text-gray-500">{new Date(lead.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {leads.length === 0 && (
                        <tr>
                          <td colSpan="4" className="py-12 text-center text-gray-400">
                            No subscribers found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Preview Toolbar */}
            <div className="h-14 border-b border-gray-200 bg-white flex items-center px-4 shadow-sm z-10 justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <IconWorld size={18} />
            <span className="font-mono bg-gray-100 px-2 py-1 rounded truncate max-w-[200px] xl:max-w-none">{iframeBaseUrl.replace('http://', '').replace('https://', '')}{previewUrl}</span>
          </div>

          {/* Device Toggles */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setDeviceMode("phone")}
              className={`p-1.5 rounded-md transition-colors ${deviceMode === 'phone' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-black'}`}
              title="Phone (375px)"
            >
              <IconDeviceMobile size={18} />
            </button>
            <button 
              onClick={() => setDeviceMode("tablet")}
              className={`p-1.5 rounded-md transition-colors ${deviceMode === 'tablet' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-black'}`}
              title="Tablet (768px)"
            >
              <IconDeviceTablet size={18} />
            </button>
            <button 
              onClick={() => setDeviceMode("laptop")}
              className={`p-1.5 rounded-md transition-colors ${deviceMode === 'laptop' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-black'}`}
              title="Laptop (1024px)"
            >
              <IconDeviceLaptop size={18} />
            </button>
            <button 
              onClick={() => setDeviceMode("monitor")}
              className={`p-1.5 rounded-md transition-colors ${deviceMode === 'monitor' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-black'}`}
              title="Monitor (Full Width)"
            >
              <IconDeviceDesktop size={18} />
            </button>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full text-xs font-medium uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 transition-colors hidden sm:flex"
          >
            <IconDeviceFloppy size={16} />
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Iframe Container */}
        <div ref={previewContainerRef} className="hidden lg:flex flex-1 w-full h-full overflow-hidden relative bg-gray-100">
          {(() => {
            let targetWidth = 1440;
            let targetHeight = 900;
            
            if (deviceMode === "phone") { targetWidth = 375; targetHeight = 812; }
            else if (deviceMode === "tablet") { targetWidth = 768; targetHeight = 1024; }
            else if (deviceMode === "laptop") { targetWidth = 1366; targetHeight = 768; }
            else if (deviceMode === "monitor") { targetWidth = 1920; targetHeight = 1080; }

            const padding = 32;
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
                  className="bg-white shadow-2xl overflow-hidden border border-gray-200 transition-all duration-300 rounded-xl"
                  style={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: `${targetWidth}px`,
                    height: `${targetHeight}px`,
                    transform: `translate(-50%, -50%) scale(${scale})`,
                    transformOrigin: 'center center'
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
    </>
  );
}
