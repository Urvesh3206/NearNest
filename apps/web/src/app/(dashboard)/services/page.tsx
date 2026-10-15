"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Star, MapPin, Briefcase, Clock,
  ShieldCheck, X, DollarSign, Plus, CheckCircle2, Navigation, Phone, Calendar,
  Home, ArrowLeft, ChevronRight, Trash2, Loader2, Mail, Send, ExternalLink, MessageSquare, Check
} from "lucide-react";
import Link from "next/link";
import { Badge, Button } from "@/components/ui";
import { useAuth } from "@/providers/AuthProvider";
import toast from "react-hot-toast";

const CATEGORIES = ["All", "Electrician", "Plumber", "Maid", "Cook", "Tutor", "AC Repair", "Carpenter", "Painter", "Yoga Trainer", "Babysitter", "RO Repair", "Driver", "Mechanic"];

const NEIGHBORHOODS = [
  "All Locations",
  "Greenfield Park",
  "Riverside Heights",
  "Downtown Central",
  "Maplewood West",
  "Sunnyvale"
];

const PROVIDERS = [
  {
    id: "1",
    name: "Rajesh Kumar",
    category: "Electrician",
    location: "Greenfield Park",
    distance: "0.3 km",
    verified: true,
    rating: 4.9,
    reviews: 120,
    rate: "₹250/hr",
    experience: "8 years",
    availableToday: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh&backgroundColor=c0aede",
    speciality: "Wiring, circuit breaker repair, smart home switches & lighting installation",
    phone: "+91 98220 11445",
    email: "rajesh.kumar.electrician@gmail.com"
  },
  {
    id: "2",
    name: "Sunita Devi",
    category: "Maid",
    location: "Riverside Heights",
    distance: "0.5 km",
    verified: true,
    rating: 4.7,
    reviews: 85,
    rate: "₹3,000/mo",
    experience: "5 years",
    availableToday: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sunita&backgroundColor=ffdfbf",
    speciality: "Deep house cleaning, dusting, dishwashing, laundry & organization",
    phone: "+91 97654 32100",
    email: "sunita.devi.services@gmail.com"
  },
  {
    id: "3",
    name: "Amit Patel",
    category: "Plumber",
    location: "Downtown Central",
    distance: "0.9 km",
    verified: true,
    rating: 4.8,
    reviews: 94,
    rate: "₹300/hr",
    experience: "7 years",
    availableToday: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit&backgroundColor=b6e3f4",
    speciality: "Leak detection, pipe fitting, faucet replacement, drainage unclogging",
    phone: "+91 94223 88990",
    email: "amit.patel.plumbing@gmail.com"
  },
  {
    id: "4",
    name: "Elena Rostova",
    category: "Tutor",
    location: "Maplewood West",
    distance: "1.2 km",
    verified: true,
    rating: 5.0,
    reviews: 64,
    rate: "₹500/hr",
    experience: "6 years",
    availableToday: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=ffd5dc",
    speciality: "K-12 Math, AP Physics, Chemistry & competitive exam preparation",
    phone: "+91 91234 56789",
    email: "elena.rostova.tutor@gmail.com"
  },
  {
    id: "5",
    name: "Vikram Singh",
    category: "AC Repair",
    location: "Greenfield Park",
    distance: "0.6 km",
    verified: true,
    rating: 4.8,
    reviews: 110,
    rate: "₹499/visit",
    experience: "10 years",
    availableToday: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram&backgroundColor=d1fae5",
    speciality: "HVAC maintenance, gas refill, compressor fixing & filter sanitization",
    phone: "+91 98901 23456",
    email: "vikram.singh.acrepair@gmail.com"
  },
  {
    id: "6",
    name: "Priya Sharma",
    category: "Yoga Trainer",
    location: "Riverside Heights",
    distance: "0.7 km",
    verified: true,
    rating: 4.9,
    reviews: 76,
    rate: "₹400/session",
    experience: "4 years",
    availableToday: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=fef3c7",
    speciality: "Hatha yoga, Pranayama, morning mobility, back pain relief & meditation",
    phone: "+91 93245 67890",
    email: "priya.sharma.yoga@gmail.com"
  },
  {
    id: "7",
    name: "Michael Chen",
    category: "Carpenter",
    location: "Downtown Central",
    distance: "0.8 km",
    verified: true,
    rating: 4.7,
    reviews: 58,
    rate: "₹350/hr",
    experience: "9 years",
    availableToday: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=e2e8f0",
    speciality: "Custom furniture repair, door lock installation, kitchen cabinets & woodwork",
    phone: "+91 99887 76655",
    email: "michael.chen.woodwork@gmail.com"
  },
  {
    id: "8",
    name: "Sarah Jenkins",
    category: "Babysitter",
    location: "Greenfield Park",
    distance: "0.4 km",
    verified: true,
    rating: 5.0,
    reviews: 82,
    rate: "₹200/hr",
    experience: "5 years",
    availableToday: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=ede9fe",
    speciality: "Certified CPR, infant care, creative playtime, homework help & cooking",
    phone: "+91 98765 43210",
    email: "sarah.jenkins.care@gmail.com"
  }
];


function ServicesContent() {
  const searchParams = useSearchParams();
  const initialLocation = searchParams.get("location") || "All Locations";
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All";

  const { user } = useAuth();
  const [customServices, setCustomServices] = useState<any[]>([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(initialLocation);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [bookingProvider, setBookingProvider] = useState<any>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Booking Form State
  const [bookingService, setBookingService] = useState("");
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [bookingTime, setBookingTime] = useState("10:00");
  const [bookingSociety, setBookingSociety] = useState((user as any)?.society || "Greenfield Residency");
  const [bookingUnit, setBookingUnit] = useState((user as any)?.unit || "Flat 402, Tower B");
  const [bookingResidentName, setBookingResidentName] = useState(user?.name || "Resident Member");
  const [bookingPhone, setBookingPhone] = useState(user?.phone || "+91 98765 43210");
  const [bookingResidentEmail, setBookingResidentEmail] = useState(user?.email || "resident@nearnest.com");
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookedDetails, setBookedDetails] = useState<any>(null);

  // Form state for adding provider
  const [srvName, setSrvName] = useState(user?.name || "");
  const [srvCategory, setSrvCategory] = useState("Electrician");
  const [srvNeighborhood, setSrvNeighborhood] = useState("Greenfield Park");
  const [srvRate, setSrvRate] = useState("₹350/hr");
  const [srvExperience, setSrvExperience] = useState("4 years");
  const [srvPhone, setSrvPhone] = useState(user?.phone || "+91 93735 71631");
  const [srvEmail, setSrvEmail] = useState(user?.email || "");
  const [srvSpeciality, setSrvSpeciality] = useState("");
  const [isSubmittingSrv, setIsSubmittingSrv] = useState(false);

  // Load custom services from database on mount
  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data.success && Array.isArray(data.services) && data.services.length > 0) {
          setCustomServices(data.services);
          localStorage.setItem('nearnest_custom_services', JSON.stringify(data.services));
          return;
        }
      } catch (err) {
        console.warn('Error fetching services from API:', err);
      }
      try {
        const stored = localStorage.getItem('nearnest_custom_services');
        if (stored) {
          setCustomServices(JSON.parse(stored));
        }
      } catch (e) {}
    }
    loadServices();
  }, []);

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    setIsSubmittingSrv(true);
    try {
      const isAdmin = user?.role === 'ADMIN';
      const payload = {
        name: srvName,
        category: srvCategory,
        location: srvNeighborhood,
        rate: srvRate,
        experience: srvExperience,
        speciality: srvSpeciality || `Professional ${srvCategory} services with neighborhood warranty and quick response`,
        phone: srvPhone,
        email: srvEmail || `${srvName.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
        avatar: user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(srvName)}&backgroundColor=b6e3f4`,
        isAdmin,
        submittedBy: `${user?.name || srvName} (${user?.role || 'Resident'})`,
      };

      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success && result.service) {
        const updated = [result.service, ...customServices.filter(s => s.id !== result.service.id)];
        setCustomServices(updated);
        localStorage.setItem('nearnest_custom_services', JSON.stringify(updated));
        if (result.service.status === 'APPROVED') {
          toast.success(`Service Provider "${result.service.name}" verified & published live! 🎉`);
        } else {
          toast.success(`Application sent to Admin Urvesh Rane for verification! Once approved, your profile will be published live.`, {
            duration: 6000,
            icon: '📋',
          });
        }
      } else {
        throw new Error(result.error || "Save failed");
      }
    } catch (err) {
      const isPlatformAdmin = user?.role === 'ADMIN';
      const fallbackSrv = {
        id: `srv_custom_${Date.now()}`,
        name: srvName,
        category: srvCategory,
        location: srvNeighborhood,
        distance: "0.2 km",
        verified: isPlatformAdmin,
        status: isPlatformAdmin ? 'APPROVED' : 'PENDING',
        rating: 5.0,
        reviews: 0,
        rate: srvRate,
        experience: srvExperience,
        availableToday: true,
        avatar: user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(srvName)}&backgroundColor=b6e3f4`,
        speciality: srvSpeciality || `Professional ${srvCategory} services with neighborhood warranty and quick response`,
        phone: srvPhone,
        email: srvEmail || `${srvName.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
        isCustom: true,
        submittedBy: `${user?.name || srvName} (${user?.role || 'Resident'})`,
      };
      const updated = [fallbackSrv, ...customServices];
      setCustomServices(updated);
      localStorage.setItem('nearnest_custom_services', JSON.stringify(updated));
      toast.success(isPlatformAdmin ? `"${fallbackSrv.name}" registered and published!` : `Request sent to Admin for approval!`);
    } finally {
      setIsSubmittingSrv(false);
      setIsJoinModalOpen(false);
      setSrvSpeciality("");
    }
  };

  const handleDeleteService = async (srvId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the service directory?`)) return;
    try {
      await fetch(`/api/services?id=${srvId}`, { method: 'DELETE' });
    } catch (e) {}
    const updated = customServices.filter(s => s.id !== srvId);
    setCustomServices(updated);
    localStorage.setItem('nearnest_custom_services', JSON.stringify(updated));
    toast.success(`"${name}" removed from database`);
  };

  useEffect(() => {
    if (initialLocation && initialLocation !== "All Locations") {
      setSelectedNeighborhood(initialLocation);
    }
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
    if (initialCategory && initialCategory !== "All") {
      setActiveCategory(initialCategory);
    }
  }, [initialLocation, initialSearch, initialCategory]);

  const allProviders = [...customServices, ...PROVIDERS];

  const filteredProviders = allProviders.filter(p => {
    // Hide unapproved/rejected custom providers from general public, unless viewer is Admin or the submitter
    if (p.isCustom && p.status === 'PENDING') {
      const isOwner = user?.name && (p.submittedBy?.includes(user.name) || p.name === user.name);
      const isPlatformAdmin = user?.role === 'ADMIN';
      if (!isOwner && !isPlatformAdmin) return false;
    }
    if (p.isCustom && p.status === 'REJECTED') {
      return false;
    }

    if (selectedNeighborhood !== "All Locations" && !p.location.toLowerCase().includes(selectedNeighborhood.toLowerCase())) {
      return false;
    }
    if (activeCategory !== "All" && p.category.toLowerCase() !== activeCategory.toLowerCase()) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.speciality.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openBookingModal = (provider: any) => {
    setBookingProvider(provider);
    setBookingSuccess(false);
    setBookedDetails(null);
    setBookingService("");
    if (user?.name) setBookingResidentName(user.name);
    if (user?.phone) setBookingPhone(user.phone);
    if (user?.email) setBookingResidentEmail(user.email);
    if ((user as any)?.society) setBookingSociety((user as any).society);
    if ((user as any)?.unit) setBookingUnit((user as any).unit);
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingService.trim()) {
      toast.error("Please enter the service details required");
      return;
    }
    if (!bookingUnit.trim()) {
      toast.error("Please enter your flat or unit address");
      return;
    }
    setIsSubmittingBooking(true);
    try {
      const payload = {
        providerId: bookingProvider?.id,
        providerName: bookingProvider?.name,
        providerCategory: bookingProvider?.category,
        providerEmail: bookingProvider?.email || `${bookingProvider?.name?.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
        providerPhone: bookingProvider?.phone || "+91 9373571631",
        residentName: bookingResidentName,
        residentEmail: bookingResidentEmail,
        residentPhone: bookingPhone,
        societyName: bookingSociety,
        unitAddress: bookingUnit,
        serviceRequired: bookingService,
        date: bookingDate,
        time: bookingTime,
        rate: bookingProvider?.rate,
      };

      const res = await fetch('/api/services/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.booking) {
        setBookedDetails(data.booking);
      } else {
        setBookedDetails({ ...payload, id: `book_${Date.now()}` });
      }
      setBookingSuccess(true);
      toast.success(`Booking logged! Click below to send work order to ${bookingProvider?.name}'s Gmail.`);
    } catch (err) {
      setBookedDetails({
        providerId: bookingProvider?.id,
        providerName: bookingProvider?.name,
        providerCategory: bookingProvider?.category,
        providerEmail: bookingProvider?.email || `${bookingProvider?.name?.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
        providerPhone: bookingProvider?.phone || "+91 9373571631",
        residentName: bookingResidentName,
        residentEmail: bookingResidentEmail,
        residentPhone: bookingPhone,
        societyName: bookingSociety,
        unitAddress: bookingUnit,
        serviceRequired: bookingService,
        date: bookingDate,
        time: bookingTime,
        rate: bookingProvider?.rate,
        id: `book_${Date.now()}`,
      });
      setBookingSuccess(true);
      toast.success(`Booking logged successfully!`);
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const emailTo = bookedDetails?.providerEmail || bookingProvider?.email || `${bookingProvider?.name?.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`;
  const emailSubject = `[NearNest Work Request] Please come to ${bookedDetails?.unitAddress || bookingUnit}, ${bookedDetails?.societyName || bookingSociety} for ${bookedDetails?.serviceRequired || bookingService}`;
  const emailBody = `Dear ${bookingProvider?.name || 'Service Provider'},

You have received an official service work order from a society member on NearNest.

Please come to the society member premises at the scheduled time to inspect and complete the work:

=========================================
📍 WORK ORDER & LOCATION DETAILS:
=========================================
• Society / Apartment: ${bookedDetails?.societyName || bookingSociety}
• Flat / Tower Unit: ${bookedDetails?.unitAddress || bookingUnit}
• Society Member: ${bookedDetails?.residentName || bookingResidentName}
• Member Contact Phone: ${bookedDetails?.residentPhone || bookingPhone}
• Member Email: ${bookedDetails?.residentEmail || bookingResidentEmail}

=========================================
🛠️ SERVICE DETAILS:
=========================================
• Service Category: ${bookingProvider?.category}
• Work Required: ${bookedDetails?.serviceRequired || bookingService}
• Scheduled Date: ${bookedDetails?.date || bookingDate}
• Preferred Time: ${bookedDetails?.time || bookingTime}
• Estimated Rate: ${bookingProvider?.rate}

=========================================
INSTRUCTIONS FOR SERVICE PROVIDER:
=========================================
1. Please confirm your arrival time with the society member by replying to this email or calling ${bookedDetails?.residentPhone || bookingPhone}.
2. Carry your government or NearNest ID for security gate entry at ${bookedDetails?.societyName || bookingSociety}.
3. Complete the work professionally and collect payment directly as per agreed terms.

Thank you,
NearNest Community & Society Services Team`;

  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailTo)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  const mailtoUrl = `mailto:${encodeURIComponent(emailTo)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  const cleanPhone = (bookingProvider?.phone || "").replace(/[^0-9]/g, "");
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(`Hi ${bookingProvider?.name}, I booked your service on NearNest for "${bookedDetails?.serviceRequired || bookingService}" at ${bookedDetails?.unitAddress || bookingUnit}, ${bookedDetails?.societyName || bookingSociety} on ${bookedDetails?.date || bookingDate} at ${bookedDetails?.time || bookingTime}. Please check your Gmail or reply here to confirm. Thanks!`)}`;

  return (
    <div className="space-y-8">
      {/* Breadcrumbs & Navigation Back Link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium text-text-secondary">
          <Link href="/" className="flex items-center gap-1.5 hover:text-brand-600 transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
          <Link href="/feed" className="hover:text-brand-600 transition-colors">
            <span>Feed</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-text-primary font-semibold">Verified Services</span>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-text-secondary hover:text-brand-600 bg-surface border border-border-hairline hover:border-brand-500/30 hover:bg-brand-50/50 dark:hover:bg-brand-950/20 transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Verified Service Providers</h1>
          <p className="text-text-secondary mt-1">Hire trusted, background-checked neighborhood professionals</p>
        </div>
        <Button 
          onClick={() => setIsJoinModalOpen(true)}
          className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-sm flex items-center gap-2"
        >
          <Plus size={18} />
          Join as Provider
        </Button>
      </div>

      {/* Location Filter Pills */}
      <div className="bg-surface p-4 rounded-2xl border border-border-hairline shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-brand-500" />
            <span>Search by Neighborhood Location</span>
          </div>
          <button
            onClick={() => setSelectedNeighborhood("Greenfield Park")}
            className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 bg-brand-50 dark:bg-brand-950/40 px-2.5 py-1 rounded-full"
          >
            <Navigation className="w-3 h-3" />
            <span>Nearby GPS</span>
          </button>
        </div>

        <div className="flex overflow-x-auto gap-2 pb-1 hide-scrollbar">
          {NEIGHBORHOODS.map(hood => (
            <button
              key={hood}
              onClick={() => setSelectedNeighborhood(hood)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedNeighborhood === hood
                  ? "bg-brand-500 text-white shadow-sm font-semibold"
                  : "bg-surface-subtle text-text-secondary hover:text-text-primary hover:bg-surface border border-border-hairline"
              }`}
            >
              <MapPin className={`w-3 h-3 ${selectedNeighborhood === hood ? 'text-white' : 'text-text-tertiary'}`} />
              {hood}
            </button>
          ))}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
          <input 
            type="text" 
            placeholder="Search by specialty (e.g. plumber, electrician, tutor, deep cleaning)..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border-hairline rounded-xl focus:ring-2 focus:ring-brand-500 text-text-primary transition-all outline-none shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Categories Carousel */}
        <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-xs transition-all ${
                activeCategory === category 
                  ? "bg-text-primary text-canvas shadow-sm" 
                  : "bg-surface text-text-secondary border border-border-hairline hover:bg-surface-subtle"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProviders.map(provider => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              key={provider.id}
              className="bg-surface rounded-2xl p-5 border border-border-hairline shadow-card hover:shadow-card-hover transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img src={provider.avatar} alt={provider.name} className="w-12 h-12 rounded-full border border-border-hairline bg-surface-subtle" />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-bold text-base text-text-primary">{provider.name}</h3>
                        {provider.verified && (
                          <span title="ID Verified Provider">
                            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                          </span>
                        )}
                        {(provider as any).isCustom && (
                          (provider as any).status === 'PENDING' ? (
                            <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold rounded border border-amber-300">
                              ⏳ Pending Approval
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded">
                              ⭐ Verified Pro
                            </span>
                          )
                        )}
                      </div>
                      <span className="text-xs text-brand-600 font-semibold">{provider.category}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-text-secondary line-clamp-2 mb-4 leading-relaxed">
                  {provider.speciality}
                </p>

                <div className="space-y-2 py-3 border-y border-border-hairline text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-text-tertiary">Estimated Rate:</span>
                    <span className="font-bold text-text-primary">{provider.rate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-tertiary">Experience:</span>
                    <span className="text-text-secondary">{provider.experience}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-tertiary">Location:</span>
                    <span className="text-text-primary flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-brand-500" />
                      {provider.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-brand-600 font-medium">
                    <span>Distance:</span>
                    <span>{provider.distance} away</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span>{provider.rating}</span>
                  <span className="text-text-tertiary font-normal">({provider.reviews})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => openBookingModal(provider)}
                    className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs py-2 px-3.5 shadow-sm"
                  >
                    Hire Provider
                  </Button>
                  {(provider as any).isCustom && (
                    <button
                      onClick={() => handleDeleteService(provider.id, provider.name)}
                      className="p-2 bg-coral-50 hover:bg-coral-100 text-coral-600 rounded-xl transition-colors border border-coral-200"
                      title="Remove from Database"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredProviders.length === 0 && (
          <div className="col-span-full py-16 text-center bg-surface rounded-2xl border border-border-hairline p-8">
            <MapPin className="w-10 h-10 text-text-tertiary mx-auto mb-3" />
            <h3 className="text-base font-semibold text-text-primary">No service providers found for {selectedNeighborhood}</h3>
            <p className="text-xs text-text-secondary mt-1">Try choosing another location or clearing your specialty search.</p>
            <Button onClick={() => { setSelectedNeighborhood("All Locations"); setSearchQuery(""); setActiveCategory("All"); }} className="mt-4 text-xs">
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingProvider && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface rounded-3xl shadow-modal w-full max-w-lg overflow-hidden border border-border-hairline flex flex-col max-h-[92vh]"
            >
              <div className="p-5 border-b border-border-hairline flex justify-between items-center bg-surface-subtle shrink-0">
                <div className="flex items-center gap-3">
                  <img src={bookingProvider.avatar} alt={bookingProvider.name} className="w-10 h-10 rounded-full border border-border-hairline bg-surface" />
                  <div>
                    <h3 className="font-bold text-base text-text-primary flex items-center gap-1.5">
                      Hire {bookingProvider.name}
                      {bookingProvider.verified && <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />}
                    </h3>
                    <p className="text-xs text-text-secondary">{bookingProvider.category} • <span className="font-semibold text-brand-600">{bookingProvider.rate}</span></p>
                  </div>
                </div>
                <button 
                  onClick={() => { setBookingProvider(null); setBookingSuccess(false); }} 
                  className="p-2 hover:bg-surface rounded-full transition-colors text-text-secondary"
                >
                  <X size={18} />
                </button>
              </div>

              {bookingSuccess ? (
                <div className="p-6 space-y-4 overflow-y-auto">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>

                  <div className="text-center space-y-1">
                    <h4 className="text-lg font-bold text-text-primary">Booking Confirmed & Work Order Ready!</h4>
                    <p className="text-xs text-text-secondary">
                      Your service request has been logged in the NearNest database for <strong>{bookingProvider.name}</strong>.
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="p-4 bg-canvas rounded-2xl border border-border-hairline text-xs space-y-2.5">
                    <div className="flex justify-between items-center pb-2 border-b border-border-hairline">
                      <span className="text-text-tertiary">Service Provider:</span>
                      <span className="font-bold text-text-primary flex items-center gap-1.5">
                        {bookingProvider.name} ({bookingProvider.category})
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-tertiary">Provider Gmail:</span>
                      <span className="font-medium text-brand-600 truncate max-w-[220px]">
                        {bookedDetails?.providerEmail || emailTo}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-tertiary">Provider Phone:</span>
                      <span className="font-medium text-text-primary">
                        {bookedDetails?.providerPhone || bookingProvider.phone || "+91 9373571631"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-tertiary">Scheduled Date & Time:</span>
                      <span className="font-semibold text-text-primary">
                        {bookedDetails?.date || bookingDate} at {bookedDetails?.time || bookingTime}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-tertiary">Society Destination:</span>
                      <span className="font-semibold text-emerald-600">
                        {bookedDetails?.unitAddress || bookingUnit}, {bookedDetails?.societyName || bookingSociety}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-border-hairline">
                      <span className="text-text-tertiary block mb-1">Work Description:</span>
                      <p className="p-2.5 bg-surface rounded-xl text-text-primary font-medium border border-border-hairline text-xs">
                        {bookedDetails?.serviceRequired || bookingService}
                      </p>
                    </div>
                  </div>

                  {/* Instructions Callout */}
                  <div className="p-3.5 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900/30 text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5">
                    <Mail className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                    <div className="space-y-1">
                      <p className="font-bold">Email Notification to Service Provider</p>
                      <p className="text-[11px] leading-relaxed text-red-600/90 dark:text-red-300/80">
                        Click below to open Gmail. The work order is pre-formatted, requesting the provider to come directly to your society unit premises and complete the work at the scheduled time.
                      </p>
                    </div>
                  </div>

                  {/* Dispatch Action Buttons */}
                  <div className="space-y-2 pt-1">
                    <a
                      href={gmailWebUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Send Work Order via Gmail</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={mailtoUrl}
                        className="py-2.5 px-3 bg-surface hover:bg-surface-subtle border border-border-hairline text-text-primary rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5 text-text-tertiary" />
                        <span>Default Mail App</span>
                      </a>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp Alert</span>
                      </a>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setBookingSuccess(false);
                        setBookingProvider(null);
                      }}
                      className="w-full mt-2 text-xs py-2.5"
                    >
                      Done / Close
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBook} className="p-5 space-y-4 overflow-y-auto">
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1">
                      Service Description / Problem Details *
                    </label>
                    <textarea 
                      required 
                      rows={2}
                      value={bookingService}
                      onChange={(e) => setBookingService(e.target.value)}
                      placeholder="e.g. Master bathroom tap leaking continuously, needs inspection and washer replacement..." 
                      className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none text-text-primary" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">Scheduled Date *</label>
                      <input 
                        required 
                        type="date" 
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">Preferred Time *</label>
                      <input 
                        required 
                        type="time" 
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">Housing Society / Complex *</label>
                      <input 
                        required 
                        type="text" 
                        value={bookingSociety}
                        onChange={(e) => setBookingSociety(e.target.value)}
                        placeholder="e.g. Ajeenkya Residency" 
                        className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">Flat / Tower / Unit No. *</label>
                      <input 
                        required 
                        type="text" 
                        value={bookingUnit}
                        onChange={(e) => setBookingUnit(e.target.value)}
                        placeholder="e.g. Flat 402, Tower B" 
                        className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">Your Name *</label>
                      <input 
                        required 
                        type="text" 
                        value={bookingResidentName}
                        onChange={(e) => setBookingResidentName(e.target.value)}
                        placeholder="e.g. Priya Deshmukh" 
                        className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">Your Contact Phone *</label>
                      <input 
                        required 
                        type="tel" 
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                        placeholder="+91 98765 43210" 
                        className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" 
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900/30 text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
                    <span>
                      {bookingProvider.name} will receive this work order and arrive at your society flat to inspect and complete the work at the scheduled time.
                    </span>
                  </div>

                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      disabled={isSubmittingBooking}
                      className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-medium shadow-sm flex items-center justify-center gap-2"
                    >
                      {isSubmittingBooking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
                      <span>Confirm Booking & Prepare Gmail Order</span>
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Join as Provider Modal */}
      <AnimatePresence>
        {isJoinModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface rounded-3xl shadow-modal w-full max-w-lg overflow-hidden border border-border-hairline flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-border-hairline flex justify-between items-center bg-surface-subtle shrink-0">
                <div>
                  <h3 className="font-bold text-lg text-text-primary">Join as Verified Provider</h3>
                  <p className="text-xs text-text-secondary">Get hired directly by local residents & housing societies</p>
                </div>
                <button onClick={() => setIsJoinModalOpen(false)} className="p-2 hover:bg-surface rounded-full transition-colors">
                  <X size={18} className="text-text-secondary" />
                </button>
              </div>
              <div className="overflow-y-auto p-5">
                <form id="provider-form" onSubmit={handleAddService} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1">Full Name *</label>
                    <input 
                      required 
                      type="text" 
                      value={srvName}
                      onChange={(e) => setSrvName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar" 
                      className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">Service Skill *</label>
                      <select 
                        required 
                        value={srvCategory}
                        onChange={(e) => setSrvCategory(e.target.value)}
                        className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary"
                      >
                        {CATEGORIES.filter(c => c !== "All").map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">Primary Neighborhood</label>
                      <select 
                        required 
                        value={srvNeighborhood}
                        onChange={(e) => setSrvNeighborhood(e.target.value)}
                        className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary"
                      >
                        {NEIGHBORHOODS.filter(n => n !== "All Locations").map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">Hourly / Visit Rate *</label>
                      <input 
                        required 
                        type="text" 
                        value={srvRate}
                        onChange={(e) => setSrvRate(e.target.value)}
                        placeholder="e.g. ₹350/hr" 
                        className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">Years Experience</label>
                      <input 
                        required 
                        type="text" 
                        value={srvExperience}
                        onChange={(e) => setSrvExperience(e.target.value)}
                        placeholder="e.g. 5 years" 
                        className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">Contact Phone / WhatsApp *</label>
                      <input 
                        required 
                        type="tel" 
                        value={srvPhone}
                        onChange={(e) => setSrvPhone(e.target.value)}
                        placeholder="+91 98765 43210" 
                        className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">Gmail / Email for Work Orders *</label>
                      <input 
                        required 
                        type="email" 
                        value={srvEmail}
                        onChange={(e) => setSrvEmail(e.target.value)}
                        placeholder="provider@gmail.com" 
                        className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1">Description of Experience & Tools</label>
                    <textarea 
                      rows={2} 
                      value={srvSpeciality}
                      onChange={(e) => setSrvSpeciality(e.target.value)}
                      placeholder="Describe your background, specialty services, emergency call-outs..." 
                      className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none text-text-primary"
                    />
                  </div>
                </form>
              </div>
              <div className="p-5 border-t border-border-hairline bg-surface-subtle shrink-0">
                <Button 
                  type="submit" 
                  form="provider-form" 
                  disabled={isSubmittingSrv}
                  className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-medium shadow-sm flex items-center justify-center gap-2"
                >
                  {isSubmittingSrv ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus size={16} />}
                  <span>Save Provider to Database</span>
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-text-secondary">Loading service providers...</div>}>
      <ServicesContent />
    </React.Suspense>
  );
}

